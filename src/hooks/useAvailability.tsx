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
  specific_date?: string | null;
  is_locked?: boolean;
  is_template?: boolean;
  created_at: string;
  updated_at: string;
}

export const useAvailability = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async (weekStartDate?: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Användare ej inloggad');
      }

      let query = supabase
        .from('availability_slots')
        .select('*')
        .eq('user_id', user.id);

      // If weekStartDate is provided, fetch template slots + specific overrides for that week
      if (weekStartDate) {
        const weekStart = new Date(weekStartDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        query = query.or(
          `is_template.eq.true,and(specific_date.gte.${weekStart.toISOString().split('T')[0]},specific_date.lte.${weekEnd.toISOString().split('T')[0]})`
        );
      } else {
        // Fetch only template slots
        query = query.eq('is_template', true);
      }

      query = query
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      const { data, error } = await query;

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

  const bulkCreateSlots = async (slotsData: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at' | 'user_id'>[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Användare ej inloggad');
      }

      const slotsWithUserId = slotsData.map(slot => ({
        ...slot,
        user_id: user.id,
      }));

      const { error } = await supabase
        .from('availability_slots')
        .insert(slotsWithUserId);

      if (error) throw error;
      
      toast.success('Veckoschemat har sparats');
      await fetchSlots();
    } catch (error: any) {
      console.error('Error creating availability slots:', error);
      toast.error('Kunde inte skapa tidsluckorna');
      throw error;
    }
  };

  const replaceWeeklySchedule = async (
    slotsData: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at' | 'user_id'>[],
    weekStartDate?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Användare ej inloggad');
      }

      // If weekStartDate is provided, this is a week-specific override
      if (weekStartDate) {
        const weekStart = new Date(weekStartDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Delete existing non-locked specific slots for this week
        const { error: deleteError } = await supabase
          .from('availability_slots')
          .delete()
          .eq('user_id', user.id)
          .eq('is_locked', false)
          .gte('specific_date', weekStart.toISOString().split('T')[0])
          .lte('specific_date', weekEnd.toISOString().split('T')[0]);

        if (deleteError) throw deleteError;
      } else {
        // Delete all non-locked template slots
        const { error: deleteError } = await supabase
          .from('availability_slots')
          .delete()
          .eq('user_id', user.id)
          .eq('is_template', true)
          .eq('is_locked', false);

        if (deleteError) throw deleteError;
      }

      // Create new slots
      if (slotsData.length > 0) {
        await bulkCreateSlots(slotsData);
      } else {
        toast.success('Schemat har uppdaterats');
        await fetchSlots(weekStartDate);
      }
    } catch (error: any) {
      console.error('Error replacing weekly schedule:', error);
      toast.error('Kunde inte uppdatera schemat');
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
    bulkCreateSlots,
    replaceWeeklySchedule,
    refetch: fetchSlots,
    fetchSlots,
  };
};
