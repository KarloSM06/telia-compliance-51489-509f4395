-- Fix critical security issues

-- 1. Create user roles infrastructure if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'client');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read user_roles (needed for has_role checks)
DROP POLICY IF EXISTS "Users can read user roles" ON public.user_roles;
CREATE POLICY "Users can read user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- Create/update security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update existing is_admin function to use app_role enum
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.user_id = $1
      AND user_roles.role = 'admin'::app_role
  )
$$;

-- 2. Fix ai_consultations table - Remove overly permissive policies
DROP POLICY IF EXISTS "Users can view their consultations" ON public.ai_consultations;
DROP POLICY IF EXISTS "Anyone can view consultations" ON public.ai_consultations;
DROP POLICY IF EXISTS "Authenticated users can view consultations" ON public.ai_consultations;
DROP POLICY IF EXISTS "Users and admins can view consultations" ON public.ai_consultations;

-- Only admins can view consultation requests (sensitive business data)
CREATE POLICY "Admins can view all consultations"
ON public.ai_consultations
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Keep public insert for consultation form submissions
DROP POLICY IF EXISTS "Anyone can create consultations" ON public.ai_consultations;
DROP POLICY IF EXISTS "Anyone can submit consultations" ON public.ai_consultations;
CREATE POLICY "Anyone can submit consultation requests"
ON public.ai_consultations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3. Fix v_user_costs view - Recreate with security_invoker
DROP VIEW IF EXISTS public.v_user_costs CASCADE;

CREATE VIEW public.v_user_costs
WITH (security_invoker = true)
AS
SELECT 
  user_id,
  SUM(cost_sek) as total_cost_sek,
  SUM(cost_usd) as total_cost_usd,
  COUNT(*) as usage_count,
  DATE_TRUNC('day', created_at) as date
FROM public.ai_usage_logs
GROUP BY user_id, DATE_TRUNC('day', created_at)

UNION ALL

SELECT 
  i.user_id,
  SUM(te.cost_amount) as total_cost_sek,
  SUM(te.cost_amount) / 10.0 as total_cost_usd,
  COUNT(*) as usage_count,
  DATE_TRUNC('day', te.event_timestamp) as date
FROM public.telephony_events te
JOIN public.integrations i ON te.integration_id = i.id
WHERE te.cost_amount IS NOT NULL
GROUP BY i.user_id, DATE_TRUNC('day', te.event_timestamp);

-- Grant necessary permissions
GRANT SELECT ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT SELECT ON public.v_user_costs TO authenticated;