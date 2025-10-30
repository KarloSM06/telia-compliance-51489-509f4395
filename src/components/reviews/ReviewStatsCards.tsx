import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, TrendingUp, ThumbsUp, Sparkles } from 'lucide-react';

interface ReviewStatsCardsProps {
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  };
  insights?: {
    average_sentiment: number;
  } | null;
}

export const ReviewStatsCards = ({ stats, insights }: ReviewStatsCardsProps) => {
  const satisfiedCustomers = stats.totalReviews > 0
    ? Math.round(((stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0)) / stats.totalReviews * 100)
    : 0;

  const sentimentScore = insights?.average_sentiment 
    ? Math.round((insights.average_sentiment + 1) * 50) // Convert from -1 to 1 range to 0-100%
    : null;

  const cards = [
    {
      title: 'Total Recensioner',
      value: stats.totalReviews,
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      subtitle: stats.totalReviews > 0 ? `Från alla källor` : 'Inga recensioner ännu'
    },
    {
      title: 'Genomsnitt',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
      subtitle: `av 5 stjärnor`
    },
    {
      title: 'Nöjda Kunder',
      value: `${satisfiedCustomers}%`,
      icon: ThumbsUp,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      subtitle: '4-5 stjärnor'
    },
    {
      title: 'AI Sentiment',
      value: sentimentScore !== null ? `${sentimentScore}%` : 'N/A',
      icon: Sparkles,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      subtitle: sentimentScore !== null ? 'AI-driven analys' : 'Kör analys först'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-2xl">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};