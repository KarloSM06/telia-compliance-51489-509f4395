-- Add timezone column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/Stockholm' NOT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.timezone IS 'User preferred timezone for calendar and date display';

-- Create index for faster timezone lookups
CREATE INDEX IF NOT EXISTS idx_profiles_timezone ON public.profiles(timezone);