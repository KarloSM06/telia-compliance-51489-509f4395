import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenRouterKeysList = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['openrouter-keys-list'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-keys');
      if (error) throw error;
      return data;
    },
    enabled,
    staleTime: 300000, // 5 minutes
    retry: 1,
  });
};
