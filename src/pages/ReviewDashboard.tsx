import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews, ReviewFilterValues } from '@/hooks/useReviews';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { ReviewStatsCards } from '@/components/reviews/ReviewStatsCards';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewCardList } from '@/components/reviews/ReviewCardList';
import { ReviewDetailDrawer } from '@/components/reviews/ReviewDetailDrawer';
import { ReviewInsightsSection } from '@/components/reviews/ReviewInsightsSection';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';
import { useReviewChartData } from '@/hooks/useReviewChartData';
import { ReviewsActivityChart } from '@/components/reviews/charts/ReviewsActivityChart';
import { SentimentTrendChart } from '@/components/reviews/charts/SentimentTrendChart';
import { RatingDistributionChart } from '@/components/reviews/charts/RatingDistributionChart';
import { TopicsDistributionChart } from '@/components/reviews/charts/TopicsDistributionChart';
import { RatingVsSentimentChart } from '@/components/reviews/charts/RatingVsSentimentChart';
import { ResponseTimeTrendChart } from '@/components/reviews/charts/ResponseTimeTrendChart';

export default function ReviewDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });

  const { reviews, allReviews, stats, isLoading, exportToCSV } = useReviews(undefined, filters);
  const chartData = useReviewChartData(allReviews);

  // Calculate AI insights from all reviews
  const aiInsights = useMemo(() => {
    const allTopics: string[] = [];
    const topicsSentiment: Record<string, { sum: number; count: number }> = {};
    
    allReviews.forEach(r => {
      if (r.topics && Array.isArray(r.topics)) {
        r.topics.forEach((t: any) => {
          const topic = typeof t === 'string' ? t : t.topic || 'other';
          allTopics.push(topic);
          
          if (r.sentiment_score !== undefined && r.sentiment_score !== null) {
            if (!topicsSentiment[topic]) {
              topicsSentiment[topic] = { sum: 0, count: 0 };
            }
            topicsSentiment[topic].sum += r.sentiment_score;
            topicsSentiment[topic].count += 1;
          }
        });
      }
    });
    
    const topicCounts = allTopics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topicAvgSentiment = Object.entries(topicsSentiment).map(([topic, data]) => ({
      topic,
      avgSentiment: data.sum / data.count,
      count: topicCounts[topic] || 0,
    }));
    
    const reviewsWithSentiment = allReviews.filter(r => r.sentiment_score !== undefined && r.sentiment_score !== null);
    const avgSentiment = reviewsWithSentiment.length > 0
      ? reviewsWithSentiment.reduce((sum, r) => sum + (r.sentiment_score || 0), 0) / reviewsWithSentiment.length
      : 0;
    
    const topTopic = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    const positiveTopics = topicAvgSentiment
      .filter(t => t.avgSentiment > 0.3)
      .sort((a, b) => b.count - a.count);
    
    const negativeTopics = topicAvgSentiment
      .filter(t => t.avgSentiment < -0.3)
      .sort((a, b) => b.count - a.count);
    
    return {
      avgSentiment,
      topTopic: topTopic ? { name: topTopic[0], count: topTopic[1] } : null,
      topPositiveTopic: positiveTopics[0] || null,
      topNegativeTopic: negativeTopics[0] || null,
    };
  }, [allReviews]);

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
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="p-6 border-b bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recensioner</h1>
            <p className="text-muted-foreground">
              AI-driven analys av kundrecensioner och feedback
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={dateRangeDays === 7 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(7)}>
              7 dagar
            </Button>
            <Button variant={dateRangeDays === 30 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(30)}>
              30 dagar
            </Button>
            <Button variant={dateRangeDays === 90 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(90)}>
              90 dagar
            </Button>
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
      </div>

      {/* Resizable Split Layout */}
      <ResizablePanelGroup 
        direction={isMobile ? "vertical" : "horizontal"} 
        className="flex-1"
      >
        {/* LEFT PANEL - Review List */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Stats Cards */}
            <ReviewStatsCards stats={stats} insights={aiInsights} />
            
            {/* Charts Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Statistik & Trender
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ReviewsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
                <SentimentTrendChart data={chartData.sentimentTrend} isLoading={isLoading} />
                <RatingDistributionChart data={chartData.ratingDistribution} isLoading={isLoading} />
                <TopicsDistributionChart data={chartData.topicsDistribution} isLoading={isLoading} />
                <RatingVsSentimentChart data={chartData.ratingVsSentiment} isLoading={isLoading} />
                <ResponseTimeTrendChart data={chartData.responseTimeTrend} isLoading={isLoading} />
              </div>
            </div>
            
            {/* Filters */}
            <ReviewFilters onFilterChange={setFilters} />
            
            {/* Review List Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recensioner</h2>
              <p className="text-sm text-muted-foreground">
                Visar {reviews.length} av {allReviews.length}
              </p>
            </div>
            
            {/* Card-based Review List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ReviewCardList 
                reviews={reviews} 
                onViewDetails={setSelectedReview} 
              />
            )}
          </div>
        </ResizablePanel>

        {/* Resize Handle */}
        <ResizableHandle withHandle />

        {/* RIGHT PANEL - AI Insights */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full overflow-y-auto p-6">
            <ReviewInsightsSection />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Review Detail Drawer */}
      <ReviewDetailDrawer
        review={selectedReview}
        open={!!selectedReview}
        onClose={() => setSelectedReview(null)}
      />
    </div>
  );
}