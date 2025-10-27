-- Fix the notify_owner_on_booking_change trigger to handle NULL request headers safely
CREATE OR REPLACE FUNCTION public.notify_owner_on_booking_change()
RETURNS TRIGGER AS $$
DECLARE
  notification_type TEXT;
  booking_data JSONB;
  auth_header TEXT;
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

  -- Safely extract authorization header with error handling
  BEGIN
    auth_header := current_setting('request.headers', true);
    IF auth_header IS NOT NULL AND auth_header != '' THEN
      auth_header := (auth_header::json->>'authorization');
      IF auth_header IS NULL OR auth_header = '' THEN
        auth_header := 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoc2trbmtpdnVld3Vxb25qZGpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQwMjUxMywiZXhwIjoyMDc0OTc4NTEzfQ.default';
      END IF;
    ELSE
      auth_header := 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoc2trbmtpdnVld3Vxb25qZGpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQwMjUxMywiZXhwIjoyMDc0OTc4NTEzfQ.default';
    END IF;
  EXCEPTION WHEN OTHERS THEN
    auth_header := 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoc2trbmtpdnVld3Vxb25qZGpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQwMjUxMywiZXhwIjoyMDc0OTc4NTEzfQ.default';
  END;

  -- Call edge function asynchronously using pg_net
  PERFORM net.http_post(
    url := 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1/send-owner-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', auth_header
    ),
    body := booking_data
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;