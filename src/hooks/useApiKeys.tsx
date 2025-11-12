import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useApiKeys = () => {
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['user-api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const generateKey = useMutation({
    mutationFn: async (keyName: string) => {
      const { data, error } = await supabase.functions.invoke('generate-api-key', {
        body: { key_name: keyName },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-api-keys'] });
      toast.success('API-nyckel skapad!');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const deleteKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase
        .from('user_api_keys')
        .update({ is_active: false })
        .eq('id', keyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-api-keys'] });
      toast.success('API-nyckel inaktiverad');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  return {
    apiKeys,
    isLoading,
    generateKey: generateKey.mutate,
    isGenerating: generateKey.isPending,
    deleteKey: deleteKey.mutate,
  };
};
