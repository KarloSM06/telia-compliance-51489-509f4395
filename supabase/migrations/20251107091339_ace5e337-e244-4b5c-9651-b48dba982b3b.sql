-- Add Admin Requests route to default sidebar routes
INSERT INTO default_sidebar_routes (
  route_key,
  route_path,
  route_title,
  route_group,
  display_order,
  enabled_by_default
) VALUES (
  'admin_requests',
  '/dashboard/admin/requests',
  'Förfrågningar',
  'system',
  101,
  true
) ON CONFLICT (route_key) DO NOTHING;