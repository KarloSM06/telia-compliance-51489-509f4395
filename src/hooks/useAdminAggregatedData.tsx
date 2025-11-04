import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/queryKeys';
import { useUserRole } from './useUserRole';

interface AggregatedData {
  telephony: {
    total_calls: number;
    total_sms: number;
    total_duration_seconds: number;
    total_cost: number;
    unique_users: number;
    by_provider: Record<string, number>;
  };
  meetings: {
    total_meetings: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    total_revenue: number;
  };
  leads: {
    total_leads: number;
    by_status: Record<string, number>;
  };
  users: {
    total_users: number;
    active_users: number;
  };
  calls: {
    total_calls: number;
    avg_score: number;
    with_transcripts: number;
  };
}

export const useAdminAggregatedData = (dateRange?: { from: Date; to: Date }) => {
  const { isAdmin } = useUserRole();

  return useQuery({
    queryKey: queryKeys.admin.aggregatedData(dateRange),
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_admin_aggregated_data', {
        p_date_from: dateRange?.from?.toISOString() || null,
        p_date_to: dateRange?.to?.toISOString() || null,
      });

      if (error) throw error;
      return data as unknown as AggregatedData;
    },
    enabled: isAdmin,
    staleTime: 60000, // 1 minute
    refetchInterval: 120000, // Refresh every 2 minutes
  });
};
