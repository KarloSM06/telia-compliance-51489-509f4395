import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useMemo } from 'react';

interface Review {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone?: string | null;
  rating: number | null;
  comment: string | null;
  sentiment_score?: number | null;
  topics?: string[] | null;
  source: 'calendar' | 'sms' | 'email' | 'telephony' | 'manual';
  submitted_at: string | null;
  created_at: string;
  ai_analysis?: any;
  metadata?: any;
}

export interface ReviewFilterValues {
  search: string;
  rating: string;
  sentiment: string;
  source: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

// Helper functions to normalize data from different sources
const normalizeDbReview = (review: any): Review => ({
  id: review.id,
  user_id: review.user_id,
  customer_name: review.customer_name,
  customer_email: review.customer_email,
  customer_phone: null,
  rating: review.rating,
  comment: review.comment || '',
  sentiment_score: review.sentiment_score,
  topics: review.topics,
  source: 'calendar',
  submitted_at: review.submitted_at,
  created_at: review.created_at,
  ai_analysis: review.ai_analysis,
});

const normalizeMessageReview = (msg: any): Review => {
  const sentiment = msg.ai_classification?.sentiment;
  const rating = sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 3 : sentiment === 'negative' ? 2 : null;
  const sentimentScore = sentiment === 'positive' ? 0.8 : sentiment === 'neutral' ? 0 : sentiment === 'negative' ? -0.8 : null;
  
  return {
    id: msg.id,
    user_id: msg.user_id,
    customer_name: msg.metadata?.from_name || msg.recipient.substring(0, 30) || 'Okänd',
    customer_email: msg.channel === 'email' ? msg.recipient : null,
    customer_phone: msg.channel === 'sms' ? msg.recipient : null,
    rating,
    comment: msg.message_body,
    sentiment_score: sentimentScore,
    topics: msg.ai_classification?.keywords || [],
    source: msg.channel as 'sms' | 'email',
    submitted_at: msg.sent_at,
    created_at: msg.created_at,
    ai_analysis: msg.ai_classification,
    metadata: msg.metadata,
  };
};

const normalizeTelephonyReview = (event: any): Review => {
  const sentiment = event.normalized?.sentiment;
  const rating = sentiment === 'positive' ? 5 : sentiment === 'neutral' ? 3 : sentiment === 'negative' ? 2 : null;
  
  return {
    id: event.id,
    user_id: event.user_id,
    customer_name: event.normalized?.customer_name || event.metadata?.caller_name || 'Okänd kund',
    customer_email: event.metadata?.caller_email || null,
    customer_phone: event.normalized?.from || event.from_number || null,
    rating,
    comment: event.normalized?.transcript || event.metadata?.transcript || event.metadata?.summary || 'Inget transkript tillgängligt',
    sentiment_score: event.normalized?.sentiment_score || null,
    topics: event.normalized?.topics || [],
    source: 'telephony',
    submitted_at: event.event_timestamp || event.created_at,
    created_at: event.created_at,
    ai_analysis: event.normalized,
    metadata: event.metadata,
  };
};

export const useReviews = (dateRange?: { from: Date; to: Date }, filters?: ReviewFilterValues) => {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['unified-reviews', user?.id, dateRange],
    queryFn: async () => {
      if (!user) return [];

      const dateFilter = dateRange ? {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      } : null;

      // 1. Fetch from reviews table
      const reviewsQuery = supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id);
      
      if (dateFilter) {
        reviewsQuery
          .gte('created_at', dateFilter.from)
          .lte('created_at', dateFilter.to);
      }

      // 2. Fetch from message_logs (SMS/Email reviews)
      const messagesQuery = supabase
        .from('message_logs')
        .select('*')
        .eq('user_id', user.id)
        .or('ai_classification->>type.eq.review,message_type.eq.review');
      
      if (dateFilter) {
        messagesQuery
          .gte('created_at', dateFilter.from)
          .lte('created_at', dateFilter.to);
      }

      // 3. Fetch from telephony_events (calls with sentiment)
      const telephonyQuery = supabase
        .from('telephony_events')
        .select('*, integrations!inner(user_id)')
        .eq('integrations.user_id', user.id)
        .in('event_type', ['call.end', 'call.ended', 'analysis_complete'])
        .not('normalized->sentiment', 'is', null);
      
      if (dateFilter) {
        telephonyQuery
          .gte('created_at', dateFilter.from)
          .lte('created_at', dateFilter.to);
      }

      // Execute all queries in parallel
      const [
        { data: dbReviews, error: reviewsError },
        { data: messageReviews, error: messagesError },
        { data: telephonyReviews, error: telephonyError },
      ] = await Promise.all([
        reviewsQuery,
        messagesQuery,
        telephonyQuery,
      ]);

      if (reviewsError) console.error('Reviews fetch error:', reviewsError);
      if (messagesError) console.error('Messages fetch error:', messagesError);
      if (telephonyError) console.error('Telephony fetch error:', telephonyError);

      // Normalize all data to unified format
      const normalized: Review[] = [
        ...(dbReviews || []).map(normalizeDbReview),
        ...(messageReviews || []).map(normalizeMessageReview),
        ...(telephonyReviews || []).map(normalizeTelephonyReview),
      ];

      // Sort by date (newest first)
      return normalized.sort((a, b) => 
        new Date(b.submitted_at || b.created_at).getTime() - 
        new Date(a.submitted_at || a.created_at).getTime()
      );
    },
    enabled: !!user,
  });

  // Filter reviews based on filters
  const filteredReviews = useMemo(() => {
    if (!filters) return reviews;

    return reviews.filter(review => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          review.customer_name?.toLowerCase().includes(searchLower) ||
          review.customer_email?.toLowerCase().includes(searchLower) ||
          review.comment?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Rating filter
      if (filters.rating !== 'all') {
        if (review.rating?.toString() !== filters.rating) return false;
      }
      
      // Sentiment filter (based on sentiment_score)
      if (filters.sentiment !== 'all') {
        const score = review.sentiment_score || 0;
        if (filters.sentiment === 'positive' && score <= 0.3) return false;
        if (filters.sentiment === 'neutral' && (score < -0.3 || score > 0.3)) return false;
        if (filters.sentiment === 'negative' && score >= -0.3) return false;
      }

      // Source filter
      if (filters.source !== 'all') {
        if (filters.source === 'manual') {
          // Manual includes both 'manual' and 'calendar' without external source
          if (review.source !== 'calendar' && review.source !== 'manual') return false;
        } else {
          if (review.source !== filters.source) return false;
        }
      }
      
      // Date filters
      if (filters.dateFrom) {
        const reviewDate = new Date(review.submitted_at || review.created_at);
        if (reviewDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const reviewDate = new Date(review.submitted_at || review.created_at);
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (reviewDate > endOfDay) return false;
      }
      
      return true;
    });
  }, [reviews, filters]);

  // Calculate stats (use filteredReviews for stats)
  const stats: ReviewStats = {
    totalReviews: filteredReviews.filter(r => r.rating !== null).length,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const reviewsWithRating = filteredReviews.filter(r => r.rating !== null);
  
  if (reviewsWithRating.length > 0) {
    const totalRating = reviewsWithRating.reduce((sum, r) => sum + (r.rating || 0), 0);
    stats.averageRating = totalRating / reviewsWithRating.length;

    reviewsWithRating.forEach(review => {
      if (review.rating) {
        stats.ratingDistribution[review.rating]++;
      }
    });
  }

  // Export to CSV
  const exportToCSV = (filename: string = 'reviews.csv') => {
    const headers = ['Datum', 'Kund', 'Betyg', 'Sentiment', 'Kommentar', 'E-post', 'Källa'];
    const rows = filteredReviews.map(review => [
      review.submitted_at || review.created_at,
      review.customer_name,
      review.rating?.toString() || 'N/A',
      review.sentiment_score?.toFixed(2) || 'N/A',
      review.comment || '',
      review.customer_email || '',
      review.source || 'manual',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    reviews: filteredReviews,
    allReviews: reviews,
    stats,
    isLoading,
    exportToCSV,
  };
};
