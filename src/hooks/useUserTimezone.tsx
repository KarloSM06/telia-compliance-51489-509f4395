import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Hook för att hämta och hantera användarens timezone-preferens
 */
export const useUserTimezone = () => {
  const { user } = useAuth();
  const [timezone, setTimezone] = useState<string>('Europe/Stockholm');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTimezone = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('timezone')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user timezone:', error);
        } else if (data?.timezone) {
          setTimezone(data.timezone);
        }
      } catch (error) {
        console.error('Error in useUserTimezone:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTimezone();
  }, [user]);

  const updateTimezone = async (newTimezone: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ timezone: newTimezone })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating timezone:', error);
        throw error;
      }

      setTimezone(newTimezone);
    } catch (error) {
      console.error('Error updating timezone:', error);
      throw error;
    }
  };

  return {
    timezone,
    loading,
    updateTimezone,
  };
};
