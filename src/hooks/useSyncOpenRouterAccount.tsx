import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSyncOpenRouterAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-openrouter-account');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openrouter-account-snapshots'] });
      queryClient.invalidateQueries({ queryKey: ['openrouter-credits'] });
      queryClient.invalidateQueries({ queryKey: ['openrouter-key-info'] });
      queryClient.invalidateQueries({ queryKey: ['openrouter-keys-list'] });
      toast.success('OpenRouter account synced successfully');
    },
    onError: (error: Error) => {
      console.error('Sync failed:', error);
      toast.error(`Failed to sync: ${error.message}`);
    },
  });
};
