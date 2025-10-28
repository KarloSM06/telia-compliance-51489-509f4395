import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TelephonyAccount {
  id: string;
  user_id: string;
  provider: 'retell' | 'vapi' | 'twilio' | 'telnyx';
  provider_display_name: string;
  encrypted_credentials: any;
  is_active: boolean;
  is_verified: boolean;
  config: any;
  last_synced_at: string | null;
  sync_status: string;
  created_at: string;
  updated_at: string;
}

export const useTelephonyAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['telephony-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telephony_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TelephonyAccount[];
    },
  });

  const addAccount = useMutation({
    mutationFn: async ({ provider, credentials, displayName }: {
      provider: string;
      credentials: any;
      displayName: string;
    }) => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Encrypt credentials via edge function
      const { data: encryptResult, error: encryptError } = await supabase.functions.invoke(
        'encrypt-telephony-credentials',
        { body: { credentials } }
      );

      if (encryptError || !encryptResult) {
        throw new Error('Failed to encrypt credentials');
      }

      const { data, error } = await supabase
        .from('telephony_accounts')
        .insert([{
          user_id: user.id,
          provider: provider,
          provider_display_name: displayName,
          encrypted_credentials: encryptResult.encrypted,
          is_active: true,
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-accounts'] });
      toast.success('Provider tillagd!');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const toggleAccount = useMutation({
    mutationFn: async ({ accountId, isActive }: { accountId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('telephony_accounts')
        .update({ is_active: isActive })
        .eq('id', accountId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-accounts'] });
      toast.success('Status uppdaterad');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (accountId: string) => {
      const { error } = await supabase
        .from('telephony_accounts')
        .delete()
        .eq('id', accountId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-accounts'] });
      toast.success('Provider borttagen');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const updateCredentials = useMutation({
    mutationFn: async ({ accountId, credentials }: { accountId: string; credentials: any }) => {
      const { data: encryptResult, error: encryptError } = await supabase.functions.invoke(
        'encrypt-telephony-credentials',
        { body: { credentials } }
      );

      if (encryptError || !encryptResult) {
        throw new Error('Failed to encrypt credentials');
      }

      const { error } = await supabase
        .from('telephony_accounts')
        .update({ encrypted_credentials: encryptResult.encrypted })
        .eq('id', accountId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-accounts'] });
      toast.success('Credentials uppdaterade');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  return {
    accounts: accounts || [],
    isLoading,
    addAccount: addAccount.mutate,
    isAddingAccount: addAccount.isPending,
    toggleAccount: toggleAccount.mutate,
    deleteAccount: deleteAccount.mutate,
    updateCredentials: updateCredentials.mutate,
    isUpdatingCredentials: updateCredentials.isPending,
  };
};
