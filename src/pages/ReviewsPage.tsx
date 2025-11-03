import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Star, Settings, Brain, Tag, AlertTriangle, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews, ReviewFilterValues } from '@/hooks/useReviews';
import { useReviewChartData } from '@/hooks/useReviewChartData';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ReviewsActivityChart } from '@/components/reviews/charts/ReviewsActivityChart';
import { SentimentTrendChart } from '@/components/reviews/charts/SentimentTrendChart';
import { RatingDistributionChart } from '@/components/reviews/charts/RatingDistributionChart';
import { TopicsDistributionChart } from '@/components/reviews/charts/TopicsDistributionChart';
import { RatingVsSentimentChart } from '@/components/reviews/charts/RatingVsSentimentChart';
import { ResponseTimeTrendChart } from '@/components/reviews/charts/ResponseTimeTrendChart';
import { ReviewFilters } from '@/components/reviews/ReviewFilters';
import { ReviewsTable } from '@/components/reviews/ReviewsTable';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function ReviewsPage() {
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });
  const [selectedReview, setSelectedReview] = useState<any>(null);

  const { reviews, stats, isLoading, exportToCSV } = useReviews(undefined, filters);
  const chartData = useReviewChartData(reviews);

  const aiInsights = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;
    const allTopics: string[] = [];
    reviews.forEach(r => {
      if (r.topics && Array.isArray(r.topics)) {
        r.topics.forEach(t => allTopics.push(typeof t === 'string' ? t : t.topic || 'other'));
      }
    });
    const topicCounts = allTopics.reduce((acc, t) => ({ ...acc, [t]: (acc[t] || 0) + 1 }), {} as Record<string, number>);
    const topTopics = Object.entries(topicCounts).map(([topic, count]) => ({ topic, count })).sort((a, b) => b.count - a.count);
    const avgSentiment = reviews.filter(r => r.sentiment_score).reduce((s, r) => s + (r.sentiment_score || 0), 0) / reviews.filter(r => r.sentiment_score).length || 0;
    return { topTopics, avgSentiment, topTopic: topTopics[0] || { topic: '-', count: 0 } };
  }, [reviews]);

  const handleExport = () => {
    exportToCSV(`reviews-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Recensioner</h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">Alla dina recensioner analyserade med AI</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-green-500/20 text-green-700"><div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />Live</Badge>
              <Badge variant="outline">{reviews.length} recensioner</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}><RefreshCw className="h-4 w-4 mr-2" />Uppdatera</Button>
              <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
              <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-2" />Inställningar</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard title="Totalt" value={stats.totalReviews} icon={Star} color="text-amber-600" subtitle="Alla källor" />
              <PremiumTelephonyStatCard title="AI Sentiment" value={aiInsights ? `${(aiInsights.avgSentiment * 100).toFixed(0)}%` : '0%'} icon={Brain} color="text-purple-600" subtitle="Positivitet" />
              <PremiumTelephonyStatCard title="Top Topic" value={aiInsights?.topTopic.topic || '-'} icon={Tag} color="text-blue-600" subtitle={`${aiInsights?.topTopic.count || 0} nämn`} />
              <PremiumTelephonyStatCard title="Kommentarer" value={reviews.filter(r => r.comment).length} icon={ThumbsUp} color="text-green-600" subtitle="Med text" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Statistik & Analys</h2>
                <div className="flex gap-2">
                  <Button variant={dateRangeDays === 7 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(7)}>7 dagar</Button>
                  <Button variant={dateRangeDays === 30 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(30)}>30 dagar</Button>
                  <Button variant={dateRangeDays === 90 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(90)}>90 dagar</Button>
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

      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={500}>
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="mb-6">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">Alla recensioner</h2>
                <ReviewFilters onFilterChange={setFilters} />
              </div>
              <ReviewsTable reviews={reviews} onViewDetails={setSelectedReview} />
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
