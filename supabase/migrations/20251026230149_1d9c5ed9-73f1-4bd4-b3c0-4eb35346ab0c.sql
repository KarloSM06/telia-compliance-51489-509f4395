-- ============================================================================
-- REMINDER & CONFIRMATION SYSTEM - DATABASE STRUCTURE
-- Sprint 1: Core tables and RLS policies
-- ============================================================================

-- 1. MESSAGE TEMPLATES
-- Stores user-created templates for booking confirmations, reminders, and review requests
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  template_type TEXT NOT NULL CHECK (template_type IN ('booking_confirmation', 'reminder', 'review_request', 'cancellation')),
  name TEXT NOT NULL,
  subject TEXT, -- For email only
  body_template TEXT NOT NULL, -- Template with variables like {{customer_name}}, {{date}}, etc.
  tone TEXT NOT NULL DEFAULT 'friendly' CHECK (tone IN ('formal', 'friendly', 'fun', 'sales')),
  language TEXT NOT NULL DEFAULT 'sv' CHECK (language IN ('sv', 'en')),
  channel TEXT[] NOT NULL DEFAULT ARRAY['email']::TEXT[], -- ['sms', 'email'] or just one
  is_active BOOLEAN NOT NULL DEFAULT true,
  variables JSONB DEFAULT '["customer_name", "date", "time", "service", "address", "contact_person"]'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SCHEDULED MESSAGES
-- Stores all scheduled messages (confirmations, reminders, review requests)
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('booking_confirmation', 'reminder', 'review_request', 'cancellation')),
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'both')),
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  recipient_phone TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  generated_subject TEXT, -- AI-generated subject for email
  generated_message TEXT NOT NULL, -- AI-generated message content
  delivery_status JSONB DEFAULT '{}'::JSONB, -- {sms_status, email_status, error_message}
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_messages_status_time ON public.scheduled_messages(status, scheduled_for) 
  WHERE status = 'pending';
CREATE INDEX idx_scheduled_messages_event ON public.scheduled_messages(calendar_event_id);
CREATE INDEX idx_scheduled_messages_user ON public.scheduled_messages(user_id);

-- 3. MESSAGE LOGS
-- Audit log of all sent messages with delivery tracking
CREATE TABLE IF NOT EXISTS public.message_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_message_id UUID REFERENCES public.scheduled_messages(id) ON DELETE SET NULL,
  calendar_event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email')),
  recipient TEXT NOT NULL, -- Email or phone number
  subject TEXT, -- For email only
  message_body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('delivered', 'failed', 'bounced', 'opened', 'clicked')),
  provider TEXT NOT NULL, -- 'twilio', 'resend', etc.
  provider_message_id TEXT,
  cost NUMERIC(10, 4), -- Cost in SEK
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ, -- For email tracking
  clicked_at TIMESTAMPTZ, -- For link tracking in email
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_message_logs_user_date ON public.message_logs(user_id, sent_at DESC);
CREATE INDEX idx_message_logs_event ON public.message_logs(calendar_event_id);

-- 4. REMINDER SETTINGS
-- User-specific settings for reminder timing and channels
CREATE TABLE IF NOT EXISTS public.reminder_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  
  -- Booking confirmation settings
  booking_confirmation_enabled BOOLEAN NOT NULL DEFAULT true,
  booking_confirmation_channel TEXT[] NOT NULL DEFAULT ARRAY['email']::TEXT[],
  
  -- First reminder (e.g., 48 hours before)
  reminder_1_enabled BOOLEAN NOT NULL DEFAULT true,
  reminder_1_hours_before INTEGER NOT NULL DEFAULT 48,
  reminder_1_channel TEXT[] NOT NULL DEFAULT ARRAY['sms', 'email']::TEXT[],
  
  -- Second reminder (e.g., 2 hours before)
  reminder_2_enabled BOOLEAN NOT NULL DEFAULT true,
  reminder_2_hours_before INTEGER NOT NULL DEFAULT 2,
  reminder_2_channel TEXT[] NOT NULL DEFAULT ARRAY['sms']::TEXT[],
  
  -- Review request settings
  review_request_enabled BOOLEAN NOT NULL DEFAULT true,
  review_request_hours_after INTEGER NOT NULL DEFAULT 2,
  review_request_channel TEXT[] NOT NULL DEFAULT ARRAY['email']::TEXT[],
  
  -- Default templates
  default_template_confirmation UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  default_template_reminder UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  default_template_review UUID REFERENCES public.message_templates(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. OWNER NOTIFICATIONS
-- Real-time notifications to account owner about booking activities
CREATE TABLE IF NOT EXISTS public.owner_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'new_booking', 'booking_updated', 'booking_cancelled', 
    'message_sent', 'message_failed', 'review_received'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  channel TEXT[] NOT NULL DEFAULT ARRAY['email']::TEXT[], -- ['sms', 'email', 'push']
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'read')),
  metadata JSONB DEFAULT '{}'::JSONB, -- Customer info, click-to-call links, etc.
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_owner_notifications_user_status ON public.owner_notifications(user_id, status, created_at DESC);

-- 6. REVIEWS
-- Customer reviews after appointments
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_event_id UUID NOT NULL REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  review_link TEXT, -- Link to review page
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_user ON public.reviews(user_id);
CREATE INDEX idx_reviews_event ON public.reviews(calendar_event_id);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- MESSAGE TEMPLATES
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own templates"
  ON public.message_templates FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can insert own templates"
  ON public.message_templates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own templates"
  ON public.message_templates FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can delete own templates"
  ON public.message_templates FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- SCHEDULED MESSAGES
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scheduled messages"
  ON public.scheduled_messages FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own scheduled messages"
  ON public.scheduled_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own scheduled messages"
  ON public.scheduled_messages FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own scheduled messages"
  ON public.scheduled_messages FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- MESSAGE LOGS
ALTER TABLE public.message_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own message logs"
  ON public.message_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert message logs"
  ON public.message_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- REMINDER SETTINGS
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminder settings"
  ON public.reminder_settings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own reminder settings"
  ON public.reminder_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reminder settings"
  ON public.reminder_settings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- OWNER NOTIFICATIONS
ALTER TABLE public.owner_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.owner_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON public.owner_notifications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.owner_notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON public.owner_notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- REVIEWS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reviews"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own reviews"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create triggers if they don't already exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_message_templates_updated_at') THEN
    CREATE TRIGGER update_message_templates_updated_at
      BEFORE UPDATE ON public.message_templates
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_scheduled_messages_updated_at') THEN
    CREATE TRIGGER update_scheduled_messages_updated_at
      BEFORE UPDATE ON public.scheduled_messages
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reminder_settings_updated_at') THEN
    CREATE TRIGGER update_reminder_settings_updated_at
      BEFORE UPDATE ON public.reminder_settings
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_reviews_updated_at') THEN
    CREATE TRIGGER update_reviews_updated_at
      BEFORE UPDATE ON public.reviews
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;