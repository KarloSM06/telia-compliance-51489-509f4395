-- Optimize RLS policies for better performance - Part 2
-- Continuing with remaining tables

-- ============================================================================
-- PHONE_NUMBERS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can delete own phone numbers" ON public.phone_numbers;
CREATE POLICY "Users can delete own phone numbers" 
  ON public.phone_numbers
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own phone numbers" ON public.phone_numbers;
CREATE POLICY "Users can insert own phone numbers" 
  ON public.phone_numbers
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own phone numbers" ON public.phone_numbers;
CREATE POLICY "Users can update own phone numbers" 
  ON public.phone_numbers
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own phone numbers" ON public.phone_numbers;
CREATE POLICY "Users can view own phone numbers" 
  ON public.phone_numbers
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- SMS_PROVIDER_SETTINGS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users access own SMS settings" ON public.sms_provider_settings;
CREATE POLICY "Users access own SMS settings" 
  ON public.sms_provider_settings
  FOR ALL 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can delete own SMS provider settings" ON public.sms_provider_settings;
CREATE POLICY "Users can delete own SMS provider settings" 
  ON public.sms_provider_settings
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own SMS provider settings" ON public.sms_provider_settings;
CREATE POLICY "Users can insert own SMS provider settings" 
  ON public.sms_provider_settings
  FOR INSERT 
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own SMS provider settings" ON public.sms_provider_settings;
CREATE POLICY "Users can update own SMS provider settings" 
  ON public.sms_provider_settings
  FOR UPDATE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own SMS provider settings" ON public.sms_provider_settings;
CREATE POLICY "Users can view own SMS provider settings" 
  ON public.sms_provider_settings
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- CONVERSION_FUNNEL_METRICS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert their own funnel metrics" ON public.conversion_funnel_metrics;
CREATE POLICY "Users can insert their own funnel metrics" 
  ON public.conversion_funnel_metrics
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own funnel metrics" ON public.conversion_funnel_metrics;
CREATE POLICY "Users can update their own funnel metrics" 
  ON public.conversion_funnel_metrics
  FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own funnel metrics" ON public.conversion_funnel_metrics;
CREATE POLICY "Users can view their own funnel metrics" 
  ON public.conversion_funnel_metrics
  FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);