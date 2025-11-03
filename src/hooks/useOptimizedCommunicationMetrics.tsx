import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DateRange {
  from?: Date;
  to?: Date;
}

export const useOptimizedCommunicationMetrics = (dateRange?: DateRange) => {
  return useQuery({
    queryKey: ['communication-metrics', dateRange?.from, dateRange?.to],
    queryFn: async () => {
      const body: any = {};
      
      if (dateRange?.from) {
        body.dateFrom = dateRange.from.toISOString();
      }
      if (dateRange?.to) {
        body.dateTo = dateRange.to.toISOString();
      }

      const { data, error } = await supabase.functions.invoke('get-communication-metrics', {
        body,
      });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in memory for 10 minutes
  });
};
