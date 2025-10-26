import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserTimezone } from "@/hooks/useUserTimezone";
import { toast } from "sonner";
import { toISOStringWithOffset } from "@/lib/timezoneUtils";
import { normalizePhoneNumber } from "@/lib/phoneUtils";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  /** 
   * Start time as TEXT with timezone offset (from database)
   * Format: "2025-10-26T08:00:00+01:00" (winter) or "2025-06-15T14:00:00+02:00" (summer)
   * Can be parsed directly: new Date(start_time)
   * For n8n/AI systems: Read directly from database
   */
  start_time: string;
  /** 
   * End time as TEXT with timezone offset (from database)
   * Format: "2025-10-26T09:00:00+01:00"
   * Can be parsed directly: new Date(end_time)
   */
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
  const { timezone } = useUserTimezone();
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
      
      // Events now stored as TEXT with timezone offset
      // Format: "2025-10-26T08:00:00+01:00"
      setEvents(data || []);
      
      // Log timezone info for debugging (first event only)
      if (data && data.length > 0) {
        const sampleEvent = data[0];
        console.log('📅 Calendar Events Loaded:', {
          totalEvents: data.length,
          timezone,
          sampleEvent: {
            id: sampleEvent.id,
            title: sampleEvent.title,
            stored_text: sampleEvent.start_time, // TEXT: "2025-10-26T08:00:00+01:00"
          }
        });
      }
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
      // Times from EventModal contain timezone offset (TEXT format)
      // e.g., "2025-10-26T08:00:00+01:00"
      // Save directly to TEXT column - no conversion needed
      const startTimeWithOffset = event.start_time || toISOStringWithOffset(new Date(), timezone);
      const endTimeWithOffset = event.end_time || toISOStringWithOffset(new Date(), timezone);

      // Validate that offset exists
      if (!startTimeWithOffset.match(/[+-]\d{2}:\d{2}$/)) {
        throw new Error('start_time must contain timezone offset');
      }

      const eventData: any = {
        user_id: user.id,
        title: event.title || 'Ny händelse',
        start_time: startTimeWithOffset,
        end_time: endTimeWithOffset,
        event_type: event.event_type || 'meeting',
        status: event.status || 'scheduled',
        source: event.source || 'internal',
        timezone: timezone,
        description: event.description,
        contact_person: event.contact_person,
        contact_email: event.contact_email,
        contact_phone: event.contact_phone ? normalizePhoneNumber(event.contact_phone) : undefined,
        address: event.address,
        lead_id: event.lead_id,
      };

      const { data, error } = await supabase
        .from("calendar_events")
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      
      // Schedule reminders automatically
      if (data && (event.contact_email || event.contact_phone)) {
        try {
          const { error: scheduleError } = await supabase.functions.invoke('schedule-reminders', {
            body: { calendarEventId: data.id }
          });
          
          if (scheduleError) {
            console.error('Failed to schedule reminders:', scheduleError);
            toast.error('Händelse skapad men påminnelser kunde inte schemaläggas');
          } else {
            toast.success('Händelse och påminnelser skapade');
          }
        } catch (scheduleError) {
          console.error('Failed to schedule reminders:', scheduleError);
          toast.success('Händelse skapad');
        }
      } else {
        toast.success('Händelse skapad');
      }
      
      // Data now contains TEXT with offset
      setEvents([...events, data]);
      return data;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Kunde inte skapa händelse");
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      // Times from components contain timezone offset (TEXT format)
      // Save directly to TEXT column
      const { data, error } = await supabase
        .from("calendar_events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Data now contains TEXT with offset
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

  /**
   * Get events for external systems (AI models, webhooks, etc.)
   * Events are already in TEXT format with timezone offset
   * Example: "2025-10-26T08:00:00+01:00"
   * No conversion needed - return directly
   */
  const getEventsForExport = (): CalendarEvent[] => {
    return events; // Already in correct TEXT format with offset
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
    events, // TEXT format with offset: "2025-10-26T08:00:00+01:00"
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
    getEventsForExport, // Export-ready events with local timezone offset
    timezone, // User's timezone setting
  };
};
