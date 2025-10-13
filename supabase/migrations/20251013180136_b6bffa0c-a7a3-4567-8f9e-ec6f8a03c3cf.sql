-- Create organizations table for customer organizations
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'pro' CHECK (plan_type IN ('pro', 'enterprise')),
  max_members INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.organizations IS 'Customer organizations - separate from Hiems internal admin structure';
COMMENT ON COLUMN public.organizations.owner_id IS 'Organization owner (customer), NOT Hiems admin';

-- Create team_members table for organization roles (NOT Hiems admin roles)
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'active', 'suspended')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  UNIQUE(organization_id, email)
);

COMMENT ON TABLE public.team_members IS 'Organization team members - NOT Hiems system admins. See user_roles table for Hiems admins.';
COMMENT ON COLUMN public.team_members.role IS 'Organization role: owner (full control within org), admin (manage team), editor (use products), viewer (read only). This is NOT the same as Hiems admin role.';

-- Create settings_audit_log to track all settings changes
CREATE TABLE IF NOT EXISTS public.settings_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  is_hiems_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.settings_audit_log IS 'Audit log for all settings changes';
COMMENT ON COLUMN public.settings_audit_log.is_hiems_admin IS 'TRUE if action was performed by Hiems employee admin, FALSE if by organization admin';

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "Users can view own organization"
  ON public.organizations FOR SELECT
  USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT organization_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Users can update own organization"
  ON public.organizations FOR UPDATE
  USING (
    owner_id = auth.uid()
    OR id IN (
      SELECT organization_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Users can insert own organization"
  ON public.organizations FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- RLS Policies for team_members
CREATE POLICY "Members can view own organization team"
  ON public.team_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Org admins can invite members"
  ON public.team_members FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() 
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Org admins can update members"
  ON public.team_members FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() 
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "Org admins can delete members"
  ON public.team_members FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM public.team_members 
      WHERE user_id = auth.uid() 
        AND status = 'active'
        AND role IN ('owner', 'admin')
    )
    OR public.is_admin(auth.uid())
  );

-- RLS Policies for settings_audit_log
CREATE POLICY "Users can view own audit log"
  ON public.settings_audit_log FOR SELECT
  USING (
    user_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

CREATE POLICY "System can insert audit logs"
  ON public.settings_audit_log FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_team_members_org_user ON public.team_members(organization_id, user_id);
CREATE INDEX idx_team_members_status ON public.team_members(status);
CREATE INDEX idx_settings_audit_log_user ON public.settings_audit_log(user_id, created_at DESC);

-- Create trigger for updated_at on organizations
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();