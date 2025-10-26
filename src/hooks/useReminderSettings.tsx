import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ReminderSettings {
  id: string;
  user_id: string;
  organization_id?: string;
  booking_confirmation_enabled: boolean;
  booking_confirmation_channel: string[];
  reminder_1_enabled: boolean;
  reminder_1_hours_before: number;
  reminder_1_channel: string[];
  reminder_2_enabled: boolean;
  reminder_2_hours_before: number;
  reminder_2_channel: string[];
  review_request_enabled: boolean;
  review_request_hours_after: number;
  review_request_channel: string[];
  default_template_confirmation?: string;
  default_template_reminder?: string;
  default_template_review?: string;
  created_at: string;
  updated_at: string;
}

export const useReminderSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['reminder-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('reminder_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as ReminderSettings | null;
    },
    enabled: !!user,
  });

  const createOrUpdateSettings = useMutation({
    mutationFn: async (updates: Partial<ReminderSettings>) => {
      if (!user) throw new Error('No user');
      
      // Check if settings exist
      const { data: existing } = await supabase
        .from('reminder_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('reminder_settings')
          .update(updates)
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('reminder_settings')
          .insert([{
            user_id: user.id,
            ...updates,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminder-settings'] });
      toast.success('Inställningar sparade');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte spara inställningar: ${error.message}`);
    },
  });

  return {
    settings: settings || {
      booking_confirmation_enabled: true as boolean,
      booking_confirmation_channel: ['email'] as string[],
      reminder_1_enabled: true as boolean,
      reminder_1_hours_before: 48 as number,
      reminder_1_channel: ['sms', 'email'] as string[],
      reminder_2_enabled: true as boolean,
      reminder_2_hours_before: 2 as number,
      reminder_2_channel: ['sms'] as string[],
      review_request_enabled: true as boolean,
      review_request_hours_after: 2 as number,
      review_request_channel: ['email'] as string[],
    },
    isLoading,
    updateSettings: createOrUpdateSettings.mutate,
  };
};
