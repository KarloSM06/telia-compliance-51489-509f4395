import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenRouterModels = () => {
  return useQuery({
    queryKey: ['openrouter-models'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-models');
      if (error) throw error;
      return data;
    },
    staleTime: 3600000, // Cache for 1 hour
    retry: 1,
  });
};