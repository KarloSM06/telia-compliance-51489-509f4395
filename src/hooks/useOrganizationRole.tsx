/**
 * IMPORTANT: This hook checks Organization role (owner/admin/editor/viewer).
 * This is NOT the same as Hiems Admin.
 * 
 * Organization roles = Customer team management within their own organization
 * Hiems Admin = Hiems employee with system-wide access
 * 
 * @see team_members table for Organization roles
 * @see user_roles table for Hiems admin roles
 * @see useHiemsAdmin hook for Hiems admin checks
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type OrgRole = 'owner' | 'admin' | 'editor' | 'viewer' | null;

export function useOrganizationRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<OrgRole>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setOrganizationId(null);
      setLoading(false);
      return;
    }

    fetchOrganizationRole();
  }, [user]);

  const fetchOrganizationRole = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('role, organization_id')
        .eq('user_id', user?.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setRole(data.role as OrgRole);
        setOrganizationId(data.organization_id);
      }
    } catch (error) {
      console.error('Error fetching organization role:', error);
    } finally {
      setLoading(false);
    }
  };

  const isOrgOwner = role === 'owner';
  const isOrgAdmin = role === 'owner' || role === 'admin';
  const canManageTeam = role === 'owner' || role === 'admin';
  const canEditProducts = role === 'owner' || role === 'admin' || role === 'editor';

  return { 
    role, 
    organizationId, 
    isOrgOwner, 
    isOrgAdmin, 
    canManageTeam,
    canEditProducts,
    loading 
  };
}
