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
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
