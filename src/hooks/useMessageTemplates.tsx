import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type TemplateType = 'booking_confirmation' | 'reminder' | 'review_request' | 'cancellation';
export type Tone = 'formal' | 'friendly' | 'fun' | 'sales';
export type Channel = 'sms' | 'email';

export interface MessageTemplate {
  id: string;
  user_id: string;
  organization_id?: string;
  template_type: TemplateType;
  name: string;
  subject?: string;
  body_template: string;
  tone: Tone;
  language: string;
  channel: Channel[];
  is_active: boolean;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export type CreateMessageTemplate = Omit<MessageTemplate, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const useMessageTemplates = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['message-templates', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MessageTemplate[];
    },
    enabled: !!user,
  });

  const createTemplate = useMutation({
    mutationFn: async (template: CreateMessageTemplate) => {
      if (!user) throw new Error('No user');
      const { data, error } = await supabase
        .from('message_templates')
        .insert([{
          user_id: user.id,
          ...template,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast.success('Mall skapad');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte skapa mall: ${error.message}`);
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MessageTemplate> }) => {
      const { data, error } = await supabase
        .from('message_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast.success('Mall uppdaterad');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte uppdatera mall: ${error.message}`);
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
      toast.success('Mall raderad');
    },
    onError: (error: Error) => {
      toast.error(`Kunde inte radera mall: ${error.message}`);
    },
  });

  return {
    templates,
    isLoading,
    createTemplate: createTemplate.mutate,
    updateTemplate: updateTemplate.mutate,
    deleteTemplate: deleteTemplate.mutate,
  };
};
