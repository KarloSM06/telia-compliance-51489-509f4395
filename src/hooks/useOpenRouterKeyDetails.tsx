import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOpenRouterKeyDetails = (keyHash: string | null) => {
  return useQuery({
    queryKey: ['openrouter-key-details', keyHash],
    queryFn: async () => {
      if (!keyHash) return null;
      
      const { data, error } = await supabase.functions.invoke('get-openrouter-key-details', {
        body: { key_hash: keyHash },
      });
      
      if (error) {
        console.error('Error fetching key details:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!keyHash,
    staleTime: 300000, // Cache 5 minutes
    retry: 1,
  });
};
