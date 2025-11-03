import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DateRange {
  from: Date;
  to: Date;
}

export const useOpenRouterActivity = (dateRange?: DateRange, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['openrouter-activity', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-activity', {
        body: {
          start_date: dateRange?.from?.toISOString().split('T')[0],
          end_date: dateRange?.to?.toISOString().split('T')[0],
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: enabled && !!dateRange,
    staleTime: 60000, // Cache for 1 minute
    retry: 1,
  });
};