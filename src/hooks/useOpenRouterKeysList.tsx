import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OpenRouterKey {
  hash: string;
  name: string;
  limit: number | null;
  usage: number;
  disabled: boolean;
  limit_remaining: number | null;
  created_at?: string;
}

export const useOpenRouterKeysList = () => {
  return useQuery({
    queryKey: ['openrouter-keys-list'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-openrouter-keys');
      
      if (error) {
        console.error('Error fetching OpenRouter keys:', error);
        throw error;
      }
      
      return data?.data as OpenRouterKey[];
    },
    staleTime: 300000, // Cache 5 minutes
    retry: 1,
  });
};
