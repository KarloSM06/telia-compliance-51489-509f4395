import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AISettings {
  ai_provider: 'lovable' | 'openrouter';
  openrouter_api_key_encrypted?: string;
  openrouter_provisioning_key_encrypted?: string;
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
      provisioningKey,
      defaultModel,
      chatModel,
      enrichmentModel,
      analysisModel,
      useFallback,
    }: {
      provider: 'lovable' | 'openrouter';
      apiKey?: string;
      provisioningKey?: string;
      defaultModel: string;
      chatModel?: string;
      enrichmentModel?: string;
      analysisModel?: string;
      useFallback: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch existing settings to preserve keys if not updating
      const { data: existingSettings } = await supabase
        .from('user_ai_settings')
        .select('openrouter_api_key_encrypted, openrouter_provisioning_key_encrypted')
        .eq('user_id', user.id)
        .single();

      // Encrypt API key if provided, otherwise keep existing
      let encryptedKey = existingSettings?.openrouter_api_key_encrypted || null;
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

      // Encrypt provisioning key if provided, otherwise keep existing
      let encryptedProvisioningKey = existingSettings?.openrouter_provisioning_key_encrypted || null;
      if (provider === 'openrouter' && provisioningKey) {
        const { data: encryptData, error: encryptError } = await supabase.functions.invoke(
          'encrypt-provisioning-key',
          { body: { provisioningKey } }
        );
        
        if (encryptError) {
          throw new Error(encryptError.message || 'Failed to encrypt provisioning key');
        }
        
        if (!encryptData?.encrypted) {
          throw new Error('No encrypted provisioning key returned');
        }
        
        encryptedProvisioningKey = encryptData.encrypted;
      }

      const { error } = await supabase
        .from('user_ai_settings')
        .upsert({
          user_id: user.id,
          ai_provider: provider,
          openrouter_api_key_encrypted: encryptedKey,
          openrouter_provisioning_key_encrypted: encryptedProvisioningKey,
          default_model: defaultModel,
          chat_model: chatModel || null,
          enrichment_model: enrichmentModel || null,
          analysis_model: analysisModel || null,
          use_system_fallback: useFallback,
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-settings'] });
      queryClient.invalidateQueries({ queryKey: ['openrouter-keys-status'] });
      toast.success('AI-inställningar sparade');
    },
    onError: (error: Error) => {
      console.error('💥 Save AI settings error:', error);
      
      if (error.message.includes('duplicate key') || error.message.includes('violates unique constraint')) {
        toast.error('Ett tekniskt fel uppstod. Försök igen eller kontakta support.');
      } else if (error.message.includes('encrypt')) {
        toast.error('Kunde inte kryptera nyckeln. Kontrollera att formatet är korrekt (sk-or-... eller pk-or-...).');
      } else if (error.message.includes('JWT')) {
        toast.error('Session har löpt ut. Logga in igen.');
      } else if (error.message.includes('foreign key')) {
        toast.error('Användarprofil hittades inte. Logga ut och in igen.');
      } else {
        toast.error(`Kunde inte spara: ${error.message}`);
      }
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
