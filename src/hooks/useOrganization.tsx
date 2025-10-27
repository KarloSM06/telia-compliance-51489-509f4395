import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface Organization {
  id: string;
  name: string;
  owner_id: string;
  plan_type: string;
  max_members: number;
  created_at: string;
  updated_at: string;
}

interface UpdateOrganizationData {
  name?: string;
  plan_type?: string;
  max_members?: number;
}

export const useOrganization = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's organization
  const { data: organization, isLoading } = useQuery({
    queryKey: ['organization', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Organization | null;
    },
    enabled: !!user,
  });

  // Create organization
  const createOrganization = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('organizations')
        .insert({
          name,
          owner_id: user.id,
          plan_type: 'pro',
          max_members: 5,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Organization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast({
        title: 'Företag skapat',
        description: 'Ditt företag har skapats framgångsrikt.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fel',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update organization
  const updateOrganization = useMutation({
    mutationFn: async (updates: UpdateOrganizationData) => {
      if (!organization) throw new Error('No organization found');

      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organization.id)
        .select()
        .single();

      if (error) throw error;
      return data as Organization;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      toast({
        title: 'Uppdaterat',
        description: 'Företagsinformation har uppdaterats.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Fel',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    organization,
    isLoading,
    createOrganization: createOrganization.mutate,
    updateOrganization: updateOrganization.mutate,
    isCreating: createOrganization.isPending,
    isUpdating: updateOrganization.isPending,
  };
};
