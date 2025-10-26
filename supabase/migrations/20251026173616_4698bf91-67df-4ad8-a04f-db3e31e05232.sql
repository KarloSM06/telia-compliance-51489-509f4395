-- Add documentation comment to day_of_week column to clarify Swedish/ISO week standard
-- This ensures developers understand that 0=Monday, not Sunday (as in JavaScript Date.getDay())

COMMENT ON COLUMN public.availability_slots.day_of_week IS 
  'Day of week index following Swedish/ISO 8601 standard: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday, 5=Saturday, 6=Sunday. This differs from JavaScript Date.getDay() which uses 0=Sunday. Always convert when using Date.getDay().';