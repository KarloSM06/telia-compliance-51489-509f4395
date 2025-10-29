import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useTelephonyMessages = (dateRange?: { from: Date; to: Date }) => {
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['telephony-messages', dateRange],
    staleTime: 0,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: integrations } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .contains('capabilities', ['sms']);

      const integrationIds = integrations?.map(i => i.id) || [];

      let query = supabase
        .from('telephony_events')
        .select('*')
        .in('integration_id', integrationIds)
        .like('event_type', '%message%');

      if (dateRange) {
        query = query
          .gte('event_timestamp', dateRange.from.toISOString())
          .lte('event_timestamp', dateRange.to.toISOString());
      }

      const { data, error } = await query.order('event_timestamp', { ascending: false });
      if (error) throw error;

      // Calculate SMS statistics
      const inbound = data.filter(e => (e.normalized as any)?.direction === 'inbound');
      const outbound = data.filter(e => (e.normalized as any)?.direction === 'outbound');
      const delivered = data.filter(e => (e.normalized as any)?.status === 'delivered');
      const failed = data.filter(e => (e.normalized as any)?.status === 'failed' || (e.normalized as any)?.status === 'undelivered');
      const totalCost = data.reduce((sum, e) => sum + (parseFloat(e.cost_amount as any) || 0), 0);
      const totalSegments = data.reduce((sum, e) => sum + ((e.normalized as any)?.numSegments || 1), 0);

      return {
        messages: data,
        totalMessages: data.length,
        inboundCount: inbound.length,
        outboundCount: outbound.length,
        deliveredCount: delivered.length,
        failedCount: failed.length,
        totalCost,
        totalSegments,
      };
    },
  });

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('telephony_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'telephony_events',
          filter: 'event_type=like.%message%',
        },
        (payload) => {
          console.log('📨 SMS-händelse:', payload.eventType, payload.new || payload.old);
          refetch();
          
          if (payload.eventType === 'INSERT') {
            const normalized = payload.new?.normalized as any;
            const direction = normalized?.direction === 'inbound' ? 'Inkommande' : 'Utgående';
            toast.success(`📨 ${direction} SMS`, {
              description: `${normalized?.from || ''} → ${normalized?.to || ''}`,
            });
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
      messages: [],
      totalMessages: 0,
      inboundCount: 0,
      outboundCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      totalCost: 0,
      totalSegments: 0,
    },
    isLoading,
    refetch,
  };
};
