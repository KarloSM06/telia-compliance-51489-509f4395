import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AISettings {
  ai_provider: 'lovable' | 'openrouter';
  openrouter_api_key_encrypted?: string;
  default_model: string;
  chat_model?: string;
  enrichment_model?: string;
  analysis_model?: string;
  classification_model?: string;
  use_system_fallback: boolean;
}

export const useAISettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['ai-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_ai_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return data as AISettings | null;
    },
  });

  const saveSettings = useMutation({
    mutationFn: async ({
      provider,
      apiKey,
      defaultModel,
      chatModel,
      enrichmentModel,
      analysisModel,
      useFallback,
    }: {
      provider: 'lovable' | 'openrouter';
      apiKey?: string;
      defaultModel: string;
      chatModel?: string;
      enrichmentModel?: string;
      analysisModel?: string;
      useFallback: boolean;
    }) => {
      // Encrypt API key if provided
      let encryptedKey = null;
      if (provider === 'openrouter' && apiKey) {
        const { data: encryptData, error: encryptError } = await supabase.functions.invoke(
          'encrypt-api-key',
          { body: { apiKey } }
        );
        
        if (encryptError) {
          throw new Error(encryptError.message || 'Failed to encrypt API key');
        }
        
        if (!encryptData?.encrypted) {
          throw new Error('No encrypted key returned');
        }
        
        encryptedKey = encryptData.encrypted;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_ai_settings')
        .upsert({
          user_id: user.id,
          ai_provider: provider,
          openrouter_api_key_encrypted: encryptedKey,
          default_model: defaultModel,
          chat_model: chatModel || null,
          enrichment_model: enrichmentModel || null,
          analysis_model: analysisModel || null,
          use_system_fallback: useFallback,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      toast.success('AI-inställningar sparade');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte spara: ${error.message}`);
    },
  });

  return {
    settings: settings || {
      ai_provider: 'lovable' as const,
      default_model: 'google/gemini-2.5-flash',
      use_system_fallback: true,
    },
    isLoading,
    saveSettings: saveSettings.mutate,
    isSaving: saveSettings.isPending,
  };
};
