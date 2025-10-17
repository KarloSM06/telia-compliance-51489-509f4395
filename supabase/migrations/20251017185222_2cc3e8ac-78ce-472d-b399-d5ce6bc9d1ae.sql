-- Add columns for date-based availability management
ALTER TABLE public.availability_slots
ADD COLUMN IF NOT EXISTS specific_date DATE,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT true;

-- Add comment to explain the new columns
COMMENT ON COLUMN public.availability_slots.specific_date IS 'If set, this slot applies only to this specific date. If null, it applies to the recurring weekly schedule.';
COMMENT ON COLUMN public.availability_slots.is_locked IS 'If true, this slot is locked and will not be affected by template changes.';
COMMENT ON COLUMN public.availability_slots.is_template IS 'If true, this is a template slot that applies to all weeks. If false, it is a specific override.';