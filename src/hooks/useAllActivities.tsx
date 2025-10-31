import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Phone, MessageSquare, Calendar, Star, Mail } from 'lucide-react';

export interface Activity {
  id: string;
  type: 'telephony' | 'sms' | 'email' | 'booking' | 'review';
  typeLabel: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
  targetPath: string;
  metadata: any;
  icon: any;
  badge: {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    label: string;
  };
}

export interface ActivityFilters {
  search?: string;
  type?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

const formatTelephonyActivity = (event: any): Activity => ({
  id: event.id,
  type: 'telephony',
  typeLabel: event.event_type.includes('call') ? 'Samtal' : 'SMS',
  title: `${event.direction === 'inbound' ? 'Inkommande' : 'Utgående'} ${event.event_type}`,
  description: `${event.from_number || 'Okänd'} → ${event.to_number || 'Okänd'}`,
  timestamp: event.event_timestamp,
  status: event.status || 'unknown',
  targetPath: '/dashboard/telephony',
  metadata: event,
  icon: Phone,
  badge: {
    variant: event.direction === 'inbound' ? 'default' : 'secondary',
    label: event.direction === 'inbound' ? 'In' : 'Ut'
  }
});

const formatMessageActivity = (message: any): Activity => ({
  id: message.id,
  type: message.channel === 'sms' ? 'sms' : 'email',
  typeLabel: message.channel === 'sms' ? 'SMS' : 'Email',
  title: `${message.direction === 'outbound' ? 'Skickat' : 'Mottaget'} ${message.channel}`,
  description: message.message_body?.slice(0, 80) + '...' || 'Inget innehåll',
  timestamp: message.created_at,
  status: message.status || 'unknown',
  targetPath: message.channel === 'sms' ? '/dashboard/sms' : '/dashboard/email',
  metadata: message,
  icon: message.channel === 'sms' ? MessageSquare : Mail,
  badge: {
    variant: message.direction === 'outbound' ? 'default' : 'secondary',
    label: message.direction === 'outbound' ? 'Skickat' : 'Mottaget'
  }
});

const formatBookingActivity = (booking: any): Activity => ({
  id: booking.id,
  type: 'booking',
  typeLabel: 'Bokning',
  title: booking.title || 'Ny bokning',
  description: `${booking.contact_person || 'Okänd kund'} - ${new Date(booking.start_time).toLocaleString('sv-SE', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`,
  timestamp: booking.created_at,
  status: 'confirmed',
  targetPath: '/dashboard/calendar',
  metadata: booking,
  icon: Calendar,
  badge: {
    variant: 'default',
    label: 'Bekräftad'
  }
});

const formatReviewActivity = (review: any): Activity => ({
  id: review.id,
  type: 'review',
  typeLabel: 'Recension',
  title: `${review.rating}/5 stjärnor`,
  description: review.comment?.slice(0, 80) + '...' || 'Ingen kommentar',
  timestamp: review.created_at,
  status: review.sentiment_score > 0 ? 'positive' : review.sentiment_score < 0 ? 'negative' : 'neutral',
  targetPath: '/dashboard/reviews',
  metadata: review,
  icon: Star,
  badge: {
    variant: review.sentiment_score > 0 ? 'default' : review.sentiment_score < 0 ? 'destructive' : 'outline',
    label: review.sentiment_score > 0 ? 'Positiv' : review.sentiment_score < 0 ? 'Negativ' : 'Neutral'
  }
});

export const useAllActivities = (filters?: ActivityFilters) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['all-activities', user?.id, filters],
    queryFn: async () => {
      if (!user) return [];

      // 1. Hämta telephony integrations
      const { data: integrations } = await supabase
        .from('integrations')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      const integrationIds = integrations?.map(i => i.id) || [];
      
      // 2. Parallell fetch av all data
      const [telephony, messages, bookings, reviews] = await Promise.all([
        supabase
          .from('telephony_events')
          .select('*')
          .in('integration_id', integrationIds)
          .is('parent_event_id', null)
          .order('event_timestamp', { ascending: false })
          .limit(50),
        
        supabase
          .from('message_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        
        supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        
        supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);
      
      // 3. Merge och formatera till unified Activity[]
      const activities: Activity[] = [
        ...(telephony.data?.map(formatTelephonyActivity) || []),
        ...(messages.data?.map(formatMessageActivity) || []),
        ...(bookings.data?.map(formatBookingActivity) || []),
        ...(reviews.data?.map(formatReviewActivity) || [])
      ];
      
      // 4. Sortera efter timestamp
      activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return activities.slice(0, 100); // Top 100
    },
    enabled: !!user,
    staleTime: 30_000, // 30s cache
  });
};
