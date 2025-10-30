import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useReviewInsights } from "@/hooks/useReviewInsights";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { SentimentTrend } from "./SentimentTrend";
import { TopDrivers } from "./TopDrivers";
import { TopicDistribution } from "./TopicDistribution";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewInsightsSectionProps {
  dateRange?: { from: Date; to: Date };
}

export const ReviewInsightsSection = ({ dateRange }: ReviewInsightsSectionProps) => {
  const { insights, isLoading, isOutdated, triggerAnalysis, isAnalyzing } = useReviewInsights(dateRange);

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
          <span>Ingen AI-analys tillgänglig ännu. Kör en analys för att få insikter.</span>
          <Button
            onClick={() => triggerAnalysis()}
            disabled={isAnalyzing}
            size="sm"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyserar...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Kör Analys
              </>
            )}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Insikter & Förbättringar
          </h2>
          <p className="text-muted-foreground">
            AI-genererade rekommendationer baserat på {insights.total_interactions} interaktioner
          </p>
        </div>
        <Button
          onClick={() => triggerAnalysis()}
          disabled={isAnalyzing}
          variant={isOutdated ? "default" : "outline"}
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyserar...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              {isOutdated ? 'Uppdatera Analys' : 'Analysera På Nytt'}
            </>
          )}
        </Button>
      </div>

      {isOutdated && (
        <Alert>
          <AlertDescription>
            Denna analys är äldre än 24 timmar. Klicka på "Uppdatera Analys" för senaste insikter.
          </AlertDescription>
        </Alert>
      )}

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
