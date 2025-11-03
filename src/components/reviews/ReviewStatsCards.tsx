import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, ThumbsUp, Sparkles, Brain, Tag, AlertTriangle } from 'lucide-react';

interface ReviewStatsCardsProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  insights?: {
    avgSentiment: number;
    topTopic: { name: string; count: number } | null;
    topPositiveTopic: { topic: string; count: number } | null;
    topNegativeTopic: { topic: string; count: number } | null;
  } | null;
}
export const ReviewStatsCards = ({
  stats,
  insights
}: ReviewStatsCardsProps) => {
  const satisfiedCustomers = stats.totalReviews > 0 ? Math.round(((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalReviews * 100) : 0;
  const sentimentScore = insights?.avgSentiment !== undefined ? Math.round((insights.avgSentiment + 1) * 50) : null;
  
  const cards = [{
    title: 'Total Recensioner',
    value: stats.totalReviews,
    icon: Star,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    subtitle: stats.totalReviews > 0 ? `Från alla källor` : 'Inga recensioner ännu'
  }, {
    title: 'Genomsnitt',
    value: stats.averageRating.toFixed(1),
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    subtitle: `av 5 stjärnor`
  }, {
    title: 'Nöjda Kunder',
    value: `${satisfiedCustomers}%`,
    icon: ThumbsUp,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    subtitle: '4-5 stjärnor'
  }, {
    title: 'AI Sentiment',
    value: sentimentScore !== null ? `${sentimentScore}%` : 'N/A',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    subtitle: sentimentScore !== null ? `Baserat på ${stats.totalReviews} recensioner` : 'Kör analys först'
  }];

  // Add AI insights cards if available
  if (insights && insights.topTopic) {
    cards.push({
      title: 'Top Topic',
      value: insights.topTopic.name,
      icon: Tag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      subtitle: `${insights.topTopic.count} omnämnanden`
    });
  }

  if (insights && insights.topPositiveTopic) {
    cards.push({
      title: 'Styrka',
      value: insights.topPositiveTopic.topic,
      icon: ThumbsUp,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      subtitle: `${insights.topPositiveTopic.count} positiva omnämnanden`
    });
  }

  if (insights && insights.topNegativeTopic) {
    cards.push({
      title: 'Förbättringsområde',
      value: insights.topNegativeTopic.topic,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      subtitle: `${insights.topNegativeTopic.count} negativa omnämnanden`
    });
  }
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(card => <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-xl">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold rounded-none">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>)}
    </div>;
};