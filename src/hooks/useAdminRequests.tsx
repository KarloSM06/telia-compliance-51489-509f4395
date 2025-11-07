import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RequestData {
  id: string;
  type: 'booking' | 'ai_consultation';
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  status: string;
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
  return useQuery({
    queryKey: ['admin-requests', filters],
    queryFn: async () => {
      const requests: RequestData[] = [];

      // Fetch bookings
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: bookings, error: bookingsError } = await bookingsQuery;

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else if (bookings) {
        requests.push(
          ...bookings.map((b) => ({
            id: b.id,
            type: 'booking' as const,
            name: b.kundnamn || 'N/A',
            email: b.epost || 'N/A',
            phone: b.telefonnummer || 'N/A',
            company: undefined,
            message: b.info || b.extra_info || undefined,
            status: b.status || 'pending',
            created_at: b.created_at || new Date().toISOString(),
            raw_data: b,
          }))
        );
      }

      // Fetch AI consultations
      let consultationsQuery = supabase
        .from('ai_consultations')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: consultations, error: consultationsError } = await consultationsQuery;

      if (consultationsError) {
        console.error('Error fetching consultations:', consultationsError);
      } else if (consultations) {
        requests.push(
          ...consultations.map((c) => ({
            id: c.id,
            type: 'ai_consultation' as const,
            name: c.contact_person || 'N/A',
            email: c.email || 'N/A',
            phone: c.phone || 'N/A',
            company: c.company_name || undefined,
            message: c.business_description || undefined,
            status: 'pending',
            created_at: c.created_at || new Date().toISOString(),
            raw_data: c,
          }))
        );
      }

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
