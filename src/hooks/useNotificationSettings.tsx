import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface NotificationSettings {
  id: string;
  user_id: string;
  organization_id?: string;
  notification_email?: string;
  notification_phone?: string;
  notify_on_new_booking: boolean;
  notify_on_booking_cancelled: boolean;
  notify_on_booking_updated: boolean;
  notify_on_new_review: boolean;
  notify_on_message_failed: boolean;
  enable_email_notifications: boolean;
  enable_sms_notifications: boolean;
  enable_inapp_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

export type UpdateNotificationSettings = Partial<Omit<NotificationSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notification-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('owner_notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as NotificationSettings | null;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: UpdateNotificationSettings) => {
      if (!user) throw new Error('No user');

      // If settings exist, update them
      if (settings) {
        const { error } = await supabase
          .from('owner_notification_settings')
          .update(newSettings)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // If no settings exist, create them
        const { error } = await supabase
          .from('owner_notification_settings')
          .insert({
            user_id: user.id,
            ...newSettings,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });

  const sendTestNotification = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');

      const { error } = await supabase.functions.invoke('send-owner-notification', {
        body: {
          event_type: 'test',
          booking_id: 'test-' + Date.now(),
          title: 'Testnotifikation',
          customer_name: 'Test Testsson',
          customer_email: 'test@example.com',
          customer_phone: '+46701234567',
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          user_id: user.id,
        },
      });

      if (error) throw error;
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    isUpdating: updateSettings.isPending,
    sendTestNotification: sendTestNotification.mutate,
    isTesting: sendTestNotification.isPending,
  };
};
