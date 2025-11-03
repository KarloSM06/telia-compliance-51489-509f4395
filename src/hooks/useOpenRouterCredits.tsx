import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenRouterCredits = () => {
  return useQuery({
    queryKey: ['openrouter-credits'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-credits');
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
    retry: 1,
  });
};