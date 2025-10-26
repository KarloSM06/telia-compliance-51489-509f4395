import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

  // Beräkna statistik
  const stats = {
    total: logs.length,
    sent: logs.filter(l => l.status === 'sent' || l.status === 'delivered').length,
    pending: logs.filter(l => l.status === 'sent' && !l.delivered_at).length,
    failed: logs.filter(l => l.status === 'failed').length,
    totalCost: logs.reduce((sum, l) => sum + (l.cost || 0), 0),
    smsCost: logs.filter(l => l.channel === 'sms').reduce((sum, l) => sum + (l.cost || 0), 0),
    emailCost: logs.filter(l => l.channel === 'email').reduce((sum, l) => sum + (l.cost || 0), 0),
  };

  return { logs, stats, isLoading };
};
