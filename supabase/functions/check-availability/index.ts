import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { toZonedTime, fromZonedTime } from "https://esm.sh/date-fns-tz@3.2.0";
import { getDay } from "https://esm.sh/date-fns@3.6.0";
import { getErrorMessage } from '../_shared/errors.ts';

const STOCKHOLM_TZ = 'Europe/Stockholm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { user_id, date, start_time, end_time } = await req.json();

    if (!user_id || !date) {
      return new Response(
        JSON.stringify({ error: 'user_id and date are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get day of week (0-6, Sunday-Saturday) in Stockholm timezone
    const requestDate = new Date(date);
    const stockholmDate = toZonedTime(requestDate, STOCKHOLM_TZ);
    const dayOfWeek = getDay(stockholmDate);

    // Fetch user's availability slots for this day
    const { data: availabilitySlots, error: slotsError } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('user_id', user_id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true);

    if (slotsError) {
      console.error('Error fetching availability slots:', slotsError);
      throw slotsError;
    }

    // Fetch user's profile settings for lunch break and availability enabled
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('availability_enabled, lunch_break_enabled, lunch_break_start, lunch_break_end')
      .eq('id', user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }

    // Check if availability system is disabled
    if (profile && !profile.availability_enabled) {
      return new Response(
        JSON.stringify({ 
          available: true,
          message: 'Availability system is disabled - all times available',
          available_slots: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!availabilitySlots || availabilitySlots.length === 0) {
      return new Response(
        JSON.stringify({ 
          available: false, 
          message: 'No availability slots configured for this day',
          available_slots: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Function to check if time overlaps with lunch break
    const isInLunchBreak = (startTime: string, endTime: string): boolean => {
      if (!profile?.lunch_break_enabled) return false;
      
      const lunchStart = `${date}T${profile.lunch_break_start}`;
      const lunchEnd = `${date}T${profile.lunch_break_end}`;
      
      return (
        (startTime >= lunchStart && startTime < lunchEnd) ||
        (endTime > lunchStart && endTime <= lunchEnd) ||
        (startTime <= lunchStart && endTime >= lunchEnd)
      );
    };

    // Fetch existing events for this day (in Stockholm timezone)
    const stockholmStartOfDay = toZonedTime(requestDate, STOCKHOLM_TZ);
    stockholmStartOfDay.setHours(0, 0, 0, 0);
    const stockholmEndOfDay = toZonedTime(requestDate, STOCKHOLM_TZ);
    stockholmEndOfDay.setHours(23, 59, 59, 999);
    
    const startOfDayUTC = fromZonedTime(stockholmStartOfDay, STOCKHOLM_TZ);
    const endOfDayUTC = fromZonedTime(stockholmEndOfDay, STOCKHOLM_TZ);

    const { data: existingEvents, error: eventsError } = await supabase
      .from('calendar_events')
      .select('start_time, end_time')
      .eq('user_id', user_id)
      .gte('start_time', startOfDayUTC.toISOString())
      .lte('start_time', endOfDayUTC.toISOString());

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      throw eventsError;
    }

    // If specific time range requested, check if it's available
    if (start_time && end_time) {
      const requestStart = `${date}T${start_time}`;
      const requestEnd = `${date}T${end_time}`;

      // Check lunch break first
      if (isInLunchBreak(requestStart, requestEnd)) {
        return new Response(
          JSON.stringify({ 
            available: false, 
            message: 'Requested time overlaps with lunch break' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if time falls within any availability slot
      const isInAvailabilitySlot = availabilitySlots.some(slot => {
        const slotStart = `${date}T${slot.start_time}`;
        const slotEnd = `${date}T${slot.end_time}`;
        return requestStart >= slotStart && requestEnd <= slotEnd;
      });

      if (!isInAvailabilitySlot) {
        return new Response(
          JSON.stringify({ 
            available: false, 
            message: 'Requested time is outside availability slots' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check for conflicts with existing events
      const hasConflict = existingEvents?.some(event => {
        const eventStart = event.start_time;
        const eventEnd = event.end_time;
        return (
          (requestStart >= eventStart && requestStart < eventEnd) ||
          (requestEnd > eventStart && requestEnd <= eventEnd) ||
          (requestStart <= eventStart && requestEnd >= eventEnd)
        );
      });

      return new Response(
        JSON.stringify({ 
          available: !hasConflict,
          message: hasConflict ? 'Time slot is already booked' : 'Time slot is available'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return all available slots for the day
    const availableSlots = availabilitySlots.map(slot => {
      // Filter out booked times within this slot
      const slotStart = `${date}T${slot.start_time}`;
      const slotEnd = `${date}T${slot.end_time}`;

      // Check if slot overlaps with lunch break
      const lunchOverlap = profile?.lunch_break_enabled && isInLunchBreak(slotStart, slotEnd);

      const conflicts = existingEvents?.filter(event => {
        return (
          (event.start_time >= slotStart && event.start_time < slotEnd) ||
          (event.end_time > slotStart && event.end_time <= slotEnd)
        );
      }) || [];

      return {
        start_time: slot.start_time,
        end_time: slot.end_time,
        has_conflicts: conflicts.length > 0 || lunchOverlap,
        is_lunch_break: lunchOverlap,
        conflicts: conflicts.map(c => ({
          start: c.start_time,
          end: c.end_time
        }))
      };
    });

    return new Response(
      JSON.stringify({ 
        available: true,
        day_of_week: dayOfWeek,
        available_slots: availableSlots
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error checking availability:', error);
    return new Response(
      JSON.stringify({ error: getErrorMessage(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
