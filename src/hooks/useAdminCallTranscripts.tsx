import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/lib/queryKeys';
import { useUserRole } from './useUserRole';

interface CallRecord {
  id: string;
  user_id: string;
  file_name: string;
  encrypted_transcript: string | null;
  encrypted_analysis: any;
  created_at: string;
  score: number | null;
  sale_outcome: boolean | null;
  duration: string | null;
}

export const useAdminCallTranscripts = (userId?: string, limit: number = 100) => {
  const { isAdmin } = useUserRole();

  return useQuery({
    queryKey: queryKeys.admin.callTranscripts(userId),
    queryFn: async () => {
      // Admin can see all calls due to RLS policy
      let query = supabase
        .from('calls')
        .select('id, user_id, file_name, encrypted_transcript, encrypted_analysis, created_at, score, sale_outcome, duration')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.limit(limit);
      if (error) throw error;
      return data as CallRecord[];
    },
    enabled: isAdmin,
    staleTime: 30000, // 30 seconds
  });
};
