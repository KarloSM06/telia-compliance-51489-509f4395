import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSyncOpenRouterActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ start_date, end_date }: { start_date: string; end_date: string }) => {
      const { data, error } = await supabase.functions.invoke('sync-openrouter-activity', {
        body: { start_date, end_date }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ai-usage'] });
      queryClient.invalidateQueries({ queryKey: ['analytics-data'] });
      queryClient.invalidateQueries({ queryKey: ['openrouter-activity'] });
      
      const message = data?.message || `${data?.synced_records || 0} nya anrop synkade`;
      toast.success(message);
    },
    onError: (error: any) => {
      console.error('Failed to sync OpenRouter activity:', error);
      toast.error('Kunde inte synka OpenRouter-aktivitet');
    }
  });
};
