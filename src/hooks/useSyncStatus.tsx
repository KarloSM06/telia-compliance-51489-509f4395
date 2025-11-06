import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SyncStatus {
  id: string;
  integration_id: string;
  user_id: string;
  sync_method: 'webhook' | 'polling' | 'hybrid';
  webhook_enabled: boolean;
  polling_enabled: boolean;
  last_webhook_received_at: string | null;
  webhook_failure_count: number;
  webhook_health_status: 'healthy' | 'degraded' | 'failing' | 'unknown';
  last_poll_at: string | null;
  last_successful_poll_at: string | null;
  polling_failure_count: number;
  polling_health_status: 'healthy' | 'degraded' | 'failing' | 'unknown';
  last_synced_event_id: string | null;
  last_synced_timestamp: string | null;
  overall_health: 'healthy' | 'warning' | 'error' | 'unknown';
  sync_confidence_percentage: number;
  consecutive_error_count: number;
  last_error_message: string | null;
  last_error_at: string | null;
  retry_count: number;
  next_retry_at: string | null;
  backoff_seconds: number;
  total_events_synced: number;
  last_sync_duration_ms: number | null;
  average_sync_duration_ms: number | null;
  created_at: string;
  updated_at: string;
}

export function useSyncStatus(integrationId?: string) {
  return useQuery({
    queryKey: ['sync-status', integrationId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('provider_sync_status')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (integrationId) {
        query = query.eq('integration_id', integrationId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as SyncStatus[];
    },
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    refetchInterval: 2 * 60 * 1000, // Update every 2 minutes (reduced from 10s)
  });
}
