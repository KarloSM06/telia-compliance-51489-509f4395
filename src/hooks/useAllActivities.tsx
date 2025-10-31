import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export type ActivityType = 'telephony' | 'sms' | 'email' | 'booking' | 'review';

export interface Activity {
  id: string;
  type: ActivityType;
  sourceTable: 'telephony_events' | 'message_logs' | 'calendar_events' | 'reviews';
  typeLabel: string;
  title: string;
  description: string;
  timestamp: string;
  metadata: any;
}

export const useAllActivities = (limit: number = 30) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['all-activities', user?.id, limit],
    queryFn: async () => {
      if (!user?.id) return [];

      // 1. Fetch telephony events (parent events only)
      const { data: integrations } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      const integrationIds = integrations?.map(i => i.id) || [];
      
      const { data: telephony } = await supabase
        .from('telephony_events')
        .select('*')
        .in('integration_id', integrationIds)
        .is('parent_event_id', null)
        .order('event_timestamp', { ascending: false })
        .limit(20);
      
      // 2. Fetch messages
      const { data: messages } = await supabase
        .from('message_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      // 3. Fetch bookings
      const { data: bookings } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      // 4. Fetch reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      // Merge and format
      const activities: Activity[] = [
        ...(telephony?.map(t => ({
          id: t.id,
          type: (t.event_type.includes('call') ? 'telephony' : 'sms') as ActivityType,
          sourceTable: 'telephony_events' as const,
          typeLabel: t.event_type.includes('call') ? 'Samtal' : 'SMS',
          title: `${t.direction === 'inbound' ? 'Inkommande' : 'Utgående'} ${t.event_type.includes('call') ? 'samtal' : 'SMS'}`,
          description: `${t.from_number || 'Okänd'} → ${t.to_number || 'Okänd'}${t.duration_seconds ? ` (${Math.floor(t.duration_seconds / 60)}m ${t.duration_seconds % 60}s)` : ''}`,
          timestamp: t.event_timestamp,
          metadata: t
        })) || []),
        
        ...(messages?.map(m => ({
          id: m.id,
          type: (m.channel === 'sms' ? 'sms' : 'email') as ActivityType,
          sourceTable: 'message_logs' as const,
          typeLabel: m.channel === 'sms' ? 'SMS' : 'Email',
          title: `${m.direction === 'outbound' ? 'Skickat' : 'Mottaget'} ${m.channel === 'sms' ? 'SMS' : 'email'}`,
          description: m.message_body?.slice(0, 80) + (m.message_body && m.message_body.length > 80 ? '...' : '') || 'Inget innehåll',
          timestamp: m.created_at,
          metadata: m
        })) || []),
        
        ...(bookings?.map(b => ({
          id: b.id,
          type: 'booking' as const,
          sourceTable: 'calendar_events' as const,
          typeLabel: 'Bokning',
          title: b.title || 'Ny bokning',
          description: `${b.contact_person || 'Okänd kund'} - ${format(new Date(b.start_time), 'HH:mm dd MMM')}`,
          timestamp: b.created_at,
          metadata: b
        })) || []),
        
        ...(reviews?.map(r => ({
          id: r.id,
          type: 'review' as const,
          sourceTable: 'reviews' as const,
          typeLabel: 'Recension',
          title: `${r.rating ? `${r.rating}/5 - ` : ''}${r.sentiment_score > 0 ? 'Positiv' : r.sentiment_score < 0 ? 'Negativ' : 'Neutral'}`,
          description: r.comment?.slice(0, 80) + (r.comment && r.comment.length > 80 ? '...' : '') || 'Ingen kommentar',
          timestamp: r.created_at,
          metadata: r
        })) || [])
      ];
      
      // Sort by timestamp (newest first)
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return activities.slice(0, limit);
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
