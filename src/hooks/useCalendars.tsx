import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Calendar {
  id: string;
  user_id: string;
  organization_id?: string;
  name: string;
  description?: string;
  color: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCalendars = () => {
  const { user } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [defaultCalendar, setDefaultCalendar] = useState<Calendar | null>(null);

  const fetchCalendars = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("calendars")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("is_default", { ascending: false })
        .order("name", { ascending: true });

      if (error) throw error;
      
      setCalendars(data || []);
      setDefaultCalendar(data?.find(c => c.is_default) || null);
    } catch (error) {
      console.error("Error fetching calendars:", error);
      toast.error("Kunde inte hämta kalendrar");
    } finally {
      setLoading(false);
    }
  };

  const createCalendar = async (calendar: Partial<Calendar>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("calendars")
        .insert([{
          user_id: user.id,
          name: calendar.name || 'Ny kalender',
          description: calendar.description,
          color: calendar.color || '#3b82f6',
          is_default: calendar.is_default || false,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;

      setCalendars([...calendars, data]);
      toast.success("Kalender skapad");
      return data;
    } catch (error: any) {
      console.error("Error creating calendar:", error);
      toast.error("Kunde inte skapa kalender: " + (error?.message || "Okänt fel"));
      throw error;
    }
  };

  const updateCalendar = async (id: string, updates: Partial<Calendar>) => {
    try {
      const { data, error } = await supabase
        .from("calendars")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setCalendars(calendars.map(c => c.id === id ? data : c));
      if (data.is_default) setDefaultCalendar(data);
      toast.success("Kalender uppdaterad");
      return data;
    } catch (error) {
      console.error("Error updating calendar:", error);
      toast.error("Kunde inte uppdatera kalender");
      throw error;
    }
  };

  const deleteCalendar = async (id: string) => {
    try {
      // Soft delete - set is_active to false
      const { error } = await supabase
        .from("calendars")
        .update({ is_active: false })
        .eq("id", id);

      if (error) throw error;

      setCalendars(calendars.filter(c => c.id !== id));
      toast.success("Kalender borttagen");
    } catch (error) {
      console.error("Error deleting calendar:", error);
      toast.error("Kunde inte ta bort kalender");
      throw error;
    }
  };

  useEffect(() => {
    fetchCalendars();

    const channel = supabase
      .channel('calendars-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendars',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchCalendars();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    calendars,
    defaultCalendar,
    loading,
    createCalendar,
    updateCalendar,
    deleteCalendar,
    refetch: fetchCalendars,
  };
};
