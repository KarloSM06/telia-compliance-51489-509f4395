/**
 * IMPORTANT: This checks if user is a HIEMS EMPLOYEE with system-wide admin rights.
 * This is NOT the same as an Organization Admin.
 * 
 * Hiems Admin = Employee of Hiems with full system access
 * Organization Admin = Customer with admin rights in their own organization
 * 
 * @see user_roles table for Hiems admins
 * @see team_members table for Organization admins
 * @see useOrganizationRole hook for Organization role checks
 */
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useHiemsAdmin() {
  const { user } = useAuth();
  const [isHiemsAdmin, setIsHiemsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsHiemsAdmin(false);
      setLoading(false);
      return;
    }

    checkHiemsAdminStatus();
  }, [user]);

  const checkHiemsAdminStatus = async () => {
    try {
      // Use database function for security
      const { data, error } = await supabase.rpc('is_admin', {
        user_id: user?.id
      });

      if (error) {
        console.error('Error checking Hiems admin status:', error);
        setIsHiemsAdmin(false);
      } else {
        setIsHiemsAdmin(!!data);
      }
    } catch (error) {
      console.error('Error checking Hiems admin status:', error);
      setIsHiemsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  return { isHiemsAdmin, loading };
}
