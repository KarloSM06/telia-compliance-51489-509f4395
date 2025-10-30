import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, dateFrom, dateTo } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Hämta data från alla källor
    const [reviewsData, telephonyData, smsData, emailData] = await Promise.all([
      // Recensioner
      supabaseClient
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo)
        .not('rating', 'is', null),
      
      // Telefoni-transkript
      supabaseClient
        .from('telephony_events')
        .select('id, call_id, transcript, metadata, created_at')
        .eq('user_id', userId)
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo)
        .not('transcript', 'is', null),
      
      // SMS
      supabaseClient
        .from('message_logs')
        .select('id, content, direction, metadata, created_at')
        .eq('user_id', userId)
        .eq('channel', 'sms')
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo),
      
      // Email
      supabaseClient
        .from('message_logs')
        .select('id, content, direction, metadata, created_at')
        .eq('user_id', userId)
        .eq('channel', 'email')
        .gte('created_at', dateFrom)
        .lte('created_at', dateTo)
    ]);

    if (reviewsData.error) throw reviewsData.error;
    if (telephonyData.error) throw telephonyData.error;
    if (smsData.error) throw smsData.error;
    if (emailData.error) throw emailData.error;

    const reviews = reviewsData.data || [];
    const telephony = telephonyData.data || [];
    const sms = smsData.data || [];
    const email = emailData.data || [];

    // Förbered data för AI-analys
    const analysisData = {
      reviews: reviews.map(r => ({
        rating: r.rating,
        comment: r.comment,
        date: r.submitted_at || r.created_at
      })),
      telephony: telephony.map(t => ({
        transcript: t.transcript,
        date: t.created_at
      })),
      sms: sms.map(s => ({
        content: s.content,
        direction: s.direction,
        date: s.created_at
      })),
      email: email.map(e => ({
        content: e.content,
        direction: e.direction,
        date: e.created_at
      }))
    };

    // Anropa Lovable AI för analys
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY är inte konfigurerad');
    }

    const prompt = `Du är en expert på kundupplevelse och feedbackanalys. Analysera följande data från olika kanaler och ge konkreta förbättringsinsikter.

Data att analysera:
${JSON.stringify(analysisData, null, 2)}

Ge ett strukturerat svar med följande format (returnera endast JSON, ingen annan text):
{
  "overallSentiment": "positive" | "neutral" | "negative",
  "sentimentScore": number (0-100),
  "topPositiveDrivers": [
    { "driver": "string", "impact": "high" | "medium" | "low", "frequency": number }
  ],
  "topNegativeDrivers": [
    { "driver": "string", "impact": "high" | "medium" | "low", "frequency": number }
  ],
  "improvementSuggestions": [
    {
      "title": "string",
      "description": "string",
      "priority": "high" | "medium" | "low",
      "category": "service" | "product" | "communication" | "process" | "other",
      "expectedImpact": "string"
    }
  ],
  "keyInsights": [
    "string"
  ],
  "trends": {
    "sentimentTrend": "improving" | "stable" | "declining",
    "commonThemes": ["string"]
  }
}

Fokusera på:
1. Konkreta, handlingsbara förbättringsförslag
2. Identifiera mönster över alla kanaler
3. Prioritera förslag efter förväntad effekt
4. Ge minst 3-5 förbättringsförslag`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Du är en expert på kundupplevelse och feedbackanalys. Returnera endast giltigt JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits nådda, försök igen senare.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Lägg till krediter i din Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      throw new Error('AI-analys misslyckades');
    }

    const aiData = await aiResponse.json();
    const insights = JSON.parse(aiData.choices[0].message.content);

    // Lägg till metadata
    const result = {
      ...insights,
      metadata: {
        analyzedAt: new Date().toISOString(),
        dataPoints: {
          reviews: reviews.length,
          telephony: telephony.length,
          sms: sms.length,
          email: email.length,
          total: reviews.length + telephony.length + sms.length + email.length
        },
        dateRange: { from: dateFrom, to: dateTo }
      }
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-reviews function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});