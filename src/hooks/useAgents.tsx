import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Agent {
  id: string;
  integration_id: string;
  user_id: string;
  provider: 'vapi' | 'retell' | 'telnyx' | 'twilio';
  provider_agent_id: string;
  name: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'archived';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useAgents = () => {
  const queryClient = useQueryClient();

  const { data: agents, isLoading } = useQuery({
    queryKey: ['telephony-agents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Agent[];
    },
  });

  const syncAgents = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('sync-telephony-agents');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-agents'] });
      toast.success('✅ Agents synkade!');
    },
    onError: (error: Error) => {
      toast.error(`❌ Sync misslyckades: ${error.message}`);
    },
  });

  const updateAgent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Agent> }) => {
      const { data, error } = await supabase
        .from('agents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-agents'] });
      toast.success('✅ Agent uppdaterad!');
    },
    onError: (error: Error) => {
      toast.error(`❌ Uppdatering misslyckades: ${error.message}`);
    },
  });

  const deleteAgent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telephony-agents'] });
      toast.success('🗑️ Agent borttagen!');
    },
    onError: (error: Error) => {
      toast.error(`❌ Borttagning misslyckades: ${error.message}`);
    },
  });

  return {
    agents: agents || [],
    isLoading,
    syncAgents,
    updateAgent,
    deleteAgent,
  };
};
