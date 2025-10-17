import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  event_type: string;
  status: string;
  source: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  lead_id?: string;
  external_id?: string;
  booking_system_integration_id?: string;
}

export const useCalendarEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .eq("user_id", user.id)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Kunde inte hämta kalenderhändelser");
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Partial<CalendarEvent>) => {
    if (!user) return;

    try {
      const eventData: any = {
        user_id: user.id,
        title: event.title || 'Ny händelse',
        start_time: event.start_time,
        end_time: event.end_time,
        event_type: event.event_type || 'meeting',
        status: event.status || 'scheduled',
        source: event.source || 'internal',
        description: event.description,
        contact_person: event.contact_person,
        contact_email: event.contact_email,
        contact_phone: event.contact_phone,
        address: event.address,
        lead_id: event.lead_id,
      };

      const { data, error } = await supabase
        .from("calendar_events")
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      
      setEvents([...events, data]);
      toast.success("Händelse skapad");
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Kunde inte skapa händelse");
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const { data, error } = await supabase
        .from("calendar_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setEvents(events.map(e => e.id === id ? data : e));
      toast.success("Händelse uppdaterad");
      return data;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Kunde inte uppdatera händelse");
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEvents(events.filter(e => e.id !== id));
      toast.success("Händelse borttagen");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Kunde inte ta bort händelse");
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('calendar-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
};
