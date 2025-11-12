import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenRouterKeyInfo = () => {
  return useQuery({
    queryKey: ['openrouter-key-info'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-key-info');
      if (error) throw error;
      return data;
    },
    staleTime: 300000, // Cache for 5 minutes
    retry: 1,
  });
};