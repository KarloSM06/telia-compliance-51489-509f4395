import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useTelephonyMetrics = (dateRange?: { from: Date; to: Date }) => {
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['telephony-metrics', dateRange],
    staleTime: 0,
    queryFn: async () => {
      // Get user's active telephony integrations
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: integrations } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .or('capabilities.cs.{voice},capabilities.cs.{sms}');

      const integrationIds = integrations?.map(i => i.id) || [];

      let query = supabase
        .from('telephony_events')
        .select('*')
        .in('integration_id', integrationIds);

      if (dateRange) {
        query = query
          .gte('event_timestamp', dateRange.from.toISOString())
          .lte('event_timestamp', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch agents for additional context
      const { data: agents } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id);

      // Calculate aggregated statistics
      const totalCalls = data.filter(e => e.event_type.includes('call')).length;
      const totalSMS = data.filter(e => e.event_type.includes('sms')).length;
      const totalDuration = data.reduce((sum, e) => sum + (e.duration_seconds || 0), 0);
      const totalCost = data.reduce((sum, e) => sum + (parseFloat(e.cost_amount as any) || 0), 0);

      // Group by provider
      const byProvider: Record<string, any> = {};
      data.forEach(event => {
        if (!byProvider[event.provider]) {
          byProvider[event.provider] = {
            calls: 0,
            sms: 0,
            duration: 0,
            cost: 0,
            events: [],
            agents: agents?.filter(a => a.provider === event.provider) || [],
          };
        }
        
        const p = byProvider[event.provider];
        if (event.event_type.includes('call')) p.calls++;
        if (event.event_type.includes('sms')) p.sms++;
        p.duration += event.duration_seconds || 0;
        p.cost += parseFloat(event.cost_amount as any) || 0;
        p.events.push(event);
      });

      // Group by agent
      const byAgent: Record<string, any> = {};
      data.forEach(event => {
        if (event.agent_id) {
          const agent = agents?.find(a => a.id === event.agent_id);
          if (agent && !byAgent[event.agent_id]) {
            byAgent[event.agent_id] = {
              agent,
              calls: 0,
              duration: 0,
              cost: 0,
              events: [],
            };
          }
          
          if (byAgent[event.agent_id]) {
            const a = byAgent[event.agent_id];
            if (event.event_type.includes('call')) a.calls++;
            a.duration += event.duration_seconds || 0;
            a.cost += parseFloat(event.cost_amount as any) || 0;
            a.events.push(event);
          }
        }
      });

      return {
        totalCalls,
        totalSMS,
        totalDuration,
        totalCost,
        totalEvents: data.length,
        byProvider,
        byAgent,
        events: data,
        agents: agents || [],
      };
    },
  });

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('telephony_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'telephony_events',
        },
        (payload) => {
          console.log('🔔 Telefoni-händelse:', payload.eventType, payload.new || payload.old);
          refetch();
          
          if (payload.eventType === 'INSERT') {
            toast.success('📞 Nytt samtal', {
              description: `${payload.new.event_type} från ${payload.new.provider}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            const normalized = payload.new?.normalized as any;
            if (normalized?.endedAt) {
              toast.info('✅ Samtal avslutat', {
                description: `${payload.new.event_type} - ${normalized.endedReason || 'completed'}`,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    metrics: metrics || {
      totalCalls: 0,
      totalSMS: 0,
      totalDuration: 0,
      totalCost: 0,
      totalEvents: 0,
      byProvider: {},
      byAgent: {},
      events: [],
      agents: [],
    },
    isLoading,
    refetch,
  };
};
