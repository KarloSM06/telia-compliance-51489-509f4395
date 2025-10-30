import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews, ReviewFilterValues } from '@/hooks/useReviews';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { ReviewStatsCards } from '@/components/reviews/ReviewStatsCards';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewsTable } from '@/components/reviews/ReviewsTable';
import { ReviewDetailDrawer } from '@/components/reviews/ReviewDetailDrawer';
import { ReviewInsightsSection } from '@/components/reviews/ReviewInsightsSection';

export default function ReviewDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });

  const { reviews, allReviews, stats, isLoading, exportToCSV } = useReviews(undefined, filters);

  // Realtime subscriptions för alla review-källor
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to reviews table
    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reviews',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['unified-reviews'] });
          toast.success('Ny recension från kalender mottagen');
        }
      )
      .subscribe();

    // Subscribe to message_logs for review classifications
    const messagesChannel = supabase
      .channel('message-reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_logs',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          if (newMsg?.ai_classification?.type === 'review' || newMsg?.message_type === 'review') {
            queryClient.invalidateQueries({ queryKey: ['unified-reviews'] });
            const source = newMsg.channel === 'sms' ? 'SMS' : 'Email';
            toast.success(`Ny recension från ${source} mottagen`);
          }
        }
      )
      .subscribe();

    // Subscribe to telephony_events for sentiment analysis
    const telephonyChannel = supabase
      .channel('telephony-reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'telephony_events',
        },
        (payload) => {
          const newEvent = payload.new as any;
          // Check if it has sentiment (indicates review-worthy content)
          if (newEvent?.normalized?.sentiment) {
            queryClient.invalidateQueries({ queryKey: ['unified-reviews'] });
            toast.success('Ny recension från samtal mottagen');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(telephonyChannel);
    };
  }, [user?.id, queryClient]);

  const handleRefresh = () => {
    toast.success('Data uppdaterad');
    window.location.reload();
  };

  const handleExport = () => {
    exportToCSV(`reviews-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Export klar');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recensioner</h1>
          <p className="text-muted-foreground">
            AI-driven analys av kundrecensioner och feedback
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ReviewStatsCards stats={stats} insights={undefined} />

      {/* Filters */}
      <ReviewFilters onFilterChange={setFilters} />

      {/* AI Insights Section */}
      <ReviewInsightsSection />

      {/* Reviews Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recensioner</h2>
          <p className="text-sm text-muted-foreground">
            Visar {reviews.length} av {allReviews.length} recensioner
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ReviewsTable reviews={reviews} onViewDetails={setSelectedReview} />
        )}
      </div>

      {/* Review Detail Drawer */}
      <ReviewDetailDrawer
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}