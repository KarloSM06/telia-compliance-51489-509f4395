import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ReviewInsights } from "@/hooks/useReviewInsights";
import { Badge } from "@/components/ui/badge";

interface SentimentTrendProps {
  insights: ReviewInsights;
}

export const SentimentTrend = ({ insights }: SentimentTrendProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getSentimentIcon = () => {
    switch (insights.trends.sentimentTrend) {
      case 'improving':
        return <TrendingUp className="h-8 w-8 text-green-600" />;
      case 'declining':
        return <TrendingDown className="h-8 w-8 text-red-600" />;
      default:
        return <Minus className="h-8 w-8 text-yellow-600" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'improving': return 'Förbättras';
      case 'declining': return 'Försämras';
      default: return 'Stabilt';
    }
  };

  const getTrendBadgeVariant = (trend: string) => {
    switch (trend) {
      case 'improving': return 'default';
      case 'declining': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment & Utveckling</CardTitle>
        <CardDescription>
          Övergripande kundkänsla och trend över tid
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sentiment Score */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Sentiment-score</p>
              <div className="flex items-center gap-2">
                <div className={`text-3xl font-bold ${getSentimentColor(insights.overallSentiment)}`}>
                  {insights.sentimentScore}
                </div>
                <span className="text-muted-foreground">/ 100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {insights.overallSentiment === 'positive' ? 'Positiv' : 
                 insights.overallSentiment === 'negative' ? 'Negativ' : 'Neutral'}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              {getSentimentIcon()}
              <Badge variant={getTrendBadgeVariant(insights.trends.sentimentTrend)}>
                {getTrendLabel(insights.trends.sentimentTrend)}
              </Badge>
            </div>
          </div>

          {/* Common Themes */}
          {insights.trends.commonThemes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Vanliga teman</h4>
              <div className="flex flex-wrap gap-2">
                {insights.trends.commonThemes.map((theme, index) => (
                  <Badge key={index} variant="outline">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Key Insights */}
          {insights.keyInsights.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Viktiga insikter</h4>
              <ul className="space-y-2">
                {insights.keyInsights.map((insight, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};