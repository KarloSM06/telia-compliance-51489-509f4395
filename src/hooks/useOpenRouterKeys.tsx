import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OpenRouterKeysStatus {
  api_key_masked: string | null;
  api_key_exists: boolean;
  provisioning_key_masked: string | null;
  provisioning_key_exists: boolean;
}

export const useOpenRouterKeys = () => {
  return useQuery({
    queryKey: ['openrouter-keys-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-masked-keys');
      
      if (error) {
        console.error('Error fetching masked keys:', error);
        throw error;
      }
      
      return data as OpenRouterKeysStatus;
    },
    staleTime: 300000, // Cache 5 minutes
    retry: 1,
  });
};
