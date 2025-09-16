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
Du är en AI som fungerar som kvalitetskontrollant för mobilförsäljning
Din uppgift är att analysera säljsamtal och kontrollera att säljaren följer alla regler och riktlinjer för produkten (bredband, TV, streaming).

⚖️ Kontrollområden:

1. IDENTIFIERING & INTRODUKTION
- Presenterade agenten sig korrekt med namn och Telia?
- Kontrollerade agenten att det var rätt kund?
- Artigt bemötande?  

2. TRANSPARENS & PRODUKTINFORMATION
- Gav agenten korrekt information om tjänster och priser?
- Angavs att Telia sköter flytten och vad kunden ska godkänna?
- Ingen vilseledande information, överdrifter eller falska löften?

3. ERBJUDANDE & VÄRDE
- Besparingen visades korrekt i kronor per månad?
- Alla erbjudanden (t.ex. uppgraderingar, streaming) presenterades korrekt?
- Kunden förstår tydligt vad de säger ja till?

4. AVSLUT & GODKÄNNANDE
- Summerade agenten erbjudandet korrekt?
- Rätt avslutsfråga användes?
- Kunden fick möjlighet att förstå och godkänna?

5. REGLER & RIKTLINJER
- Säljaren följde Telias rutiner och lagkrav (ex. inga dolda kostnader, korrekt info om bindningstid, router, invändningar hanterade korrekt)?

SAMTALSTEXT:
${transcript}

📊 Ge din analys i följande JSON-format:
{
  "score": [0-100],
  "sale_outcome": [true/false],
  "duration_estimate": "[X minuter Y sekunder]",
  "analysis": "INTRODUKTION: XX% – kommentar\\nTRANSPARENS & PRODUKTINFORMATION: XX% – kommentar\\nERBJUDANDE & VÄRDE: XX% – kommentar\\nAVSLUT & GODKÄNNANDE: XX% – kommentar\\nREGLER & RIKTLINJER: XX% – kommentar\\nTOTALSCORE: XX%\\nEVENTUELLA RISKER / REGELBROTT: ...\\nREKOMMENDANTION: ...",
  "strengths": ["styrka 1", "styrka 2", "styrka 3"],
  "weaknesses": ["svaghet 1", "svaghet 2", "svaghet 3"],
  "improvements": ["förbättring 1", "förbättring 2", "förbättring 3"]
}

⚡ Djupnivå:
- Om order=True → gör en extra noggrann kontroll eftersom detta leder till avtal.  
- Om order=False → gör en enklare kontroll men markera om säljaren bröt mot någon regel.

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
        score: 50,
        sale_outcome: false,
        duration_estimate: "Okänd",
        analysis: "Analys kunde inte genomföras fullständigt",
        strengths: ["Samtalet genomfördes"],
        weaknesses: ["Teknisk analys misslyckades"],
        improvements: ["Försök igen med bättre ljudkvalitet"]
      };
    }

    console.log('Parsed analysis data:', analysisData);

    // Update call record with analysis
    const { error: finalUpdateError } = await supabase
      .from('calls')
      .update({
        status: 'completed',
        transcript: transcript,
        score: analysisData.score,
        sale_outcome: analysisData.sale_outcome,
        duration: analysisData.duration_estimate,
        analysis: analysisData.analysis,
        strengths: analysisData.strengths,
        weaknesses: analysisData.weaknesses,
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