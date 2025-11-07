import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useHiemsAdmin } from '@/hooks/useHiemsAdmin';
import { queryKeys } from '@/lib/queryKeys';

export interface AiConsultation {
  id: string;
  created_at: string | null;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  business_description?: string;
  ai_goals?: string[];
  ai_goals_other?: string | null;
  success_definition?: string | null;
  ai_priority?: number | null;
  manual_processes?: string | null;
  existing_ai?: string | null;
  current_systems?: string | null;
  data_types?: string[] | null;
  data_types_other?: string | null;
  historical_data?: string | null;
  data_quality?: number | null;
  gdpr_compliant?: string | null;
  internal_resources?: string[] | null;
  internal_resources_other?: string | null;
  budget?: string | null;
  timeframe?: string | null;
  ai_users?: string[] | null;
  ai_users_other?: string | null;
  training_needed?: string | null;
  regulatory_requirements?: string | null;
  sensitive_data?: string | null;
  ethical_limitations?: string | null;
  long_term_goals?: string | null;
  open_to_experiments?: string | null;
}

export function useAdminConsultations() {
  const { session, loading: authLoading } = useAuth();
  const { isHiemsAdmin, loading: adminLoading } = useHiemsAdmin();

  return useQuery({
    queryKey: queryKeys.admin.consultations(),
    enabled: !!session && !authLoading && isHiemsAdmin && !adminLoading,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as AiConsultation[];
    },
  });
}
