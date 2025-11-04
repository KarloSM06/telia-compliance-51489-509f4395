import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'client';

interface UseUserRoleReturn {
  role: UserRole | null;
  isAdmin: boolean;
  isClient: boolean;
  loading: boolean;
}

export function useUserRole(): UseUserRoleReturn {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    checkUserRole();
  }, [user]);

  const checkUserRole = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user?.id
      });

      if (error) {
        console.error('Error checking user role:', error);
        // Default to client if error
        setRole('client');
      } else {
        setRole(data ? 'admin' : 'client');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setRole('client');
    } finally {
      setLoading(false);
    }
  };

  return {
    role,
    isAdmin: role === 'admin',
    isClient: role === 'client',
    loading,
  };
}
