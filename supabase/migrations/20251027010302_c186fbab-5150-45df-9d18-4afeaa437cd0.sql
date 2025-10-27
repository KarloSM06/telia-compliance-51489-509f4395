-- Create notification_recipients table for additional contacts
CREATE TABLE IF NOT EXISTS public.notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Event triggers
  notify_on_new_booking BOOLEAN DEFAULT true,
  notify_on_booking_cancelled BOOLEAN DEFAULT true,
  notify_on_booking_updated BOOLEAN DEFAULT true,
  notify_on_new_review BOOLEAN DEFAULT false,
  notify_on_message_failed BOOLEAN DEFAULT false,
  
  -- Notification channels
  enable_email_notifications BOOLEAN DEFAULT true,
  enable_sms_notifications BOOLEAN DEFAULT false,
  
  -- Quiet hours
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Validation
  CONSTRAINT email_or_phone_required CHECK (
    email IS NOT NULL OR phone IS NOT NULL
  )
);

-- Enable RLS
ALTER TABLE public.notification_recipients ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own recipients"
  ON public.notification_recipients
  FOR SELECT
  USING (
    user_id = auth.uid() OR 
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can insert own recipients"
  ON public.notification_recipients
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own recipients"
  ON public.notification_recipients
  FOR UPDATE
  USING (
    user_id = auth.uid() OR 
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can delete own recipients"
  ON public.notification_recipients
  FOR DELETE
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_notification_recipients_updated_at
  BEFORE UPDATE ON public.notification_recipients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_notification_recipients_user_id ON public.notification_recipients(user_id);
CREATE INDEX idx_notification_recipients_organization_id ON public.notification_recipients(organization_id);
CREATE INDEX idx_notification_recipients_active ON public.notification_recipients(is_active) WHERE is_active = true;