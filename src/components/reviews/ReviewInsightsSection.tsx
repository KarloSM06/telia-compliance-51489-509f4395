import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Clock, Zap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useReviewInsights } from "@/hooks/useReviewInsights";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { SentimentTrend } from "./SentimentTrend";
import { TopDrivers } from "./TopDrivers";
import { TopicDistribution } from "./TopicDistribution";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface ReviewInsightsSectionProps {
  dateRange?: { from: Date; to: Date };
}

export const ReviewInsightsSection = ({ dateRange }: ReviewInsightsSectionProps) => {
  const { insights, isLoading, queueStatus } = useReviewInsights(dateRange);

  const getStatusBadge = () => {
    if (queueStatus?.status === 'processing') {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 animate-pulse">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Analyserar just nu...
        </Badge>
      );
    }
    
    if (queueStatus?.status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
          <Clock className="h-3 w-3 mr-1" />
          I kö för analys
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-600">
        <Zap className="h-3 w-3 mr-1" />
        Auto-analys aktiv
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>AI-analys initialiseras automatiskt...</span>
            {getStatusBadge()}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with status */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Insikter & Förbättringar
            </h2>
            {getStatusBadge()}
          </div>
          <p className="text-muted-foreground">
            AI-genererade rekommendationer baserat på {insights.total_interactions} interaktioner
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Senast analyserad: {formatDistanceToNow(new Date(insights.created_at), { addSuffix: true, locale: sv })}
            </span>
          </div>
        </div>
      </div>

      {/* Sentiment Trend and Topic Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <SentimentTrend 
          trend={insights.sentiment_trend}
          averageSentiment={insights.average_sentiment}
        />
        <TopicDistribution distribution={insights.topic_distribution} />
      </div>

      {/* Top Drivers */}
      <TopDrivers 
        positiveDrivers={insights.positive_drivers}
        negativeDrivers={insights.negative_drivers}
      />

      {/* Improvement Suggestions */}
      <ImprovementSuggestions suggestions={insights.improvement_suggestions} />
    </div>
  );
};
