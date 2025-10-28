import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export type ProviderType = 'telephony' | 'messaging' | 'calendar' | 'multi';
export type Capability = 'voice' | 'sms' | 'mms' | 'video' | 'fax' | 'ai_agent' | 'calendar_sync' | 'booking' | 'number_management' | 'event_management' | 'payment' | 'customer_management' | 'realtime_streaming' | 'websocket';

export interface Integration {
  id: string;
  user_id: string;
  organization_id?: string;
  provider: string;
  provider_display_name: string;
  provider_type: ProviderType;
  capabilities: Capability[];
  encrypted_credentials: any;
  config: any;
  is_active: boolean;
  is_verified: boolean;
  verification_data?: any;
  webhook_enabled: boolean;
  webhook_url?: string;
  webhook_secret?: string;
  polling_enabled: boolean;
  polling_interval_minutes: number;
  last_used_at?: string;
  last_synced_at?: string;
  sync_status?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

// Provider capabilities mapping
export const PROVIDER_CAPABILITIES: Record<string, Capability[]> = {
  twilio: ['voice', 'sms', 'mms', 'video', 'fax'],
  telnyx: ['voice', 'sms', 'mms', 'fax', 'number_management'],
  vapi: ['voice', 'ai_agent', 'realtime_streaming'],
  retell: ['voice', 'ai_agent', 'websocket'],
  simplybook: ['calendar_sync', 'booking', 'customer_management'],
  google_calendar: ['calendar_sync', 'event_management'],
  bookeo: ['calendar_sync', 'booking', 'payment'],
};

// Provider types
export const PROVIDER_TYPES: Record<string, ProviderType> = {
  twilio: 'multi',
  telnyx: 'multi',
  vapi: 'telephony',
  retell: 'telephony',
  simplybook: 'calendar',
  google_calendar: 'calendar',
  bookeo: 'calendar',
};

// Credentials schema per provider
export const PROVIDER_CREDENTIALS_SCHEMA: Record<string, string[]> = {
  twilio: ['accountSid', 'authToken'],
  telnyx: ['apiKey'],
  vapi: ['apiKey'],
  retell: ['apiKey', 'webhookKey'],
  simplybook: ['companyLogin', 'apiKey'],
  google_calendar: ['clientId', 'clientSecret', 'refreshToken'],
  bookeo: ['apiKey', 'secretKey'],
};

export const useIntegrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['integrations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Integration[];
    },
    enabled: !!user,
  });

  // Filter by capability
  const getByCapability = (capability: Capability) => {
    return integrations?.filter(i => i.capabilities.includes(capability)) || [];
  };

  // Filter by provider type
  const getByType = (type: ProviderType) => {
    return integrations?.filter(i => i.provider_type === type) || [];
  };

  // Get active integrations
  const getActive = () => {
    return integrations?.filter(i => i.is_active) || [];
  };

  // Get specific capability providers
  const telephonyProviders = getByCapability('voice');
  const smsProviders = getByCapability('sms');
  const calendarProviders = getByCapability('calendar_sync');

  const addIntegration = useMutation({
    mutationFn: async ({
      provider,
      providerDisplayName,
      capabilities,
      credentials,
      config = {},
    }: {
      provider: string;
      providerDisplayName: string;
      capabilities: Capability[];
      credentials: any;
      config?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Encrypt credentials via edge function
      const { data: encryptResult, error: encryptError } = await supabase.functions.invoke(
        'encrypt-telephony-credentials',
        { body: { credentials } }
      );

      if (encryptError || !encryptResult) {
        throw new Error('Failed to encrypt credentials');
      }

      const providerType = PROVIDER_TYPES[provider] || 'multi';

      const { data, error } = await supabase
        .from('integrations')
        .insert([{
          user_id: user.id,
          provider,
          provider_display_name: providerDisplayName,
          provider_type: providerType,
          capabilities,
          encrypted_credentials: encryptResult.encrypted,
          config,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Integration tillagd!');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const updateIntegration = useMutation({
    mutationFn: async ({ 
      integrationId, 
      updates 
    }: { 
      integrationId: string; 
      updates: Partial<Integration> 
    }) => {
      const { error } = await supabase
        .from('integrations')
        .update(updates)
        .eq('id', integrationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Integration uppdaterad');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const deleteIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Integration borttagen');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ integrationId, isActive }: { integrationId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('integrations')
        .update({ is_active: isActive })
        .eq('id', integrationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast.success('Status uppdaterad');
    },
    onError: (error: Error) => {
      toast.error(`Fel: ${error.message}`);
    },
  });

  return {
    integrations: integrations || [],
    isLoading,
    getByCapability,
    getByType,
    getActive,
    telephonyProviders,
    smsProviders,
    calendarProviders,
    addIntegration: addIntegration.mutate,
    isAddingIntegration: addIntegration.isPending,
    updateIntegration: updateIntegration.mutate,
    isUpdatingIntegration: updateIntegration.isPending,
    deleteIntegration: deleteIntegration.mutate,
    isDeletingIntegration: deleteIntegration.isPending,
    toggleActive: toggleActive.mutate,
    isTogglingActive: toggleActive.isPending,
  };
};
