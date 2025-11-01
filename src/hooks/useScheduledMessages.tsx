import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useEffect } from 'react';
import { toast } from 'sonner';

export type MessageType = 'booking_confirmation' | 'reminder' | 'review_request' | 'cancellation';

export interface ScheduledMessage {
  id: string;
  calendar_event_id: string;
  user_id: string;
  template_id?: string;
  message_type: MessageType;
  channel: 'sms' | 'email' | 'both';
  recipient_name: string;
  recipient_email?: string;
  recipient_phone?: string;
  scheduled_for: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  generated_subject?: string;
  generated_message: string;
  delivery_status?: any;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}

export const useScheduledMessages = (calendarEventId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['scheduled-messages', user?.id, calendarEventId],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('scheduled_messages')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (calendarEventId) {
        query = query.eq('calendar_event_id', calendarEventId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ScheduledMessage[];
    },
    enabled: !!user,
  });

  // Real-time subscription for scheduled messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('scheduled-messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_messages',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('⏰ Scheduled message update:', payload);
          queryClient.invalidateQueries({ queryKey: ['scheduled-messages', user.id] });
          
          if (payload.eventType === 'UPDATE' && (payload.new as any)?.status === 'sent') {
            toast.success(`✉️ Meddelande skickat till ${(payload.new as any)?.recipient_name}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    messages,
    isLoading,
    pendingMessages: messages.filter(m => m.status === 'pending'),
    sentMessages: messages.filter(m => m.status === 'sent'),
    failedMessages: messages.filter(m => m.status === 'failed'),
  };
};
