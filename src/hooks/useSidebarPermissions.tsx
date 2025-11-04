import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SidebarRoute {
  route_key: string;
  route_path: string;
  route_title: string;
  route_group: string;
  display_order: number;
}

interface UseSidebarPermissionsReturn {
  allowedRoutes: SidebarRoute[];
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useSidebarPermissions(): UseSidebarPermissionsReturn {
  const { user } = useAuth();
  const [allowedRoutes, setAllowedRoutes] = useState<SidebarRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAllowedRoutes([]);
      setLoading(false);
      return;
    }

    fetchAllowedRoutes();
  }, [user]);

  const fetchAllowedRoutes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_user_allowed_routes', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching allowed routes:', error);
        setAllowedRoutes([]);
      } else {
        setAllowedRoutes(data || []);
      }
    } catch (error) {
      console.error('Error fetching allowed routes:', error);
      setAllowedRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    allowedRoutes,
    loading,
    refetch: fetchAllowedRoutes,
  };
}
