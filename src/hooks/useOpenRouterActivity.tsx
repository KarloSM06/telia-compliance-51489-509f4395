import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DateRange {
  from: Date;
  to: Date;
}

export const useOpenRouterActivity = (dateRange?: DateRange, enabled: boolean = true) => {
  const startStr = dateRange?.from?.toISOString().split('T')[0];
  const endStr = dateRange?.to?.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['openrouter-activity', startStr, endStr],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-activity', {
        body: {
          start_date: startStr,
          end_date: endStr,
        }
      });
      if (error) throw error;
      return data;
    },
    enabled: enabled && !!startStr && !!endStr,
    staleTime: 60000, // Cache for 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
};