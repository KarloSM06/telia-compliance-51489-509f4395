import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update status to processing
    const { error: updateError } = await supabase
      .from('calls')
      .update({ status: 'processing' })
      .eq('file_path', filePath);

    if (updateError) {
      console.error('Error updating status:', updateError);
      throw updateError;
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('audio-files')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw downloadError;
    }

    console.log('File downloaded, size:', fileData.size);

    // Convert blob to array buffer for OpenAI
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Prepare FormData for OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([uint8Array], { type: 'audio/mpeg' });
    formData.append('file', blob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('language', 'sv'); // Swedish language

    console.log('Sending to OpenAI Whisper...');

    // Transcribe with OpenAI Whisper
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('OpenAI Whisper error:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcript = transcriptionResult.text;

    console.log('Transcription completed, length:', transcript.length);

    // Analyze with GPT-4
    console.log('Starting AI analysis...');
    
    const analysisPrompt = `
Du är en AI som kontrollerar att säljsamtal följer Telias kvalitetsriktlinjer.

KVALITETSRIKTLINJER SOM MÅSTE FÖLJAS:

GENERELLA RIKTLINJER:
- Vi ska ALLTID vara trevlig och väl bemötande emot kund
- Vi ska ALDRIG klicka en kund
- Vi får INTE under några omständigheter uppmana kund att avsluta befintliga tjänster
- Vi får INTE under några omständigheter ljuga om pris eller bindningstid
- Vi får INTE säga till kund att de får samma pris efter 12 månader

TV & STREAMING:
- Vi får ABSOLUT INTE ljuga eller missleda att en viss kanal ingår i vårat TV paket
- Vi får ABSOLUT INTE ljuga eller missleda om innehåll och kvalité på streamingtjänster
- Om kund frågar om reklam på en viss streamingtjänst så måste det ALLTID svaras ärligt

TELIA PLAY & TV BOX:
- I Telia play appen så kan max 2 enheter kolla samtidigt men vara inloggad på 5 enheter samtidigt
- TV boxar räknas inte in i antal max enheter om kunden kollar på vanliga program, vid streaming av innehåll i Telia play som exempelvis filmer, serier & dokumentärer så räknas det in i begränsningen
- Vi får säga till kund att fortsätta med befintlig TV utrustning endast om vi klargör för kunden att de kommer behöva ladda ner Telia play appen i boxen

UPPSÄGNING OCH BINDNINGSTID:
- Vi får ABSOLUT INTE säga till kund att vi avslutar befintliga tjänster (förutom streamingtjänster)
- Skjut ALLTID upp ett abonnemang i minst 1 månad med hänsyn till kundens uppsägningstid (gäller ej vid streamingtjänster)
- Det måste framgå i varje samtal där vi säljer bredband och TV att kunden behöver säga upp sitt nuvarande abonnemang
- Vi får som max skjuta fram ett abonnemang i 3 månader
- Om Kund har bindningstid i mer än 3 månader så behöver säljaren och kund komma överens om att kunden tar en slutfaktura (Vid TV och streaming så är det OK att kunden betalar dubbelt)

SAMTALSTEXT:
${transcript}

ANALYSERA SAMTALET ENLIGT FÖLJANDE:
1. Gå igenom samtalet kronologiskt
2. Flagga ALLA överträdelser av riktlinjerna med röd markering
3. Ange tidpunkt i samtalet när överträdelsen sker
4. Om INGA överträdelser hittas, markera med grön text

📊 Ge din analys i följande JSON-format:
{
  "sale_outcome": [true/false],
  "duration_estimate": "[X minuter Y sekunder]",
  "analysis": "Kronologisk analys av samtalet med röda/gröna markeringar",
  "violations": [
    {
      "timestamp": "tidpunkt i samtalet",
      "rule": "vilken regel som bröts",
      "description": "vad som sa/gjordes",
      "severity": "high/medium/low"
    }
  ],
  "compliance_status": "compliant/violations_found",
  "strengths": ["positiva aspekter av samtalet"],
  "improvements": ["förbättringsområden"]
}

Svara ENDAST med JSON-objektet, ingen annan text.
`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert på säljsamtalsanalys. Svara alltid med valid JSON.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI GPT error:', errorText);
      throw new Error(`Analysis failed: ${errorText}`);
    }

    const analysisResult = await analysisResponse.json();
    const analysisText = analysisResult.choices[0].message.content;

    console.log('Raw analysis result:', analysisText);

    // Parse the JSON response
    let analysisData;
    try {
      analysisData = JSON.parse(analysisText);
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError);
      // Fallback analysis
      analysisData = {
        sale_outcome: false,
        duration_estimate: "Okänd",
        analysis: "Analys kunde inte genomföras fullständigt",
        violations: [],
        compliance_status: "violations_found",
        strengths: ["Samtalet genomfördes"],
        improvements: ["Försök igen med bättre ljudkvalitet"]
      };
    }

    console.log('Parsed analysis data:', analysisData);

    // Calculate score based on violations
    const violationCount = analysisData.violations ? analysisData.violations.length : 0;
    const calculatedScore = analysisData.compliance_status === 'compliant' ? 100 : Math.max(0, 100 - (violationCount * 20));

    // Update call record with analysis
    const { error: finalUpdateError } = await supabase
      .from('calls')
      .update({
        status: 'completed',
        transcript: transcript,
        score: calculatedScore,
        sale_outcome: analysisData.sale_outcome,
        duration: analysisData.duration_estimate,
        analysis: analysisData.analysis,
        strengths: analysisData.strengths || [],
        weaknesses: analysisData.violations ? analysisData.violations.map(v => v.description) : [],
        improvements: analysisData.improvements,
      })
      .eq('file_path', filePath);

    if (finalUpdateError) {
      console.error('Error updating call record:', finalUpdateError);
      throw finalUpdateError;
    }

    // Update user analysis
    await updateUserAnalysis(supabase, filePath);

    console.log('Call processing completed successfully');

    return new Response(
      JSON.stringify({ success: true, analysis: analysisData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing call:', error);

    // Try to update status to error if possible
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      // Parse request body only once at the beginning
      const requestBody = await req.clone().json();
      const filePath = requestBody.filePath;
      
      if (filePath) {
        await supabase
          .from('calls')
          .update({ status: 'error' })
          .eq('file_path', filePath);
      }
    } catch (updateError) {
      console.error('Error updating error status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function updateUserAnalysis(supabase: any, filePath: string) {
  try {
    // Get user_id from the call
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .select('user_id')
      .eq('file_path', filePath)
      .single();

    if (callError || !callData) {
      console.error('Error getting user_id:', callError);
      return;
    }

    const userId = callData.user_id;

    // Get all completed calls for this user
    const { data: userCalls, error: callsError } = await supabase
      .from('calls')
      .select('score, sale_outcome, strengths, weaknesses')
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (callsError) {
      console.error('Error fetching user calls:', callsError);
      return;
    }

    if (!userCalls || userCalls.length === 0) {
      return;
    }

    // Calculate statistics
    const totalCalls = userCalls.length;
    const validScores = userCalls.filter(call => call.score !== null).map(call => call.score);
    const averageScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : null;
    
    const successfulCalls = userCalls.filter(call => call.sale_outcome === true).length;
    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : null;

    // Aggregate strengths and weaknesses
    const allStrengths: string[] = [];
    const allWeaknesses: string[] = [];
    
    userCalls.forEach(call => {
      if (call.strengths) allStrengths.push(...call.strengths);
      if (call.weaknesses) allWeaknesses.push(...call.weaknesses);
    });

    // Find most common strength and weakness
    const strengthCounts = countOccurrences(allStrengths);
    const weaknessCounts = countOccurrences(allWeaknesses);
    
    const biggestStrength = Object.keys(strengthCounts).sort((a, b) => strengthCounts[b] - strengthCounts[a])[0] || null;
    const biggestWeakness = Object.keys(weaknessCounts).sort((a, b) => weaknessCounts[b] - weaknessCounts[a])[0] || null;

    // Generate recommendations
    const recommendations = generateRecommendations(averageScore, successRate, biggestWeakness);

    // Upsert user analysis
    const { error: upsertError } = await supabase
      .from('user_analysis')
      .upsert({
        user_id: userId,
        total_calls: totalCalls,
        average_score: averageScore,
        success_rate: successRate,
        biggest_strength: biggestStrength,
        biggest_weakness: biggestWeakness,
        recommendations: recommendations,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      console.error('Error updating user analysis:', upsertError);
    } else {
      console.log('User analysis updated successfully');
    }

  } catch (error) {
    console.error('Error in updateUserAnalysis:', error);
  }
}

function countOccurrences(arr: string[]): Record<string, number> {
  return arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function generateRecommendations(averageScore: number | null, successRate: number | null, biggestWeakness: string | null): string[] {
  const recommendations: string[] = [];
  
  if (averageScore !== null && averageScore < 70) {
    recommendations.push("Fokusera på grundläggande säljtekniker och kundinteraktion");
  }
  
  if (successRate !== null && successRate < 30) {
    recommendations.push("Förbättra avslutningstekniker och objection handling");
  }
  
  if (biggestWeakness) {
    recommendations.push(`Utveckla specifikt: ${biggestWeakness}`);
  }
  
  recommendations.push("Fortsätt träna regelbundet för att förbättra prestationen");
  
  return recommendations;
}