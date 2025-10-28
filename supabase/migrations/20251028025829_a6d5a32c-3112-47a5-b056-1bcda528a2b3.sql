-- Fix 1: Enable RLS on ai_consultations table with proper policies
ALTER TABLE public.ai_consultations ENABLE ROW LEVEL SECURITY;

-- Users can view their own consultations
CREATE POLICY "Users view own consultations"
  ON public.ai_consultations FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Hiems admins can view all consultations
CREATE POLICY "Admins view all consultations"
  ON public.ai_consultations FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Anyone can submit consultations (form submission)
CREATE POLICY "Anyone can submit consultations"
  ON public.ai_consultations FOR INSERT
  WITH CHECK (true);

-- Admins can update consultations
CREATE POLICY "Admins can update consultations"
  ON public.ai_consultations FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Fix 2: Enable RLS on sms_provider_settings table
ALTER TABLE public.sms_provider_settings ENABLE ROW LEVEL SECURITY;

-- Users can only access their own SMS provider settings
CREATE POLICY "Users access own SMS settings"
  ON public.sms_provider_settings FOR ALL
  USING (user_id = auth.uid());

-- Fix 3: Enable RLS on webhook_secrets table
ALTER TABLE public.webhook_secrets ENABLE ROW LEVEL SECURITY;

-- Users can only access webhook secrets for their own integrations
CREATE POLICY "Users access own webhook secrets"
  ON public.webhook_secrets FOR SELECT
  USING (
    integration_id IN (
      SELECT id FROM public.booking_system_integrations 
      WHERE user_id = auth.uid()
    )
  );

-- Service role can manage webhook secrets (for edge functions)
CREATE POLICY "Service role manages webhook secrets"
  ON public.webhook_secrets FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Fix 4: Add SET search_path to functions missing it
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.conversation_id IS NOT NULL THEN
    UPDATE public.lead_chat_conversations
    SET 
      updated_at = now(),
      message_count = message_count + 1,
      title = CASE 
        WHEN title IS NULL AND NEW.role = 'user' THEN 
          left(NEW.content, 50) || CASE WHEN length(NEW.content) > 50 THEN '...' ELSE '' END
        ELSE title
      END
    WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_owner_notification_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;