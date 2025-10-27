import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfMonth, endOfMonth } from 'date-fns';

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
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [key: number]: number };
}

export const useReviews = (dateRange?: { from: Date; to: Date }) => {
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

  // Calculate stats
  const stats: ReviewStats = {
    totalReviews: reviews.filter(r => r.rating !== null).length,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  const reviewsWithRating = reviews.filter(r => r.rating !== null);
  
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
    const headers = ['Datum', 'Kund', 'Betyg', 'Kommentar', 'E-post'];
    const rows = reviews.map(review => [
      review.submitted_at || review.created_at,
      review.customer_name,
      review.rating?.toString() || 'N/A',
      review.comment || '',
      review.customer_email || '',
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
    reviews,
    stats,
    isLoading,
    exportToCSV,
  };
};
