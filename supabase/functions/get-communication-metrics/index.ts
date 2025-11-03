import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request body for date range
    const { dateFrom, dateTo } = await req.json();

    // Build date filter
    let dateFilter = '';
    if (dateFrom && dateTo) {
      dateFilter = `AND sent_at >= '${dateFrom}' AND sent_at <= '${dateTo}'`;
    }

    // Fetch message logs metrics
    const { data: messageLogs, error: logsError } = await supabase
      .from('message_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('sent_at', { ascending: false });

    if (logsError) throw logsError;

    // Filter by date if provided
    const filteredLogs = messageLogs?.filter(log => {
      if (!dateFrom || !dateTo) return true;
      const logDate = new Date(log.sent_at);
      return logDate >= new Date(dateFrom) && logDate <= new Date(dateTo);
    }) || [];

    // Aggregate SMS metrics
    const smsLogs = filteredLogs.filter(l => l.channel === 'sms');
    const smsMetrics = {
      total: smsLogs.length,
      sent: smsLogs.filter(l => l.status === 'sent' || l.status === 'delivered').length,
      failed: smsLogs.filter(l => l.status === 'failed').length,
      inbound: smsLogs.filter(l => l.direction === 'inbound').length,
      outbound: smsLogs.filter(l => l.direction === 'outbound').length,
      reviews: smsLogs.filter(l => l.message_type === 'review').length,
      cost: smsLogs.reduce((sum, l) => sum + (l.cost || 0), 0),
      byProvider: {} as Record<string, any>,
    };

    // Group SMS by provider
    smsLogs.forEach(log => {
      if (!smsMetrics.byProvider[log.provider]) {
        smsMetrics.byProvider[log.provider] = {
          count: 0,
          cost: 0,
          sent: 0,
          failed: 0,
        };
      }
      const p = smsMetrics.byProvider[log.provider];
      p.count++;
      p.cost += log.cost || 0;
      if (log.status === 'sent' || log.status === 'delivered') p.sent++;
      if (log.status === 'failed') p.failed++;
    });

    // Aggregate Email metrics
    const emailLogs = filteredLogs.filter(l => l.channel === 'email');
    const emailMetrics = {
      total: emailLogs.length,
      sent: emailLogs.filter(l => l.status === 'sent' || l.status === 'delivered').length,
      failed: emailLogs.filter(l => l.status === 'failed').length,
      opened: emailLogs.filter(l => l.opened_at).length,
      clicked: emailLogs.filter(l => l.clicked_at).length,
      cost: emailLogs.reduce((sum, l) => sum + (l.cost || 0), 0),
      byProvider: {} as Record<string, any>,
    };

    // Group Email by provider
    emailLogs.forEach(log => {
      if (!emailMetrics.byProvider[log.provider]) {
        emailMetrics.byProvider[log.provider] = {
          count: 0,
          cost: 0,
          sent: 0,
          failed: 0,
        };
      }
      const p = emailMetrics.byProvider[log.provider];
      p.count++;
      p.cost += log.cost || 0;
      if (log.status === 'sent' || log.status === 'delivered') p.sent++;
      if (log.status === 'failed') p.failed++;
    });

    // Fetch telephony events
    const { data: integrations } = await supabase
      .from('integrations')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .or('capabilities.cs.{voice},capabilities.cs.{sms}');

    const integrationIds = integrations?.map(i => i.id) || [];

    let telephonyQuery = supabase
      .from('telephony_events')
      .select('*')
      .in('integration_id', integrationIds);

    if (dateFrom && dateTo) {
      telephonyQuery = telephonyQuery
        .gte('event_timestamp', dateFrom)
        .lte('event_timestamp', dateTo);
    }

    const { data: telephonyEvents, error: telephonyError } = await telephonyQuery;
    if (telephonyError) throw telephonyError;

    // Filter to parent events only
    const parentEvents = telephonyEvents?.filter(e => 
      !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
    ) || [];

    const telephonyMetrics = {
      totalCalls: parentEvents.filter(e => e.event_type.includes('call')).length,
      totalSMS: parentEvents.filter(e => e.event_type.includes('sms')).length,
      totalDuration: parentEvents.reduce((sum, e) => sum + (e.duration_seconds || 0), 0),
      totalCost: parentEvents.reduce((sum, e) => {
        const cost = e.aggregate_cost_amount || parseFloat(e.cost_amount as any) || 0;
        return sum + cost;
      }, 0),
      byProvider: {} as Record<string, any>,
    };

    // Group telephony by provider
    parentEvents.forEach(event => {
      if (!telephonyMetrics.byProvider[event.provider]) {
        telephonyMetrics.byProvider[event.provider] = {
          calls: 0,
          sms: 0,
          duration: 0,
          cost: 0,
        };
      }
      const p = telephonyMetrics.byProvider[event.provider];
      if (event.event_type.includes('call')) p.calls++;
      if (event.event_type.includes('sms')) p.sms++;
      p.duration += event.duration_seconds || 0;
      p.cost += event.aggregate_cost_amount || parseFloat(event.cost_amount as any) || 0;
    });

    // Calculate daily trends
    const dailyTrends = calculateDailyTrends(filteredLogs, parentEvents);

    return new Response(
      JSON.stringify({
        sms: smsMetrics,
        email: emailMetrics,
        telephony: telephonyMetrics,
        trends: dailyTrends,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-communication-metrics:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function calculateDailyTrends(messageLogs: any[], telephonyEvents: any[]) {
  const trends: Record<string, any> = {};

  // Group message logs by date
  messageLogs.forEach(log => {
    const date = log.sent_at.split('T')[0];
    if (!trends[date]) {
      trends[date] = {
        date,
        sms: 0,
        email: 0,
        calls: 0,
        totalCost: 0,
      };
    }
    if (log.channel === 'sms') trends[date].sms++;
    if (log.channel === 'email') trends[date].email++;
    trends[date].totalCost += log.cost || 0;
  });

  // Add telephony events
  telephonyEvents.forEach(event => {
    const date = event.event_timestamp.split('T')[0];
    if (!trends[date]) {
      trends[date] = {
        date,
        sms: 0,
        email: 0,
        calls: 0,
        totalCost: 0,
      };
    }
    if (event.event_type.includes('call')) trends[date].calls++;
    trends[date].totalCost += event.aggregate_cost_amount || parseFloat(event.cost_amount as any) || 0;
  });

  return Object.values(trends).sort((a: any, b: any) => 
    a.date.localeCompare(b.date)
  );
}
