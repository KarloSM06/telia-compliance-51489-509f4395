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
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes (reduced from 1 min)
    retry: 1,
  });
};