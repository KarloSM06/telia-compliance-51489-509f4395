import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { toStockholmTime, fromStockholmTime, getTimezoneInfo, STOCKHOLM_TZ } from "@/lib/timezoneUtils";

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
      
      // Convert UTC times from database to Stockholm time for display
      const eventsInStockholmTime = (data || []).map(event => ({
        ...event,
        start_time: toStockholmTime(event.start_time).toISOString(),
        end_time: toStockholmTime(event.end_time).toISOString(),
      }));
      
      // Log timezone info for debugging (first event only)
      if (eventsInStockholmTime.length > 0) {
        const sampleEvent = eventsInStockholmTime[0];
        console.log('📅 Calendar Events Timezone Info:', {
          totalEvents: eventsInStockholmTime.length,
          timezone: STOCKHOLM_TZ,
          sampleEvent: {
            id: sampleEvent.id,
            title: sampleEvent.title,
            start_utc: data![0].start_time,
            start_stockholm: sampleEvent.start_time,
            timezoneInfo: getTimezoneInfo(sampleEvent.start_time),
          }
        });
      }
      
      setEvents(eventsInStockholmTime);
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
      // Convert Stockholm time to UTC for storage
      const startTimeUTC = event.start_time 
        ? fromStockholmTime(new Date(event.start_time)).toISOString()
        : new Date().toISOString();
      const endTimeUTC = event.end_time
        ? fromStockholmTime(new Date(event.end_time)).toISOString()
        : new Date().toISOString();

      const eventData: any = {
        user_id: user.id,
        title: event.title || 'Ny händelse',
        start_time: startTimeUTC,
        end_time: endTimeUTC,
        event_type: event.event_type || 'meeting',
        status: event.status || 'scheduled',
        source: event.source || 'internal',
        timezone: 'Europe/Stockholm',
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
      
      // Convert back to Stockholm time for local state
      const eventInStockholmTime = {
        ...data,
        start_time: toStockholmTime(data.start_time).toISOString(),
        end_time: toStockholmTime(data.end_time).toISOString(),
      };
      
      setEvents([...events, eventInStockholmTime]);
      toast.success("Händelse skapad");
      return eventInStockholmTime;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Kunde inte skapa händelse");
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      // Convert Stockholm time to UTC for any time fields being updated
      const updatesWithUTC = { ...updates };
      if (updates.start_time) {
        updatesWithUTC.start_time = fromStockholmTime(new Date(updates.start_time)).toISOString();
      }
      if (updates.end_time) {
        updatesWithUTC.end_time = fromStockholmTime(new Date(updates.end_time)).toISOString();
      }

      const { data, error } = await supabase
        .from("calendar_events")
        .update(updatesWithUTC)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Convert back to Stockholm time for local state
      const eventInStockholmTime = {
        ...data,
        start_time: toStockholmTime(data.start_time).toISOString(),
        end_time: toStockholmTime(data.end_time).toISOString(),
      };

      setEvents(events.map(e => e.id === id ? eventInStockholmTime : e));
      toast.success("Händelse uppdaterad");
      return eventInStockholmTime;
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
