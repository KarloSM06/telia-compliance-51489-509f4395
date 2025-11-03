import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Star, TrendingUp, Heart, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useReviews } from '@/hooks/useReviews';
import { useReviewChartData } from '@/hooks/useReviewChartData';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { ReviewsActivityChart } from '@/components/reviews/charts/ReviewsActivityChart';
import { SentimentTrendChart } from '@/components/reviews/charts/SentimentTrendChart';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function ReviewsPage() {
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const { filteredReviews: reviews, stats, isLoading } = useReviews();
  const chartData = useReviewChartData(reviews);

  const handleExport = () => {
    const csvContent = [
      ['Kund', 'Betyg', 'Sentiment', 'Kommentar', 'Datum'].join(','),
      ...reviews.map(r => [r.customerName || '-', r.rating || '-', r.sentimentScore || '-', `"${r.reviewComment?.replace(/"/g, '""') || '-'}"`, r.submittedAt].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">Alla dina recensioner och kundåsikter</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard title="Totalt Recensioner" value={stats.totalReviews} icon={Star} color="text-amber-600" subtitle="Alla källor" />
              <PremiumTelephonyStatCard title="Genomsnittsbetyg" value={stats.averageRating.toFixed(1)} icon={TrendingUp} color="text-green-600" subtitle="⭐ av 5" />
              <PremiumTelephonyStatCard title="Sentiment Score" value={`${(stats.averageRating/5*100).toFixed(0)}%`} icon={Heart} color="text-pink-600" subtitle="Positivt" />
              <PremiumTelephonyStatCard title="Kommentarer" value={reviews.filter(r => r.reviewComment).length} icon={MessageCircle} color="text-blue-600" subtitle="Med text" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Statistik & Analys</h2>
                <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReviewsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
              <SentimentTrendChart data={chartData.sentimentTrend} isLoading={isLoading} />
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Rating Distribution</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Topics</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Rating vs Sentiment</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Response Time</div></Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
