import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Star, Brain, Tag, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews, ReviewFilterValues } from '@/hooks/useReviews';
import { useReviewChartData } from '@/hooks/useReviewChartData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { ReviewsActivityChart } from '@/components/reviews/charts/ReviewsActivityChart';
import { SentimentTrendChart } from '@/components/reviews/charts/SentimentTrendChart';
import { RatingDistributionChart } from '@/components/reviews/charts/RatingDistributionChart';
import { TopicsDistributionChart } from '@/components/reviews/charts/TopicsDistributionChart';
import { RatingVsSentimentChart } from '@/components/reviews/charts/RatingVsSentimentChart';
import { ResponseTimeTrendChart } from '@/components/reviews/charts/ResponseTimeTrendChart';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewsTable } from '@/components/reviews/ReviewsTable';
import { ReviewDetailDrawer } from '@/components/reviews/ReviewDetailDrawer';

export default function ReviewDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });

  const { reviews, allReviews, stats, isLoading, exportToCSV } = useReviews(undefined, filters);
  const chartData = useReviewChartData(reviews);

  const aiInsights = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const allTopics: string[] = [];
    reviews.forEach(r => {
      if (r.topics && Array.isArray(r.topics)) {
        r.topics.forEach((t: any) => {
          const topicStr = typeof t === 'string' ? t : (t?.topic || 'other');
          allTopics.push(topicStr);
        });
      }
    });
    const topicCounts = allTopics.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {} as Record<string, number>);
    const topTopics = Object.entries(topicCounts).map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count);
    const reviewsWithSentiment = reviews.filter(r => r.sentiment_score !== null && r.sentiment_score !== undefined);
    const avgSentiment = reviewsWithSentiment.length > 0 
      ? reviewsWithSentiment.reduce((s, r) => s + (r.sentiment_score || 0), 0) / reviewsWithSentiment.length 
      : 0;
    return { topTopics, avgSentiment, topTopic: topTopics[0] || { topic: '-', count: 0 } };
  }, [reviews]);

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
          queryClient.invalidateQueries({ queryKey: ['review-insights'] });
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
            queryClient.invalidateQueries({ queryKey: ['review-insights'] });
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
            queryClient.invalidateQueries({ queryKey: ['review-insights'] });
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header Section */}
      <section className="p-6 border-b bg-background">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Recensioner</h1>
            <p className="text-muted-foreground">AI-driven analys av kundrecensioner och feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Live
            </Badge>
            <Badge variant="outline">{reviews.length} recensioner</Badge>
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
      </section>

      {/* AI Stats Cards */}
      <section className="p-6 bg-gradient-to-b from-muted/20 to-background">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PremiumTelephonyStatCard 
            title="Totalt" 
            value={stats.totalReviews} 
            icon={Star} 
            color="text-amber-600" 
            subtitle="Alla källor" 
          />
          <PremiumTelephonyStatCard 
            title="AI Sentiment" 
            value={aiInsights ? `${(aiInsights.avgSentiment * 100).toFixed(0)}%` : '0%'} 
            icon={Brain} 
            color="text-purple-600" 
            subtitle="Positivitet" 
          />
          <PremiumTelephonyStatCard 
            title="Top Topic" 
            value={aiInsights?.topTopic.topic || '-'} 
            icon={Tag} 
            color="text-blue-600" 
            subtitle={`${aiInsights?.topTopic.count || 0} nämn`} 
          />
          <PremiumTelephonyStatCard 
            title="Kommentarer" 
            value={reviews.filter(r => r.comment).length} 
            icon={ThumbsUp} 
            color="text-green-600" 
            subtitle="Med text" 
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="p-6">
        <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <h2 className="text-xl font-bold">Statistik & Analys</h2>
            <div className="flex gap-2">
              <Button variant={dateRangeDays === 7 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(7)}>7 dagar</Button>
              <Button variant={dateRangeDays === 30 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(30)}>30 dagar</Button>
              <Button variant={dateRangeDays === 90 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(90)}>90 dagar</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReviewsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
            <SentimentTrendChart data={chartData.sentimentTrend} isLoading={isLoading} />
            <RatingDistributionChart data={chartData.ratingDistribution} isLoading={isLoading} />
            <TopicsDistributionChart data={chartData.topicsDistribution} isLoading={isLoading} />
            <RatingVsSentimentChart data={chartData.ratingVsSentiment} isLoading={isLoading} />
            <ResponseTimeTrendChart data={chartData.responseTimeTrend} isLoading={isLoading} />
          </div>
        </Card>
      </section>

      {/* Reviews Table Section */}
      <section className="p-6">
        <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Alla recensioner</h2>
            <ReviewFilters onFilterChange={setFilters} />
          </div>
          <ReviewsTable reviews={reviews} onViewDetails={setSelectedReview} />
        </Card>
      </section>

      {/* Review Detail Drawer */}
      <ReviewDetailDrawer
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}