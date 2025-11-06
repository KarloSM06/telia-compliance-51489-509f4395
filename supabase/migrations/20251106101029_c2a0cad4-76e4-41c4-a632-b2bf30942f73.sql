-- =====================================================
-- FAS 1: DUPLICATE INDEX CLEANUP (3 fixes)
-- =====================================================

-- 1. Ta bort duplicerat index på ai_usage_logs
DROP INDEX IF EXISTS public.idx_ai_usage_user_date;

-- 2. Ta bort duplicerat index på telephony_events  
DROP INDEX IF EXISTS public.idx_telephony_events_user_timestamp;

-- 3. Ta bort duplicerad unique constraint på user_ai_settings
ALTER TABLE public.user_ai_settings DROP CONSTRAINT IF EXISTS user_ai_settings_user_id_unique;

-- =====================================================
-- FAS 2: FIX AUTH RLS INITIALIZATION PLAN (26 fixes)
-- =====================================================

-- Fix Admin Policies on calls
DROP POLICY IF EXISTS "Admins can view all calls" ON public.calls;
CREATE POLICY "Admins can view all calls" ON public.calls
FOR SELECT USING ((SELECT public.is_admin(auth.uid())));

-- Fix Admin Policies on phone_numbers
DROP POLICY IF EXISTS "Admins can view all phone numbers" ON public.phone_numbers;
CREATE POLICY "Admins can view all phone numbers" ON public.phone_numbers
FOR SELECT USING ((SELECT public.is_admin(auth.uid())));

-- Fix Admin Policies on calendar_events
DROP POLICY IF EXISTS "Admins can view all calendar_events" ON public.calendar_events;
CREATE POLICY "Admins can view all calendar_events" ON public.calendar_events
FOR SELECT USING ((SELECT public.is_admin(auth.uid())));

-- Fix Admin Policies on telephony_events
DROP POLICY IF EXISTS "Admins can view all telephony_events" ON public.telephony_events;
CREATE POLICY "Admins can view all telephony_events" ON public.telephony_events
FOR SELECT USING ((SELECT public.is_admin(auth.uid())));

-- Fix Admin Policies on sidebar_permissions (4 policies)
DROP POLICY IF EXISTS "Admins can delete permissions" ON public.sidebar_permissions;
CREATE POLICY "Admins can delete permissions" ON public.sidebar_permissions
FOR DELETE USING ((SELECT public.is_admin(auth.uid())));

DROP POLICY IF EXISTS "Admins can insert permissions" ON public.sidebar_permissions;
CREATE POLICY "Admins can insert permissions" ON public.sidebar_permissions
FOR INSERT WITH CHECK ((SELECT public.is_admin(auth.uid())));

DROP POLICY IF EXISTS "Admins can update permissions" ON public.sidebar_permissions;
CREATE POLICY "Admins can update permissions" ON public.sidebar_permissions
FOR UPDATE USING ((SELECT public.is_admin(auth.uid())));

DROP POLICY IF EXISTS "Admins can view all permissions" ON public.sidebar_permissions;
CREATE POLICY "Admins can view all permissions" ON public.sidebar_permissions
FOR SELECT USING ((SELECT public.is_admin(auth.uid())));

