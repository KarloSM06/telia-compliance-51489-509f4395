import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type NotificationType = 
  | 'new_booking' 
  | 'booking_updated' 
  | 'booking_cancelled' 
  | 'message_sent' 
  | 'message_failed' 
  | 'review_received';

export interface OwnerNotification {
  id: string;
  user_id: string;
  calendar_event_id?: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  channel: string[];
  status: 'pending' | 'sent' | 'read';
  metadata?: any;
  sent_at?: string;
  read_at?: string;
  created_at: string;
}

export const useOwnerNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['owner-notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('owner_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as OwnerNotification[];
    },
    enabled: !!user,
  });

  const unreadCount = notifications.filter(n => n.status !== 'read').length;

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('owner_notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-notifications'] });
    },
  });

  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('owner_notifications')
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .neq('status', 'read');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-notifications'] });
      toast.success('Alla notiser markerade som lästa');
    },
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('owner_notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-notifications'] });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
  };
};
