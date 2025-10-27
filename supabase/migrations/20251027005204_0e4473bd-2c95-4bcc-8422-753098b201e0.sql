-- Create owner notification settings table
CREATE TABLE IF NOT EXISTS public.owner_notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Contact information
  notification_email TEXT,
  notification_phone TEXT,
  
  -- Event triggers
  notify_on_new_booking BOOLEAN DEFAULT TRUE,
  notify_on_booking_cancelled BOOLEAN DEFAULT TRUE,
  notify_on_booking_updated BOOLEAN DEFAULT TRUE,
  notify_on_new_review BOOLEAN DEFAULT TRUE,
  notify_on_message_failed BOOLEAN DEFAULT TRUE,
  
  -- Channel settings
  enable_email_notifications BOOLEAN DEFAULT TRUE,
  enable_sms_notifications BOOLEAN DEFAULT FALSE,
  enable_inapp_notifications BOOLEAN DEFAULT TRUE,
  
  -- Advanced settings
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.owner_notification_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notification settings"
  ON public.owner_notification_settings
  FOR SELECT
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can insert own notification settings"
  ON public.owner_notification_settings
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notification settings"
  ON public.owner_notification_settings
  FOR UPDATE
  USING (user_id = auth.uid() OR organization_id = user_organization_id(auth.uid()));

CREATE POLICY "Users can delete own notification settings"
  ON public.owner_notification_settings
  FOR DELETE
  USING (user_id = auth.uid());

-- Unique index to ensure only one setting per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_owner_notification_settings_user 
  ON public.owner_notification_settings(user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_owner_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_owner_notification_settings_timestamp
  BEFORE UPDATE ON public.owner_notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_owner_notification_settings_updated_at();

-- Function to notify owner on booking changes
CREATE OR REPLACE FUNCTION notify_owner_on_booking_change()
RETURNS TRIGGER AS $$
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

  -- Call edge function asynchronously using pg_net
  PERFORM net.http_post(
    url := 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1/send-owner-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('request.headers')::json->>'authorization'
    ),
    body := booking_data
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on calendar_events
DROP TRIGGER IF EXISTS on_calendar_event_change ON public.calendar_events;
CREATE TRIGGER on_calendar_event_change
  AFTER INSERT OR UPDATE OR DELETE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION notify_owner_on_booking_change();