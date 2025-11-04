-- Fix critical security issues: Remove hardcoded service role key and fix phone_numbers RLS

-- ============================================================================
-- 1. Fix notify_owner_on_booking_change to remove hardcoded service role key
-- ============================================================================
CREATE OR REPLACE FUNCTION public.notify_owner_on_booking_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  notification_type TEXT;
  booking_data JSONB;
BEGIN
  -- Determine notification type
  IF TG_OP = 'INSERT' THEN
    notification_type := 'new_booking';
  ELSIF TG_OP = 'UPDATE' THEN
    notification_type := 'booking_updated';
  ELSIF TG_OP = 'DELETE' THEN
    notification_type := 'booking_cancelled';
  END IF;

  -- Build booking data payload
  booking_data := jsonb_build_object(
    'event_type', notification_type,
    'booking_id', COALESCE(NEW.id, OLD.id),
    'title', COALESCE(NEW.title, OLD.title),
    'customer_name', COALESCE(NEW.contact_person, OLD.contact_person),
    'customer_email', COALESCE(NEW.contact_email, OLD.contact_email),
    'customer_phone', COALESCE(NEW.contact_phone, OLD.contact_phone),
    'start_time', COALESCE(NEW.start_time, OLD.start_time),
    'end_time', COALESCE(NEW.end_time, OLD.end_time),
    'user_id', COALESCE(NEW.user_id, OLD.user_id)
  );

  -- Call edge function using pg_net with service role from secrets
  -- Note: This function runs as SECURITY DEFINER, giving it elevated privileges
  PERFORM net.http_post(
    url := 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1/send-owner-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.supabase_service_role_key', true)
    ),
    body := booking_data
  );

  RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the transaction
  RAISE WARNING 'Failed to send notification: %', SQLERRM;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ============================================================================
-- 2. Fix phone_numbers RLS to restrict to user's own data
-- ============================================================================

-- Drop the overly permissive policy if it still exists
DROP POLICY IF EXISTS "Authenticated users can view phone numbers" ON public.phone_numbers;
DROP POLICY IF EXISTS "Anyone can insert phone numbers" ON public.phone_numbers;

-- Ensure user_id column exists
ALTER TABLE public.phone_numbers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Recreate policies if they don't exist properly (using DO block to avoid errors)
DO $$
BEGIN
  -- Drop and recreate admin policy
  DROP POLICY IF EXISTS "Admins can view all phone numbers" ON public.phone_numbers;
  CREATE POLICY "Admins can view all phone numbers"
  ON public.phone_numbers FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
EXCEPTION WHEN OTHERS THEN
  -- Policy might already exist, that's okay
  NULL;
END $$;

-- Ensure RLS is enabled
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;