-- Fix User Policies on calendars (4 policies)
DROP POLICY IF EXISTS "Users can delete own calendars" ON public.calendars;
CREATE POLICY "Users can delete own calendars" ON public.calendars
FOR DELETE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own calendars" ON public.calendars;
CREATE POLICY "Users can insert own calendars" ON public.calendars
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own calendars" ON public.calendars;
CREATE POLICY "Users can update own calendars" ON public.calendars
FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own calendars" ON public.calendars;
CREATE POLICY "Users can view own calendars" ON public.calendars
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix User Policies on user_ai_settings (4 policies)
DROP POLICY IF EXISTS "Users can delete own AI settings" ON public.user_ai_settings;
CREATE POLICY "Users can delete own AI settings" ON public.user_ai_settings
FOR DELETE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own AI settings" ON public.user_ai_settings;
CREATE POLICY "Users can insert own AI settings" ON public.user_ai_settings
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own AI settings" ON public.user_ai_settings;
CREATE POLICY "Users can update own AI settings" ON public.user_ai_settings
FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own AI settings" ON public.user_ai_settings;
CREATE POLICY "Users can view own AI settings" ON public.user_ai_settings
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix ai_usage_logs
DROP POLICY IF EXISTS "Users can view own AI usage" ON public.ai_usage_logs;
CREATE POLICY "Users can view own AI usage" ON public.ai_usage_logs
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix openrouter_account_snapshots (2 policies)
DROP POLICY IF EXISTS "Users can insert own snapshots" ON public.openrouter_account_snapshots;
CREATE POLICY "Users can insert own snapshots" ON public.openrouter_account_snapshots
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own snapshots" ON public.openrouter_account_snapshots;
CREATE POLICY "Users can view own snapshots" ON public.openrouter_account_snapshots
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix openrouter_usage_history (2 policies)
DROP POLICY IF EXISTS "Users can insert own usage history" ON public.openrouter_usage_history;
CREATE POLICY "Users can insert own usage history" ON public.openrouter_usage_history
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own usage history" ON public.openrouter_usage_history;
CREATE POLICY "Users can view own usage history" ON public.openrouter_usage_history
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix notification_insights
DROP POLICY IF EXISTS "Users can view their own notification insights" ON public.notification_insights;
CREATE POLICY "Users can view their own notification insights" ON public.notification_insights
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix notification_analysis_queue (2 policies)
DROP POLICY IF EXISTS "Users can insert their own queue items" ON public.notification_analysis_queue;
CREATE POLICY "Users can insert their own queue items" ON public.notification_analysis_queue
FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view their own queue items" ON public.notification_analysis_queue;
CREATE POLICY "Users can view their own queue items" ON public.notification_analysis_queue
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- Fix integration_logs (keep original logic, just wrap auth.uid())
DROP POLICY IF EXISTS "Users can view their own integration logs" ON public.integration_logs;
CREATE POLICY "Users can view their own integration logs" ON public.integration_logs
FOR SELECT USING (integration_id IN (
  SELECT integrations.id
  FROM integrations
  WHERE integrations.user_id = (SELECT auth.uid())
));

-- Fix sidebar_permissions user policy
DROP POLICY IF EXISTS "Users can view own permissions" ON public.sidebar_permissions;
CREATE POLICY "Users can view own permissions" ON public.sidebar_permissions
FOR SELECT USING (user_id = (SELECT auth.uid()));

-- =====================================================
-- FAS 3: CONSOLIDATE MULTIPLE PERMISSIVE POLICIES (5 fixes)
-- =====================================================

-- Kombinera calendar_events policies
DROP POLICY IF EXISTS "Admins can view all calendar_events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can view own events" ON public.calendar_events;
CREATE POLICY "View calendar events" ON public.calendar_events
FOR SELECT USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.is_admin(auth.uid()))
);

-- Kombinera calls policies
DROP POLICY IF EXISTS "Admins can view all calls" ON public.calls;
DROP POLICY IF EXISTS "Users can view own calls" ON public.calls;
CREATE POLICY "View calls" ON public.calls
FOR SELECT USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.is_admin(auth.uid()))
);

-- Kombinera phone_numbers policies
DROP POLICY IF EXISTS "Admins can view all phone numbers" ON public.phone_numbers;
DROP POLICY IF EXISTS "Users can view own phone numbers" ON public.phone_numbers;
CREATE POLICY "View phone numbers" ON public.phone_numbers
FOR SELECT USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.is_admin(auth.uid()))
);

-- Kombinera sidebar_permissions policies
DROP POLICY IF EXISTS "Admins can view all permissions" ON public.sidebar_permissions;
DROP POLICY IF EXISTS "Users can view own permissions" ON public.sidebar_permissions;
CREATE POLICY "View permissions" ON public.sidebar_permissions
FOR SELECT USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.is_admin(auth.uid()))
);

-- Kombinera telephony_events policies
DROP POLICY IF EXISTS "Admins can view all telephony_events" ON public.telephony_events;
DROP POLICY IF EXISTS "Users can view own telephony events" ON public.telephony_events;
CREATE POLICY "View telephony events" ON public.telephony_events
FOR SELECT USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.is_admin(auth.uid()))
);