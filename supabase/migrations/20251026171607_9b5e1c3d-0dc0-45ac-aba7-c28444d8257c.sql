-- Add availability and lunch break settings to profiles table
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS availability_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS lunch_break_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lunch_break_start TIME DEFAULT '12:00',
  ADD COLUMN IF NOT EXISTS lunch_break_end TIME DEFAULT '13:00';

COMMENT ON COLUMN profiles.availability_enabled IS 'Whether to use availability system for booking restrictions';
COMMENT ON COLUMN profiles.lunch_break_enabled IS 'Whether to automatically block lunch break times';
COMMENT ON COLUMN profiles.lunch_break_start IS 'Lunch break start time (applies every day if enabled)';
COMMENT ON COLUMN profiles.lunch_break_end IS 'Lunch break end time (applies every day if enabled)';