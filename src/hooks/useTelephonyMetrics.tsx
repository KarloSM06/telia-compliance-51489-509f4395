import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useTelephonyMetrics = (dateRange?: { from: Date; to: Date }) => {
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['telephony-metrics', dateRange],
    queryFn: async () => {
      let query = supabase
        .from('telephony_events')
        .select('*');

      if (dateRange) {
        query = query
          .gte('event_timestamp', dateRange.from.toISOString())
          .lte('event_timestamp', dateRange.to.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

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
          };
        }
        
        const p = byProvider[event.provider];
        if (event.event_type.includes('call')) p.calls++;
        if (event.event_type.includes('sms')) p.sms++;
        p.duration += event.duration_seconds || 0;
        p.cost += parseFloat(event.cost_amount as any) || 0;
        p.events.push(event);
      });

      return {
        totalCalls,
        totalSMS,
        totalDuration,
        totalCost,
        totalEvents: data.length,
        byProvider,
        events: data,
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
          event: 'INSERT',
          schema: 'public',
          table: 'telephony_events',
        },
        (payload) => {
          console.log('🔔 Ny telefoni-händelse:', payload.new);
          refetch();
          
          toast.success('📞 Ny händelse', {
            description: `${payload.new.event_type} från ${payload.new.provider}`,
          });
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
      events: [],
    },
    isLoading,
    refetch,
  };
};
