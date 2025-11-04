-- Create RPC function to fetch all user data for admin panel in one call
CREATE OR REPLACE FUNCTION public.get_admin_user_overview()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  role app_role,
  active_permissions_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id as user_id,
    au.email::TEXT,
    au.created_at,
    au.last_sign_in_at,
    COALESCE(ur.role, 'client'::app_role) as role,
    COUNT(sp.id) FILTER (WHERE sp.enabled = true) as active_permissions_count
  FROM auth.users au
  LEFT JOIN user_roles ur ON ur.user_id = au.id
  LEFT JOIN sidebar_permissions sp ON sp.user_id = au.id
  GROUP BY au.id, au.email, au.created_at, au.last_sign_in_at, ur.role
  ORDER BY au.created_at DESC;
$$;