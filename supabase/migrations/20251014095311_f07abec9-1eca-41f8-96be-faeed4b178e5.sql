-- Fix infinite recursion in team_members and dashboard RLS policies
-- This migration creates SECURITY DEFINER functions to break circular dependencies

-- 1. Helper function to get user's organization ID without recursion
CREATE OR REPLACE FUNCTION public.user_organization_id(user_uuid UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.team_members
  WHERE user_id = user_uuid
    AND status = 'active'
  LIMIT 1;
$$;

-- 2. Check if user has specific organization role
CREATE OR REPLACE FUNCTION public.has_org_role(user_uuid UUID, required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_members
    WHERE user_id = user_uuid
      AND status = 'active'
      AND role = ANY(required_roles)
  );
$$;

-- 3. Check if user can access a dashboard
CREATE OR REPLACE FUNCTION public.user_can_access_dashboard(dashboard_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.dashboards
    WHERE id = dashboard_uuid
    AND (user_id = user_uuid OR is_public = true)
  ) OR EXISTS (
    SELECT 1 FROM public.dashboard_shares
    WHERE dashboard_id = dashboard_uuid
    AND shared_with_user_id = user_uuid
  );
$$;

-- Drop and recreate team_members policies to fix infinite recursion
DROP POLICY IF EXISTS "Members can view own organization team" ON public.team_members;
DROP POLICY IF EXISTS "Org admins can invite members" ON public.team_members;
DROP POLICY IF EXISTS "Org admins can update members" ON public.team_members;
DROP POLICY IF EXISTS "Org admins can delete members" ON public.team_members;

-- Fixed team_members policies using helper functions
CREATE POLICY "Members can view own organization team"
ON public.team_members FOR SELECT
USING (
  organization_id = public.user_organization_id(auth.uid())
  OR public.is_admin(auth.uid())
);

CREATE POLICY "Org admins can invite members"
ON public.team_members FOR INSERT
WITH CHECK (
  public.has_org_role(auth.uid(), ARRAY['owner', 'admin'])
  AND organization_id = public.user_organization_id(auth.uid())
);

CREATE POLICY "Org admins can update members"
ON public.team_members FOR UPDATE
USING (
  public.has_org_role(auth.uid(), ARRAY['owner', 'admin'])
  AND organization_id = public.user_organization_id(auth.uid())
);

CREATE POLICY "Org admins can delete members"
ON public.team_members FOR DELETE
USING (
  public.has_org_role(auth.uid(), ARRAY['owner', 'admin'])
  AND organization_id = public.user_organization_id(auth.uid())
);

-- Drop and recreate dashboard policies to fix infinite recursion
DROP POLICY IF EXISTS "Users can view own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can view shared dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can insert own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can update own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can delete own dashboards" ON public.dashboards;

CREATE POLICY "Users can view own dashboards"
ON public.dashboards FOR SELECT
USING (
  user_id = auth.uid()
  OR is_public = true
  OR public.user_can_access_dashboard(id, auth.uid())
);

CREATE POLICY "Users can insert own dashboards"
ON public.dashboards FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own dashboards"
ON public.dashboards FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own dashboards"
ON public.dashboards FOR DELETE
USING (user_id = auth.uid());

-- Drop and recreate dashboard_shares policies
DROP POLICY IF EXISTS "Users can view shares of own dashboards" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Users can create shares for own dashboards" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can manage shares" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can insert shares" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can update shares" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can delete shares" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Users can delete shares of own dashboards" ON public.dashboard_shares;

CREATE POLICY "Users can view shares of own dashboards"
ON public.dashboard_shares FOR SELECT
USING (
  shared_with_user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.dashboards 
    WHERE dashboards.id = dashboard_shares.dashboard_id 
    AND dashboards.user_id = auth.uid()
  )
);

CREATE POLICY "Dashboard owners can insert shares"
ON public.dashboard_shares FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.dashboards
    WHERE dashboards.id = dashboard_shares.dashboard_id
    AND dashboards.user_id = auth.uid()
  )
);

CREATE POLICY "Dashboard owners can update shares"
ON public.dashboard_shares FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.dashboards
    WHERE dashboards.id = dashboard_shares.dashboard_id
    AND dashboards.user_id = auth.uid()
  )
);

CREATE POLICY "Dashboard owners can delete shares"
ON public.dashboard_shares FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.dashboards
    WHERE dashboards.id = dashboard_shares.dashboard_id
    AND dashboards.user_id = auth.uid()
  )
);