import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, MessageSquare, Star, Brain, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews, ReviewFilterValues } from '@/hooks/useReviews';
import { useReviewChartData } from '@/hooks/useReviewChartData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { useDateRangeStore } from '@/stores/useDateRangeStore';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewCardList } from '@/components/reviews/ReviewCardList';
import { ReviewDetailDrawer } from '@/components/reviews/ReviewDetailDrawer';
import { ReviewInsightsSection } from '@/components/reviews/ReviewInsightsSection';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ReviewsActivityChart } from '@/components/reviews/charts/ReviewsActivityChart';
import { SentimentTrendChart } from '@/components/reviews/charts/SentimentTrendChart';
import { RatingDistributionChart } from '@/components/reviews/charts/RatingDistributionChart';
import { TopicsDistributionChart } from '@/components/reviews/charts/TopicsDistributionChart';
import { RatingVsSentimentChart } from '@/components/reviews/charts/RatingVsSentimentChart';
import { ResponseTimeTrendChart } from '@/components/reviews/charts/ResponseTimeTrendChart';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function ReviewDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const { dateRange, setPreset } = useDateRangeStore();
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });
  
  // Calculate current preset from global dateRange
  const dateRangeDays = Math.round(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
  );

  const { reviews, allReviews, stats, isLoading, exportToCSV } = useReviews(undefined, filters);
  const chartData = useReviewChartData(allReviews);

  // Calculate AI insights
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
    queryClient.invalidateQueries({ queryKey: ['unified-reviews'] });
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    exportToCSV(`reviews-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_35s_linear_infinite]" />
        </div>
        <div className="absolute top-1/3 left-1/3 w-[180px] h-[180px] opacity-[0.025] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">AI-Analys</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Recensioner
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                AI-driven analys av kundrecensioner och feedback
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline">{reviews.length} av {allReviews.length} recensioner</Badge>
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
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard 
                title="Total Recensioner" 
                value={stats.totalReviews} 
                icon={MessageSquare} 
                color="text-blue-600" 
                subtitle={`${allReviews.length} totalt`} 
              />
              <PremiumTelephonyStatCard 
                title="Genomsnitt Betyg" 
                value={stats.averageRating.toFixed(1)} 
                icon={Star} 
                color="text-yellow-600" 
                subtitle="av 5 stjärnor" 
              />
              <PremiumTelephonyStatCard 
                title="AI Sentiment" 
                value={`${(aiInsights.avgSentiment * 100).toFixed(0)}%`} 
                icon={Brain} 
                color="text-purple-600" 
                subtitle={`Baserat på ${allReviews.filter(r => r.sentiment_score !== undefined).length} analyser`} 
              />
              <PremiumTelephonyStatCard 
                title={aiInsights.topNegativeTopic ? "Förbättringsområde" : "Top Topic"} 
                value={aiInsights.topNegativeTopic?.topic || aiInsights.topTopic?.name || '-'} 
                icon={AlertTriangle} 
                color="text-orange-600" 
                subtitle={aiInsights.topNegativeTopic ? `${aiInsights.topNegativeTopic.count} mentions` : aiInsights.topTopic ? `${aiInsights.topTopic.count} mentions` : ''} 
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Charts Section */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Statistik & Trender
                  </h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full" />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={dateRangeDays === 7 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreset(7)}
                  >
                    7 dagar
                  </Button>
                  <Button 
                    variant={dateRangeDays === 30 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreset(30)}
                  >
                    30 dagar
                  </Button>
                  <Button 
                    variant={dateRangeDays === 90 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreset(90)}
                  >
                    90 dagar
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReviewsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
              <SentimentTrendChart data={chartData.sentimentTrend} isLoading={isLoading} />
              <RatingDistributionChart data={chartData.ratingDistribution} isLoading={isLoading} />
              <TopicsDistributionChart data={chartData.topicsDistribution} isLoading={isLoading} />
              <RatingVsSentimentChart data={chartData.ratingVsSentiment} isLoading={isLoading} />
              <ResponseTimeTrendChart data={chartData.responseTimeTrend} isLoading={isLoading} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="relative py-12 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={400}>
            <ReviewInsightsSection />
          </AnimatedSection>
        </div>
      </section>

      {/* Reviews Table Section */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={500}>
            <Card className="p-6 border border-primary/10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Alla Recensioner</h2>
                  <p className="text-sm text-muted-foreground">
                    Visar {reviews.length} av {allReviews.length}
                  </p>
                </div>
                
                <ReviewFilters onFilterChange={setFilters} />
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ReviewCardList reviews={reviews} onViewDetails={setSelectedReview} />
                )}
              </div>
            </Card>
          </AnimatedSection>
        </div>
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