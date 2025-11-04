-- ============================================================
-- PHASE 1: Update Role System and Create Permissions Tables
-- ============================================================

-- 1.1: Update app_role enum - fix default constraint issue
-- First, remove any default constraints
ALTER TABLE public.user_roles ALTER COLUMN role DROP DEFAULT;

-- Create new enum type
CREATE TYPE public.app_role_new AS ENUM ('admin', 'client');

-- Migrate existing data
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role_new 
  USING (
    CASE 
      WHEN role::text = 'user' THEN 'client'::public.app_role_new
      ELSE role::text::public.app_role_new
    END
  );

-- Drop old type and rename new one
DROP TYPE public.app_role;
ALTER TYPE public.app_role_new RENAME TO app_role;

-- 1.2: Create default_sidebar_routes table
CREATE TABLE public.default_sidebar_routes (
  route_key TEXT PRIMARY KEY,
  route_path TEXT NOT NULL,
  route_title TEXT NOT NULL,
  route_group TEXT NOT NULL, -- 'overview', 'business', 'communication', 'system'
  display_order INTEGER NOT NULL,
  enabled_by_default BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3: Populate default routes based on AppSidebar structure
INSERT INTO public.default_sidebar_routes (route_key, route_path, route_title, route_group, display_order, enabled_by_default) VALUES
  -- Overview
  ('dashboard', '/dashboard', 'Dashboard', 'overview', 1, true),
  ('admin_panel', '/dashboard/admin', 'Admin Panel', 'overview', 2, true),
  
  -- Business Tools
  ('lead', '/dashboard/lead', 'Prospektering', 'business', 10, true),
  ('talent', '/dashboard/talent', 'Rekrytering', 'business', 11, true),
  ('calendar', '/dashboard/calendar', 'Kalender', 'business', 12, true),
  ('openrouter', '/dashboard/openrouter', 'OpenRouter', 'business', 13, true),
  
  -- Communication
  ('telephony', '/dashboard/telephony', 'Telefoni & SMS', 'communication', 20, true),
  ('email', '/dashboard/email', 'Email', 'communication', 21, true),
  ('reviews', '/dashboard/reviews', 'Recensioner', 'communication', 22, true),
  ('notifications', '/dashboard/notifications', 'Notifikationer', 'communication', 23, true),
  
  -- System
  ('settings', '/dashboard/settings', 'Inställningar', 'system', 30, true);

-- 1.4: Create sidebar_permissions table
CREATE TABLE public.sidebar_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_key TEXT NOT NULL REFERENCES public.default_sidebar_routes(route_key) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, route_key)
);

-- Create indexes for performance
CREATE INDEX idx_sidebar_permissions_user_id ON public.sidebar_permissions(user_id);
CREATE INDEX idx_sidebar_permissions_route_key ON public.sidebar_permissions(route_key);

-- ============================================================
-- PHASE 2: Database Functions
-- ============================================================

-- 2.1: Function to get user's allowed routes
CREATE OR REPLACE FUNCTION public.get_user_allowed_routes(user_uuid UUID)
RETURNS TABLE(
  route_key TEXT, 
  route_path TEXT, 
  route_title TEXT, 
  route_group TEXT,
  display_order INTEGER
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    dr.route_key,
    dr.route_path,
    dr.route_title,
    dr.route_group,
    dr.display_order
  FROM default_sidebar_routes dr
  LEFT JOIN sidebar_permissions sp ON sp.route_key = dr.route_key 
    AND sp.user_id = user_uuid
  WHERE 
    -- If admin, show all routes
    (SELECT public.is_admin(user_uuid)) = true
    OR 
    -- If client, show only enabled routes (or default if no override)
    (
      COALESCE(sp.enabled, dr.enabled_by_default) = true
      AND dr.route_key != 'admin_panel' -- Clients can never see admin panel
    )
  ORDER BY dr.display_order;
$$;

-- 2.2: Function to initialize default permissions for a user
CREATE OR REPLACE FUNCTION public.init_default_permissions(user_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO sidebar_permissions (user_id, route_key, enabled)
  SELECT user_uuid, route_key, enabled_by_default
  FROM default_sidebar_routes
  WHERE route_key != 'admin_panel' -- Don't auto-grant admin panel
  ON CONFLICT (user_id, route_key) DO NOTHING;
END;
$$;

-- ============================================================
-- PHASE 3: Row-Level Security Policies
-- ============================================================

-- 3.1: RLS for sidebar_permissions
ALTER TABLE public.sidebar_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own permissions"
  ON public.sidebar_permissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all permissions"
  ON public.sidebar_permissions
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert permissions"
  ON public.sidebar_permissions
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update permissions"
  ON public.sidebar_permissions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete permissions"
  ON public.sidebar_permissions
  FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3.2: RLS for default_sidebar_routes (read-only for authenticated users)
ALTER TABLE public.default_sidebar_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view default routes"
  ON public.default_sidebar_routes
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- PHASE 4: Update Triggers
-- ============================================================

-- 4.1: Update handle_new_user to set default role as 'client'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW());
  
  -- Insert into Hiems_Kunddata table (only if not already exists)
  INSERT INTO public."Hiems_Kunddata" (
    user_id,
    email,
    username,
    created_at,
    status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NOW(),
    'ny'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Insert default role as 'client' (admins must be manually promoted)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Initialize default sidebar permissions
  PERFORM public.init_default_permissions(NEW.id);
  
  RETURN NEW;
END;
$$;

-- 4.2: Create trigger to auto-update updated_at on sidebar_permissions
CREATE OR REPLACE FUNCTION public.update_sidebar_permissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_sidebar_permissions_updated_at
  BEFORE UPDATE ON public.sidebar_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sidebar_permissions_updated_at();

-- ============================================================
-- PHASE 5: Ensure karlo.mangione@hiems.se has admin role
-- ============================================================

-- Get user_id for karlo.mangione@hiems.se and ensure admin role
DO $$
DECLARE
  karlo_user_id UUID;
BEGIN
  SELECT id INTO karlo_user_id
  FROM auth.users
  WHERE email = 'karlo.mangione@hiems.se';
  
  IF karlo_user_id IS NOT NULL THEN
    -- Ensure admin role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (karlo_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Remove client role if exists
    DELETE FROM public.user_roles
    WHERE user_id = karlo_user_id AND role = 'client';
  END IF;
END $$;

-- ============================================================
-- PHASE 6: Initialize permissions for existing users
-- ============================================================

-- Initialize permissions for all existing users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    PERFORM public.init_default_permissions(user_record.id);
  END LOOP;
END $$;