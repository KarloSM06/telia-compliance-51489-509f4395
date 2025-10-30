import { useReviewInsights } from "@/hooks/useReviewInsights";
import { ImprovementSuggestions } from "./ImprovementSuggestions";
import { SentimentTrend } from "./SentimentTrend";
import { TopDrivers } from "./TopDrivers";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewInsightsSectionProps {
  dateRange: { from: Date; to: Date };
}

export const ReviewInsightsSection = ({ dateRange }: ReviewInsightsSectionProps) => {
  const { insights, isLoading, error, refetch } = useReviewInsights(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Kunde inte hämta insikter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'Ett fel uppstod vid analys'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Försök igen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Ingen data tillgänglig för analys
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metadata */}
      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground">Datapunkter analyserade:</span>
                <span className="font-semibold ml-2">{insights.metadata.dataPoints.total}</span>
              </div>
              <div className="text-muted-foreground">
                ({insights.metadata.dataPoints.reviews} recensioner, 
                {insights.metadata.dataPoints.telephony} samtal, 
                {insights.metadata.dataPoints.sms} SMS, 
                {insights.metadata.dataPoints.email} email)
              </div>
            </div>
            <Button onClick={() => refetch()} variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Uppdatera analys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sentiment & Top Drivers */}
      <div className="grid gap-4 md:grid-cols-2">
        <SentimentTrend insights={insights} />
        <div className="space-y-4">
          <TopDrivers 
            positiveDrivers={insights.topPositiveDrivers}
            negativeDrivers={insights.topNegativeDrivers}
          />
        </div>
      </div>

      {/* Improvement Suggestions */}
      <ImprovementSuggestions suggestions={insights.improvementSuggestions} />
    </div>
  );
};