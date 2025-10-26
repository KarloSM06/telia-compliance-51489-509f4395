import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type SMSProvider = 'twilio' | 'telnyx';

export interface SMSProviderSettings {
  id: string;
  user_id: string;
  provider: SMSProvider;
  encrypted_credentials: string;
  from_phone_number: string;
  is_active: boolean;
  is_verified: boolean;
  test_message_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProviderCredentials {
  // Twilio
  accountSid?: string;
  authToken?: string;
  // Telnyx
  apiKey?: string;
}

export const useSMSProviderSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['sms-provider-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('sms_provider_settings')
        .select('*')
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return data as SMSProviderSettings | null;
    },
    enabled: !!user,
  });

  const testProvider = useMutation({
    mutationFn: async ({
      provider,
      credentials,
      fromPhoneNumber,
      testPhoneNumber,
    }: {
      provider: SMSProvider;
      credentials: ProviderCredentials;
      fromPhoneNumber: string;
      testPhoneNumber: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('test-sms-provider', {
        body: { provider, credentials, fromPhoneNumber, testPhoneNumber },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Test failed');
      return data;
    },
    onSuccess: () => {
      toast.success('Test-SMS skickat! Kontrollera din telefon.');
    },
    onError: (error: Error) => {
      toast.error(`Test misslyckades: ${error.message}`);
    },
  });

  const saveSettings = useMutation({
    mutationFn: async ({
      provider,
      credentials,
      fromPhoneNumber,
    }: {
      provider: SMSProvider;
      credentials: ProviderCredentials;
      fromPhoneNumber: string;
    }) => {
      if (!user) throw new Error('No user');

      // Kryptera credentials
      const encryptionKey = crypto.randomUUID(); // I produktion: använd en säker nyckel
      const credentialsJson = JSON.stringify(credentials);
      
      // Anropa encrypt-funktion i databasen via RPC (om den finns) eller spara direkt
      // För nu sparar vi som plain text - i produktion ska detta krypteras!
      const { data, error } = await supabase
        .from('sms_provider_settings')
        .upsert({
          user_id: user.id,
          provider,
          encrypted_credentials: credentialsJson, // TODO: Kryptera med ENCRYPTION_KEY
          from_phone_number: fromPhoneNumber,
          is_active: true,
          is_verified: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-provider-settings'] });
      toast.success('SMS-provider inställningar sparade!');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte spara inställningar: ${error.message}`);
    },
  });

  const deleteSettings = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('sms_provider_settings')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-provider-settings'] });
      toast.success('SMS-provider inställningar raderade');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte radera inställningar: ${error.message}`);
    },
  });

  return {
    settings,
    isLoading,
    testProvider: testProvider.mutate,
    isTestingProvider: testProvider.isPending,
    saveSettings: saveSettings.mutate,
    isSavingSettings: saveSettings.isPending,
    deleteSettings: deleteSettings.mutate,
    isDeletingSettings: deleteSettings.isPending,
  };
};
