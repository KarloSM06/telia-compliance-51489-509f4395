import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfMonth, endOfMonth } from 'date-fns';
import { useMemo } from 'react';

interface Review {
  id: string;
  user_id: string;
  calendar_event_id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number | null;
  comment: string | null;
  review_link: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  sentiment_score?: number | null;
  topics?: string[] | null;
  source?: string;
  ai_analysis?: any;
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

export const useReviews = (dateRange?: { from: Date; to: Date }, filters?: ReviewFilterValues) => {
  const { user } = useAuth();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', user?.id, dateRange],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dateRange) {
        query = query
          .gte('created_at', dateRange.from.toISOString())
          .lte('created_at', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Review[];
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
        const source = review.source || 'manual';
        if (source !== filters.source) return false;
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
