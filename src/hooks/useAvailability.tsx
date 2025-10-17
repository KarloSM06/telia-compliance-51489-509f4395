import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AvailabilitySlot {
  id: string;
  user_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAvailability = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Användare ej inloggad');
      }

      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('user_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error: any) {
      console.error('Error fetching availability slots:', error);
      toast.error('Kunde inte hämta tillgänglighet');
    } finally {
      setLoading(false);
    }
  };

  const createSlot = async (slotData: Omit<AvailabilitySlot, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Användare ej inloggad');
      }

      const { data, error } = await supabase
        .from('availability_slots')
        .insert([{ ...slotData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Tillgänglighet tillagd');
      await fetchSlots();
      return data;
    } catch (error: any) {
      console.error('Error creating availability slot:', error);
      toast.error('Kunde inte skapa tillgänglighet');
      throw error;
    }
  };

  const updateSlot = async (id: string, updates: Partial<AvailabilitySlot>) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tillgänglighet uppdaterad');
      await fetchSlots();
    } catch (error: any) {
      console.error('Error updating availability slot:', error);
      toast.error('Kunde inte uppdatera tillgänglighet');
      throw error;
    }
  };

  const deleteSlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Tillgänglighet borttagen');
      await fetchSlots();
    } catch (error: any) {
      console.error('Error deleting availability slot:', error);
      toast.error('Kunde inte ta bort tillgänglighet');
      throw error;
    }
  };

  useEffect(() => {
    fetchSlots();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability_slots'
        },
        () => fetchSlots()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    slots,
    loading,
    createSlot,
    updateSlot,
    deleteSlot,
    refetch: fetchSlots,
  };
};
