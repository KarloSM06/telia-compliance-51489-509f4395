-- Optimize RLS policies for better performance - Part 1
-- Wrapping auth.uid() in SELECT prevents unnecessary re-evaluation for each row

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
CREATE POLICY "Users can delete own bookings" 
  ON public.bookings
  FOR DELETE 
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" 
  ON public.bookings
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- REVIEW_ANALYSIS_QUEUE TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Service role can manage all analysis jobs" ON public.review_analysis_queue;
CREATE POLICY "Service role can manage all analysis jobs" 
  ON public.review_analysis_queue
  FOR ALL 
  USING ((SELECT auth.role()) = 'service_role');

DROP POLICY IF EXISTS "Users can view own analysis jobs" ON public.review_analysis_queue;
CREATE POLICY "Users can view own analysis jobs" 
  ON public.review_analysis_queue
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can read own webhook token" ON public.profiles;
CREATE POLICY "Users can read own webhook token" 
  ON public.profiles
  FOR SELECT 
  USING (id = (SELECT auth.uid()));

-- ============================================================================
-- REVIEW_INSIGHTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their own insights" ON public.review_insights;
CREATE POLICY "Users can view their own insights" 
  ON public.review_insights
  FOR SELECT 
  USING (user_id = (SELECT auth.uid()));

-- ============================================================================
-- BUSINESS_METRICS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert their own business metrics" ON public.business_metrics;
CREATE POLICY "Users can insert their own business metrics" 
  ON public.business_metrics
  FOR INSERT 
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own business metrics" ON public.business_metrics;
CREATE POLICY "Users can update their own business metrics" 
  ON public.business_metrics
  FOR UPDATE 
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can view their own business metrics" ON public.business_metrics;
CREATE POLICY "Users can view their own business metrics" 
  ON public.business_metrics
  FOR SELECT 
  USING ((SELECT auth.uid()) = user_id);