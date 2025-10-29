import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export interface MessageLog {
  id: string;
  user_id: string;
  calendar_event_id?: string;
  scheduled_message_id?: string;
  channel: 'sms' | 'email';
  recipient: string;
  message_body: string;
  subject?: string;
  provider: string;
  provider_type?: string;
  provider_message_id?: string;
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  direction?: 'inbound' | 'outbound';
  message_source?: 'calendar_notification' | 'ai_agent' | 'manual' | 'webhook';
  message_type?: 'review' | 'general' | 'booking_request' | 'question';
  ai_classification?: any;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  error_message?: string;
  metadata: any;
  cost?: number;
  created_at: string;
}

export interface MessageLogFilters {
  channel?: 'sms' | 'email';
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const useMessageLogs = (filters?: MessageLogFilters) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['message-logs', user?.id, filters],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('message_logs')
        .select('*')
        .order('sent_at', { ascending: false });

      if (filters?.channel) {
        query = query.eq('channel', filters.channel);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.dateFrom) {
        query = query.gte('sent_at', filters.dateFrom);
      }
      if (filters?.dateTo) {
        query = query.lte('sent_at', filters.dateTo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MessageLog[];
    },
    enabled: !!user,
  });

  // Realtime subscription för message logs
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('message-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_logs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📨 Realtime message update:', payload);
          queryClient.invalidateQueries({ queryKey: ['message-logs', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Beräkna statistik
  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent' || l.status === 'delivered').length,
    pending: logs.filter(l => l.status === 'sent' && !l.delivered_at).length,
    failed: logs.filter(l => l.status === 'failed').length,
    inbound: logs.filter(l => l.direction === 'inbound').length,
    outbound: logs.filter(l => l.direction === 'outbound').length,
    reviews: logs.filter(l => l.message_type === 'review').length,
    fromCalendar: logs.filter(l => l.message_source === 'calendar_notification').length,
    fromAI: logs.filter(l => l.message_source === 'ai_agent').length,
    totalCost: logs.reduce((sum, l) => sum + (l.cost || 0), 0),
    smsCost: logs.filter(l => l.channel === 'sms').reduce((sum, l) => sum + (l.cost || 0), 0),
    emailCost: logs.filter(l => l.channel === 'email').reduce((sum, l) => sum + (l.cost || 0), 0),
  };

  return { logs, stats, isLoading };
};
