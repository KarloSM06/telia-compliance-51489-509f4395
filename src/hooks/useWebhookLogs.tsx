import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useWebhookLogs = (limit: number = 50) => {
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ['webhook-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telephony_webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });

  return {
    logs: logs || [],
    isLoading,
    refetch,
  };
};
