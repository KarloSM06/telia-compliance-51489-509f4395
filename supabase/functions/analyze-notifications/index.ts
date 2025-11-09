import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { user_id, trigger_source = 'manual' } = await req.json();
    const userId = user_id || user.id;

    console.log(`Starting notification analysis for user ${userId}, trigger: ${trigger_source}`);

    // Check if analysis is already running
    const { data: runningAnalysis } = await supabaseClient
      .from('notification_insights')
      .select('id')
      .eq('user_id', userId)
      .eq('ai_model', 'analyzing')
      .maybeSingle();

    if (runningAnalysis) {
      console.log('Analysis already running, skipping');
      return new Response(
        JSON.stringify({ message: 'Analysis already in progress' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create placeholder insight while analyzing
    await supabaseClient
      .from('notification_insights')
      .insert({
        user_id: userId,
        analysis_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        analysis_period_end: new Date().toISOString(),
        ai_model: 'analyzing',
        confidence_score: 0,
      });

    // Fetch notifications from the last 30 days
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: notifications, error: notifError } = await supabaseClient
      .from('owner_notifications')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .order('created_at', { ascending: false });

    if (notifError) {
      console.error('Error fetching notifications:', notifError);
      throw notifError;
    }

    if (!notifications || notifications.length < 5) {
      console.log('Too few notifications for meaningful analysis, saving placeholder');
      
      const { data: placeholderInsight } = await supabaseClient
        .from('notification_insights')
        .insert({
          user_id: userId,
          analysis_period_start: startDate,
          analysis_period_end: new Date().toISOString(),
          total_notifications: notifications?.length || 0,
          total_sent: 0,
          total_read: 0,
          read_rate: 0,
          avg_read_time_minutes: 0,
          engagement_score: 0,
          engagement_trend: 'insufficient_data',
          channel_effectiveness: {},
          recommended_channels: [],
          type_distribution: {},
          high_priority_alerts: 0,
          optimization_suggestions: [],
          ai_model: 'none',
          confidence_score: 0,
        })
        .select()
        .single();

      // Delete the analyzing placeholder
      await supabaseClient
        .from('notification_insights')
        .delete()
        .eq('user_id', userId)
        .eq('ai_model', 'analyzing');

      return new Response(
        JSON.stringify({ message: 'Insufficient data for analysis', insight: placeholderInsight }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare notification data for AI analysis
    const notificationSummary = notifications.map(n => ({
      type: n.notification_type,
      priority: n.priority,
      status: n.status,
      channels: n.channel,
      sent_at: n.sent_at,
      read_at: n.read_at,
      created_at: n.created_at,
    }));

    // Calculate basic metrics
    const totalSent = notifications.filter(n => n.status === 'sent').length;
    const totalRead = notifications.filter(n => n.read_at).length;
    const readRate = totalSent > 0 ? (totalRead / totalSent) * 100 : 0;

    // Calculate avg read time
    const readTimes = notifications
      .filter(n => n.sent_at && n.read_at)
      .map(n => {
        const sent = new Date(n.sent_at!).getTime();
        const read = new Date(n.read_at!).getTime();
        return (read - sent) / 1000 / 60; // minutes
      });
    const avgReadTime = readTimes.length > 0 ? readTimes.reduce((a, b) => a + b, 0) / readTimes.length : 0;

    // Calculate channel effectiveness
    const channelStats: Record<string, { sent: number; read: number }> = {};
    notifications.forEach(n => {
      n.channel.forEach((ch: string) => {
        if (!channelStats[ch]) channelStats[ch] = { sent: 0, read: 0 };
        if (n.status === 'sent') channelStats[ch].sent++;
        if (n.read_at) channelStats[ch].read++;
      });
    });

    const channelEffectiveness: Record<string, any> = {};
    Object.entries(channelStats).forEach(([channel, stats]) => {
      const score = stats.sent > 0 ? (stats.read / stats.sent) * 100 : 0;
      channelEffectiveness[channel] = {
        sent: stats.sent,
        read: stats.read,
        score: Math.round(score),
      };
    });

    // Calculate type distribution
    const typeDistribution: Record<string, number> = {};
    notifications.forEach(n => {
      typeDistribution[n.notification_type] = (typeDistribution[n.notification_type] || 0) + 1;
    });

    const highPriorityAlerts = notifications.filter(n => n.priority === 'high').length;

    // Peak engagement hours
    const hourCounts: Record<number, number> = {};
    notifications.forEach(n => {
      if (n.read_at) {
        const hour = new Date(n.read_at).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      }
    });
    const peakEngagementHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // AI Analysis
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const analysisPrompt = `Analyze these notification metrics and provide insights:

Total Notifications: ${notifications.length}
Sent: ${totalSent}, Read: ${totalRead}, Read Rate: ${readRate.toFixed(1)}%
Avg Read Time: ${avgReadTime.toFixed(1)} minutes

Channel Effectiveness:
${Object.entries(channelEffectiveness).map(([ch, stats]) => `- ${ch}: ${stats.sent} sent, ${stats.read} read (${stats.score}% rate)`).join('\n')}

Type Distribution:
${Object.entries(typeDistribution).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

High Priority Alerts: ${highPriorityAlerts}
Peak Engagement Hours: ${peakEngagementHours.join(', ')}

Provide analysis in this exact JSON format:
{
  "engagement_score": 0-100,
  "engagement_trend": "improving|stable|declining",
  "recommended_channels": ["channel1", "channel2"],
  "optimization_suggestions": [
    {
      "title": "suggestion title",
      "description": "detailed description",
      "impact": "high|medium|low",
      "category": "timing|channel|content"
    }
  ],
  "confidence_score": 0-100
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a notification analytics expert. Analyze data and provide actionable insights in JSON format.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Extract JSON from response
    const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
    const aiInsights = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      engagement_score: 50,
      engagement_trend: 'stable',
      recommended_channels: ['email'],
      optimization_suggestions: [],
      confidence_score: 50,
    };

    // Store insights in database
    const { data: storedInsight, error: insertError } = await supabaseClient
      .from('notification_insights')
      .insert({
        user_id: userId,
        analysis_period_start: startDate,
        analysis_period_end: new Date().toISOString(),
        total_notifications: notifications.length,
        total_sent: totalSent,
        total_read: totalRead,
        read_rate: readRate,
        avg_read_time_minutes: avgReadTime,
        engagement_score: aiInsights.engagement_score,
        engagement_trend: aiInsights.engagement_trend,
        peak_engagement_hours: peakEngagementHours,
        channel_effectiveness: channelEffectiveness,
        recommended_channels: aiInsights.recommended_channels,
        type_distribution: typeDistribution,
        high_priority_alerts: highPriorityAlerts,
        optimization_suggestions: aiInsights.optimization_suggestions,
        ai_model: 'google/gemini-2.5-flash',
        confidence_score: aiInsights.confidence_score,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing insights:', insertError);
      throw insertError;
    }

    // Delete the analyzing placeholder
    await supabaseClient
      .from('notification_insights')
      .delete()
      .eq('user_id', userId)
      .eq('ai_model', 'analyzing');

    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Analysis completed',
        insight: storedInsight,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-notifications:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
