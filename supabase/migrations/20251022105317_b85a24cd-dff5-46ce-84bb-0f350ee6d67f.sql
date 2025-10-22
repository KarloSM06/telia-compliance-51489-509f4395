-- Fix Multiple Permissive Policies - Performance Optimization
-- Removes 60 redundant RLS policy evaluations across 7 tables

-- ============================================================================
-- 1. Hiems_Kunddata - Remove 3 redundant specific operation policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert own customer data" ON public."Hiems_Kunddata";
DROP POLICY IF EXISTS "Users can view own customer data" ON public."Hiems_Kunddata";
DROP POLICY IF EXISTS "Users can update own customer data" ON public."Hiems_Kunddata";
-- Keep: "Users can only access own Hiems customer data" (handles ALL operations)

-- ============================================================================
-- 2. booking_webhooks - Remove 1 redundant SELECT policy
-- ============================================================================
DROP POLICY IF EXISTS "Users can view own webhooks" ON public.booking_webhooks;
-- Keep: "Users can manage own webhooks" (handles ALL operations including SELECT)

-- ============================================================================
-- 3. call_history - Remove 4 redundant specific operation policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can delete own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can insert own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can view own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can update own call history" ON public.call_history;
-- Keep: "Users can only access own call history" (handles ALL operations)

-- ============================================================================
-- 4. messages - Remove 4 redundant specific operation policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
-- Keep: "Users can only access own messages" (handles ALL operations)

-- ============================================================================
-- 5. phone_numbers - Remove redundant user-specific INSERT policy
-- ============================================================================
DROP POLICY IF EXISTS "Users can insert own phone numbers" ON public.phone_numbers;
-- Keep: "Anyone can insert phone numbers" (more permissive, covers both cases)

-- ============================================================================
-- 6. user_products - Combine admin and user INSERT policies
-- ============================================================================
DROP POLICY IF EXISTS "Admins can insert any products" ON public.user_products;
DROP POLICY IF EXISTS "Users can insert own products" ON public.user_products;

CREATE POLICY "Users and admins can insert products"
ON public.user_products
FOR INSERT
TO authenticated
WITH CHECK (
  (user_id = (SELECT auth.uid())) OR 
  is_admin((SELECT auth.uid()))
);

-- ============================================================================
-- 7. user_roles - Combine admin and user SELECT policies
-- ============================================================================
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

CREATE POLICY "Users can view own roles, admins can view all"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  (user_id = (SELECT auth.uid())) OR 
  is_admin((SELECT auth.uid()))
);