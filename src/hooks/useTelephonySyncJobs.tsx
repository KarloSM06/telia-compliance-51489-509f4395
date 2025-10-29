import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TelephonySyncJob {
  id: string;
  integration_id: string;
  user_id: string;
  provider: string;
  job_type: 'calls' | 'messages' | 'recordings' | 'transcripts';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rate_limited';
  cursor: string | null;
  last_sync_timestamp: string | null;
  items_synced: number;
  error_message: string | null;
  retry_count: number;
  next_retry_at: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export function useTelephonySyncJobs(integrationId?: string) {
  return useQuery({
    queryKey: ['telephony-sync-jobs', integrationId],
    queryFn: async () => {
      let query = supabase
        .from('telephony_sync_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;
      return data as TelephonySyncJob[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
