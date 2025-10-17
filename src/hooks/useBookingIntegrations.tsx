import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
  const [integrations, setIntegrations] = useState<BookingIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("booking_system_integrations")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      toast.error("Kunde inte hämta integrationer");
    } finally {
      setLoading(false);
    }
  };

  const createIntegration = async (integration: {
    provider: string;
    provider_display_name: string;
    integration_type: string;
    encrypted_credentials: any;
  }) => {
    if (!user) return;

    try {
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

      setIntegrations([...integrations, data]);
      toast.success("Integration tillagd");
      return data;
    } catch (error: any) {
      console.error("Error creating integration:", error);
      toast.error(error.message || "Kunde inte skapa integration");
      throw error;
    }
  };

  const updateIntegration = async (id: string, updates: Partial<BookingIntegration>) => {
    try {
      const { data, error } = await supabase
        .from("booking_system_integrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setIntegrations(integrations.map(i => i.id === id ? data : i));
      toast.success("Integration uppdaterad");
      return data;
    } catch (error) {
      console.error("Error updating integration:", error);
      toast.error("Kunde inte uppdatera integration");
      throw error;
    }
  };

  const deleteIntegration = async (id: string) => {
    try {
      const { error } = await supabase
        .from("booking_system_integrations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setIntegrations(integrations.filter(i => i.id !== id));
      toast.success("Integration borttagen");
    } catch (error) {
      console.error("Error deleting integration:", error);
      toast.error("Kunde inte ta bort integration");
      throw error;
    }
  };

  const triggerSync = async (integrationId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-booking-systems');
      
      if (error) throw error;
      
      toast.success("Synkning startad");
      await fetchIntegrations();
      return data;
    } catch (error) {
      console.error("Error triggering sync:", error);
      toast.error("Kunde inte starta synkning");
      throw error;
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [user]);

  return {
    integrations,
    loading,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    triggerSync,
    refetch: fetchIntegrations,
  };
};
