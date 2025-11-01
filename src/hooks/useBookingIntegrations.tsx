import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface BookingIntegration {
  id: string;
  provider: string;
  provider_display_name: string;
  integration_type: string;
  is_enabled: boolean;
  is_configured: boolean;
  encrypted_credentials?: any;
  sync_settings?: any;
  last_sync_at?: string;
  last_sync_status?: string;
  total_synced_events: number;
  failed_syncs: number;
}

export const AVAILABLE_PROVIDERS = [
  { id: 'simplybook', name: 'SimplyBook.me', type: 'full_api' },
  { id: 'bokamera', name: 'BokaMera', type: 'full_api' },
  { id: 'hapio', name: 'Hapio', type: 'full_api' },
  { id: 'bookeo', name: 'Bookeo', type: 'full_api' },
  { id: 'supersaas', name: 'SuperSaaS', type: 'full_api' },
  { id: 'tixly', name: 'Tixly', type: 'full_api' },
  { id: 'hogia_bookit', name: 'Hogia BOOKIT', type: 'full_api' },
  { id: 'ireserve', name: 'i-Reserve', type: 'full_api' },
  { id: 'bokadirekt', name: 'Bokadirekt', type: 'full_api' },
  { id: 'boka_se', name: 'Boka.se', type: 'calendar_sync' },
  { id: 'google_calendar', name: 'Google Calendar', type: 'calendar_sync' },
  { id: 'outlook', name: 'Microsoft Outlook', type: 'calendar_sync' },
];

export const useBookingIntegrations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['booking-integrations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('booking_system_integrations')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      return data as BookingIntegration[];
    },
    enabled: !!user,
  });

  const createIntegrationMutation = useMutation({
    mutationFn: async (integration: {
      provider: string;
      provider_display_name: string;
      integration_type: string;
      encrypted_credentials: any;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from("booking_system_integrations")
        .insert({
          ...integration,
          user_id: user.id,
          is_configured: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-integrations', user?.id] });
      toast.success("Integration tillagd");
    },
    onError: (error: any) => {
      console.error("Error creating integration:", error);
      toast.error(error.message || "Kunde inte skapa integration");
    },
  });

  const updateIntegrationMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BookingIntegration> }) => {
      const { data, error } = await supabase
        .from("booking_system_integrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-integrations', user?.id] });
      toast.success("Integration uppdaterad");
    },
    onError: (error: any) => {
      console.error("Error updating integration:", error);
      toast.error("Kunde inte uppdatera integration");
    },
  });

  const deleteIntegrationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("booking_system_integrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-integrations', user?.id] });
      toast.success("Integration borttagen");
    },
    onError: (error: any) => {
      console.error("Error deleting integration:", error);
      toast.error("Kunde inte ta bort integration");
    },
  });

  const triggerSyncMutation = useMutation({
    mutationFn: async (integrationId: string) => {
      const { data, error } = await supabase.functions.invoke('sync-booking-systems');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-integrations', user?.id] });
      toast.success("Synkning startad");
    },
    onError: (error: any) => {
      console.error("Error triggering sync:", error);
      toast.error("Kunde inte starta synkning");
    },
  });

  // Real-time subscription for booking integrations
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('booking-integrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_system_integrations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('📅 Booking integration update:', payload);
          queryClient.invalidateQueries({ queryKey: ['booking-integrations', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    integrations,
    loading: isLoading,
    createIntegration: createIntegrationMutation.mutateAsync,
    updateIntegration: (id: string, updates: Partial<BookingIntegration>) => 
      updateIntegrationMutation.mutate({ id, updates }),
    deleteIntegration: deleteIntegrationMutation.mutate,
    triggerSync: triggerSyncMutation.mutate,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['booking-integrations', user?.id] }),
  };
};
