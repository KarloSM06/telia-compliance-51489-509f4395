import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageBody, messageLogId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log(`🤖 Classifying SMS ${messageLogId}...`);

    // Anropa Lovable AI för klassificering
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Du är en expert på att klassificera SMS-meddelanden. Analysera meddelandet och bestäm om det är en review (omdöme/feedback), en bokningsförfrågan, en fråga, eller ett generellt meddelande. Svara ENDAST med JSON i formatet: {"type": "review|booking_request|question|general", "confidence": 0.0-1.0, "reasoning": "kort förklaring", "sentiment": "positive|neutral|negative", "keywords": ["lista", "av", "nyckelord"]}'
          },
          {
            role: 'user',
            content: `Klassificera följande SMS:\n\n"${messageBody}"`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('❌ AI gateway error:', aiResponse.status, errorText);
      throw new Error(`AI classification failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Extrahera JSON från AI-svaret
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const classification = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      type: 'general',
      confidence: 0.5,
      reasoning: 'Could not parse AI response',
      sentiment: 'neutral',
      keywords: []
    };

    console.log(`✅ Classified as ${classification.type} (confidence: ${classification.confidence})`);

    // Uppdatera message_logs med klassificering
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabase
      .from('message_logs')
      .update({
        message_type: classification.type,
        ai_classification: {
          ...classification,
          classified_at: new Date().toISOString(),
          model: 'google/gemini-2.5-flash'
        }
      })
      .eq('id', messageLogId);

    if (updateError) {
      console.error('❌ Failed to update message_log:', updateError);
      throw updateError;
    }

    console.log(`📝 Updated message_log ${messageLogId} with classification`);

    return new Response(
      JSON.stringify({ success: true, classification }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in classify-sms:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
