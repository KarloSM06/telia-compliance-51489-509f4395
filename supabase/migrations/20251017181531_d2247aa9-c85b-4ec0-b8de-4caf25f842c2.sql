-- Create availability_slots table for managing user availability
CREATE TABLE public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Create policies for availability_slots
CREATE POLICY "Users can view own availability slots"
  ON public.availability_slots
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own availability slots"
  ON public.availability_slots
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own availability slots"
  ON public.availability_slots
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own availability slots"
  ON public.availability_slots
  FOR DELETE
  USING (user_id = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_availability_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better query performance
CREATE INDEX idx_availability_slots_user_day ON public.availability_slots(user_id, day_of_week);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.availability_slots;