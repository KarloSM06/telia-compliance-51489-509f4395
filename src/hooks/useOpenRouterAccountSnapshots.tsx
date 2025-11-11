import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DateRange {
  from: Date;
  to: Date;
}

export const useOpenRouterAccountSnapshots = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['openrouter-account-snapshots', dateRange],
    queryFn: async () => {
      let query = supabase
        .from('openrouter_account_snapshots')
        .select('*')
        .order('snapshot_date', { ascending: false });
      
      if (dateRange) {
        query = query
          .gte('snapshot_date', dateRange.from.toISOString().split('T')[0])
          .lte('snapshot_date', dateRange.to.toISOString().split('T')[0]);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 60000, // 1 minute
  });
};
