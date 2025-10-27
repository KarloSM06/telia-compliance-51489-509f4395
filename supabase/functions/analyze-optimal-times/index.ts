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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Fetch message logs for analysis
    const { data: logs, error: logsError } = await supabaseClient
      .from('message_logs')
      .select('channel, sent_at, opened_at, clicked_at, status')
      .eq('user_id', user.id)
      .not('opened_at', 'is', null)
      .order('sent_at', { ascending: false })
      .limit(1000);

    if (logsError) throw logsError;

    if (!logs || logs.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'Inte tillräckligt med data för analys',
          recommendations: {
            sms: { hour: 10, reason: 'Standard optimal tid' },
            email: { hour: 9, reason: 'Standard optimal tid' },
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Analyze open rates by hour
    const hourlyStats: { [hour: number]: { sent: number; opened: number; clicked: number } } = {};

    logs.forEach((log) => {
      const sentDate = new Date(log.sent_at);
      const hour = sentDate.getHours();

      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { sent: 0, opened: 0, clicked: 0 };
      }

      hourlyStats[hour].sent++;
      if (log.opened_at) hourlyStats[hour].opened++;
      if (log.clicked_at) hourlyStats[hour].clicked++;
    });

    // Calculate open rates
    const hourlyOpenRates = Object.entries(hourlyStats).map(([hour, stats]) => ({
      hour: parseInt(hour),
      openRate: stats.sent > 0 ? (stats.opened / stats.sent) * 100 : 0,
      clickRate: stats.sent > 0 ? (stats.clicked / stats.sent) * 100 : 0,
      sampleSize: stats.sent,
    }));

    // Sort by open rate and find best times
    const bestHours = hourlyOpenRates
      .filter((h) => h.sampleSize >= 10) // Only consider hours with enough data
      .sort((a, b) => b.openRate - a.openRate)
      .slice(0, 3);

    // Generate recommendations using AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    let aiInsights = '';
    if (LOVABLE_API_KEY) {
      const prompt = `Baserat på följande data om när meddelanden öppnas, ge 2-3 meningar med rekommendationer på bästa tidpunkter att skicka påminnelser:

Bästa tider (timme på dygnet):
${bestHours.map(h => `Kl ${h.hour}:00 - Öppningsfrekvens: ${h.openRate.toFixed(1)}% (${h.sampleSize} meddelanden)`).join('\n')}

Ge praktiska råd på svenska om när användaren bör schemalägga sina påminnelser.`;

      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'Du är en expert på att optimera meddelandetidpunkter.' },
              { role: 'user', content: prompt },
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiInsights = aiData.choices?.[0]?.message?.content || '';
        }
      } catch (error) {
        console.error('AI analysis error:', error);
      }
    }

    // Default recommendations if no best hours found
    const defaultRecommendations = {
      sms: { hour: 10, reason: 'Optimal tid baserad på branschstandard' },
      email: { hour: 9, reason: 'Optimal tid baserad på branschstandard' },
    };

    const recommendations = bestHours.length > 0
      ? {
          primary: {
            hour: bestHours[0].hour,
            openRate: bestHours[0].openRate,
            reason: `Högst öppningsfrekvens (${bestHours[0].openRate.toFixed(1)}%)`,
          },
          secondary: bestHours.length > 1
            ? {
                hour: bestHours[1].hour,
                openRate: bestHours[1].openRate,
                reason: `Näst högst öppningsfrekvens (${bestHours[1].openRate.toFixed(1)}%)`,
              }
            : null,
        }
      : defaultRecommendations;

    return new Response(
      JSON.stringify({
        recommendations,
        hourlyStats: hourlyOpenRates,
        totalAnalyzed: logs.length,
        aiInsights,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in analyze-optimal-times function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
