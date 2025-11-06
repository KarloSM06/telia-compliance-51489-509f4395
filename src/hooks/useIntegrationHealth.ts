import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useIntegrationHealth = (integrationId?: string) => {
  return useQuery({
    queryKey: ['integration-health', integrationId],
    queryFn: async () => {
      const query = supabase
        .from('integrations')
        .select('id, health_status, last_health_check, last_error_message, total_api_calls, failed_api_calls');

      if (integrationId) {
        query.eq('id', integrationId).single();
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: true,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes (reduced from 30s)
  });
};
