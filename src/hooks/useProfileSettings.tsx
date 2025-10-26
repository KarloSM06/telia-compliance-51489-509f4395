import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useProfileSettings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['profile-settings', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('availability_enabled, lunch_break_enabled, lunch_break_start, lunch_break_end')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<{
      availability_enabled: boolean;
      lunch_break_enabled: boolean;
      lunch_break_start: string;
      lunch_break_end: string;
    }>) => {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-settings'] });
      toast.success('Inställningar sparade');
    },
    onError: (error) => {
      toast.error(`Kunde inte spara: ${error.message}`);
    },
  });

  return {
    settings: settings || { 
      availability_enabled: true, 
      lunch_break_enabled: false, 
      lunch_break_start: '12:00', 
      lunch_break_end: '13:00' 
    },
    isLoading,
    updateSettings: updateSettings.mutate,
  };
};
