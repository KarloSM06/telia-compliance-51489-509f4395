import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();
    
    if (!filePath) {
      throw new Error('File path is required');
    }

    console.log('Processing call for file:', filePath);

    const encryptionKey = Deno.env.get('ENCRYPTION_KEY') ?? '';
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY') ?? '';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase
      .from('calls')
      .update({ status: 'processing' })
      .eq('file_path', filePath);

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('audio-files')
      .download(filePath);

    if (downloadError) throw downloadError;

    console.log('File downloaded, sending to Lovable AI...');

    const arrayBuffer = await fileData.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    const analysisPrompt = `
Du är en AI som kontrollerar att säljsamtal följer Telias kvalitetsriktlinjer.

INSTRUKTION: Du får en ljudfil av ett svenskt säljsamtal. 
1. Transkribera ljudet till text
2. Analysera samtalet enligt riktlinjerna nedan

KVALITETSRIKTLINJER:
- Vi ska ALLTID vara trevlig och väl bemötande
- Vi ska ALDRIG klicka en kund
- Vi får INTE uppmana kund att avsluta befintliga tjänster
- Vi får INTE ljuga om pris eller bindningstid
- Vi får INTE säga att kund får samma pris efter 12 månader

TV & STREAMING:
- Vi får ABSOLUT INTE ljuga om vilka kanaler som ingår
- Vi får ABSOLUT INTE ljuga om innehåll och kvalité på streamingtjänster
- Om kund frågar om reklam måste det besvaras ärligt

TELIA PLAY & TV BOX:
- Max 2 enheter kan kolla samtidigt, vara inloggad på 5 enheter
- TV boxar räknas inte in i antal max enheter vid vanliga program

UPPSÄGNING:
- Vi får ALDRIG säga att vi avslutar befintliga tjänster (förutom streaming)
- Skjut upp abonnemang minst 1 månad med hänsyn till uppsägningstid
- Max 3 månader framskjutning
- Vid längre bindningstid behövs överenskommelse om slutfaktura

ANALYSERA:
1. Gå igenom samtalet kronologiskt
2. Flagga ALLA överträdelser
3. Ange tidpunkt för varje överträdelse

Svara med JSON enligt detta format:
{
  "transcript": "Full transkribering av samtalet",
  "sale_outcome": true/false,
  "duration_estimate": "X minuter Y sekunder",
  "analysis": "Kronologisk analys",
  "violations": [
    {
      "timestamp": "tidpunkt",
      "rule": "vilken regel",
      "description": "vad som sades",
      "severity": "high/medium/low"
    }
  ],
  "compliance_status": "compliant/violations_found",
  "strengths": ["positiva aspekter"],
  "improvements": ["förbättringsområden"]
}
`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              {
                type: 'input_audio',
                input_audio: {
                  data: base64Audio,
                  format: 'mp3'
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', errorText);
      throw new Error(`AI analysis failed: ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    const resultText = aiResult.choices[0].message.content;
    
    console.log('AI result:', resultText);

    let analysisData;
    try {
      analysisData = JSON.parse(resultText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      analysisData = {
        transcript: resultText,
        sale_outcome: false,
        duration_estimate: "Okänd",
        analysis: "Analys kunde inte genomföras",
        violations: [],
        compliance_status: "violations_found",
        strengths: ["Samtalet genomfördes"],
        improvements: ["Försök igen"]
      };
    }

    const violationCount = analysisData.violations ? analysisData.violations.length : 0;
    const calculatedScore = analysisData.compliance_status === 'compliant' ? 100 : Math.max(0, 100 - (violationCount * 20));

    const encryptedTranscript = await encryptText(analysisData.transcript || '', encryptionKey);
    
    const encryptedAnalysisData = {
      analysis: analysisData.analysis,
      strengths: analysisData.strengths || [],
      weaknesses: analysisData.violations ? analysisData.violations.map(v => v.description) : [],
      improvements: analysisData.improvements,
      violations: analysisData.violations || []
    };

    await supabase
      .from('calls')
      .update({
        status: 'completed',
        encrypted_transcript: encryptedTranscript,
        encrypted_analysis: encryptedAnalysisData,
        score: calculatedScore,
        sale_outcome: analysisData.sale_outcome,
        duration: analysisData.duration_estimate,
      })
      .eq('file_path', filePath);

    await updateUserAnalysis(supabase, filePath);

    console.log('Deleting audio file:', filePath);
    await supabase.storage.from('audio-files').remove([filePath]);
    await supabase.from('calls').update({ file_path: null }).eq('file_path', filePath);

    console.log('Processing completed');

    return new Response(
      JSON.stringify({ success: true, analysis: analysisData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);

    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      const requestBody = await req.clone().json();
      const filePath = requestBody.filePath;
      
      if (filePath) {
        await supabase.from('calls').update({ status: 'error' }).eq('file_path', filePath);
      }
    } catch (updateError) {
      console.error('Error updating error status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function updateUserAnalysis(supabase: any, filePath: string) {
  const { data: callData } = await supabase
    .from('calls')
    .select('user_id')
    .eq('file_path', filePath)
    .single();

  if (!callData) return;

  const { data: allCalls } = await supabase
    .from('calls')
    .select('score, sale_outcome, encrypted_analysis')
    .eq('user_id', callData.user_id)
    .eq('status', 'completed');

  if (!allCalls || allCalls.length === 0) return;

  const totalCalls = allCalls.length;
  const avgScore = allCalls.reduce((sum, call) => sum + (call.score || 0), 0) / totalCalls;
  const successfulCalls = allCalls.filter(call => call.sale_outcome === true).length;
  const successRate = (successfulCalls / totalCalls) * 100;

  const allStrengths: string[] = [];
  const allWeaknesses: string[] = [];

  allCalls.forEach(call => {
    if (call.encrypted_analysis?.strengths) {
      allStrengths.push(...call.encrypted_analysis.strengths);
    }
    if (call.encrypted_analysis?.weaknesses) {
      allWeaknesses.push(...call.encrypted_analysis.weaknesses);
    }
  });

  const strengthCounts = countOccurrences(allStrengths);
  const weaknessCounts = countOccurrences(allWeaknesses);

  const topStrengths = Object.entries(strengthCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([strength]) => strength);

  const topWeaknesses = Object.entries(weaknessCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([weakness]) => weakness);

  const recommendations = generateRecommendations(avgScore, successRate, topWeaknesses[0]);

  const insights = {
    top_strengths: topStrengths,
    top_weaknesses: topWeaknesses,
    recommendations: recommendations
  };

  await supabase
    .from('user_analysis')
    .upsert({
      user_id: callData.user_id,
      total_calls: totalCalls,
      average_score: avgScore,
      success_rate: successRate,
      encrypted_insights: insights
    }, { onConflict: 'user_id' });
}

function countOccurrences(arr: string[]): { [key: string]: number } {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
}

async function encryptText(text: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const keyData = encoder.encode(key);
  
  const encrypted = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = data[i] ^ keyData[i % keyData.length];
  }
  
  return btoa(String.fromCharCode.apply(null, Array.from(encrypted)));
}

function generateRecommendations(avgScore: number, successRate: number, biggestWeakness: string): string[] {
  const recommendations: string[] = [];

  if (avgScore < 70) {
    recommendations.push("Fokusera på att följa kvalitetsriktlinjerna mer noggrant");
  }
  
  if (successRate < 30) {
    recommendations.push("Arbeta på att identifiera kundbehov bättre");
    recommendations.push("Öva på att hantera invändningar");
  }
  
  if (biggestWeakness) {
    recommendations.push(`Speciell fokus på: ${biggestWeakness}`);
  }
  
  if (avgScore >= 80) {
    recommendations.push("Fortsätt det goda arbetet!");
  }

  return recommendations;
}
