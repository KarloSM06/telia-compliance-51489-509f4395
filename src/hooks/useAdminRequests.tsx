import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RequestData {
  id: string;
  type: 'booking' | 'ai_consultation';
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  status: string;
  source?: string; // Added to track form origin
  created_at: string;
  updated_at?: string;
  raw_data: any;
}

export function useAdminRequests(filters?: {
  search?: string;
  type?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const { session, loading: authLoading } = useAuth();

  return useQuery({
    queryKey: ['admin-requests', filters],
    enabled: !!session && !authLoading,
    queryFn: async () => {
      // Fetch AI consultations only
      const { data: consultations, error: consultationsError } = await supabase
        .from('ai_consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (consultationsError) {
        console.error('Error fetching consultations:', consultationsError);
        console.error('Detta kan bero på RLS-policies. Kontrollera att ditt konto har admin-behörighet.');
        return [];
      }

      if (!consultations) {
        return [];
      }

      const requests: RequestData[] = consultations.map((c) => ({
        id: c.id,
        type: 'ai_consultation' as const,
        name: c.contact_person || 'N/A',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        company: c.company_name || undefined,
        message: c.business_description || undefined,
        status: 'pending',
        source: 'ai_consultation',
        created_at: c.created_at || new Date().toISOString(),
        raw_data: c,
      }))

      // Apply filters
      let filteredRequests = requests;

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRequests = filteredRequests.filter(
          (r) =>
            r.name.toLowerCase().includes(searchLower) ||
            r.email.toLowerCase().includes(searchLower) ||
            r.phone.toLowerCase().includes(searchLower) ||
            (r.company && r.company.toLowerCase().includes(searchLower))
        );
      }

      if (filters?.type && filters.type !== 'all') {
        filteredRequests = filteredRequests.filter((r) => r.type === filters.type);
      }

      if (filters?.status && filters.status !== 'all') {
        filteredRequests = filteredRequests.filter((r) => r.status === filters.status);
      }

      if (filters?.dateFrom) {
        filteredRequests = filteredRequests.filter(
          (r) => new Date(r.created_at) >= new Date(filters.dateFrom!)
        );
      }

      if (filters?.dateTo) {
        filteredRequests = filteredRequests.filter(
          (r) => new Date(r.created_at) <= new Date(filters.dateTo!)
        );
      }

      // Sort by date
      filteredRequests.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return filteredRequests;
    },
  });
}

export async function updateRequestStatus(
  requestId: string,
  type: 'booking' | 'ai_consultation',
  status: string
) {
  if (type === 'booking') {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', requestId);

    if (error) throw error;
  }
  // ai_consultations doesn't have a status field, so we'd need to add it or handle differently
}
