import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface NotificationRecipient {
  id: string;
  user_id: string;
  organization_id?: string;
  name: string;
  email?: string;
  phone?: string;
  notify_on_new_booking: boolean;
  notify_on_booking_cancelled: boolean;
  notify_on_booking_updated: boolean;
  notify_on_new_review: boolean;
  notify_on_message_failed: boolean;
  enable_email_notifications: boolean;
  enable_sms_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useNotificationRecipients = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: recipients, isLoading } = useQuery({
    queryKey: ['notification-recipients', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notification_recipients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as NotificationRecipient[];
    },
    enabled: !!user,
  });

  const createRecipient = useMutation({
    mutationFn: async (newRecipient: Omit<NotificationRecipient, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('notification_recipients')
        .insert([{
          user_id: user.id,
          ...newRecipient,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-recipients'] });
      toast.success('Mottagare tillagd');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte lägga till mottagare: ${error.message}`);
    },
  });

  const updateRecipient = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NotificationRecipient> }) => {
      const { data, error } = await supabase
        .from('notification_recipients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-recipients'] });
      toast.success('Mottagare uppdaterad');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte uppdatera mottagare: ${error.message}`);
    },
  });

  const deleteRecipient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notification_recipients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-recipients'] });
      toast.success('Mottagare borttagen');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte ta bort mottagare: ${error.message}`);
    },
  });

  return {
    recipients: recipients || [],
    isLoading,
    createRecipient: createRecipient.mutate,
    updateRecipient: updateRecipient.mutate,
    deleteRecipient: deleteRecipient.mutate,
    isCreating: createRecipient.isPending,
    isUpdating: updateRecipient.isPending,
    isDeleting: deleteRecipient.isPending,
  };
};