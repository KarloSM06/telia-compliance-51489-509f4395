import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SentimentTrendProps {
  trend: 'improving' | 'stable' | 'declining';
  averageSentiment: number;
}

export const SentimentTrend = ({ trend, averageSentiment }: SentimentTrendProps) => {
  const trendConfig = {
    improving: {
      icon: TrendingUp,
      label: 'Förbättras',
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Kundnöjdheten ökar positivt'
    },
    stable: {
      icon: Minus,
      label: 'Stabil',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Kundnöjdheten är stabil'
    },
    declining: {
      icon: TrendingDown,
      label: 'Försämras',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Kundnöjdheten minskar'
    }
  };

  const config = trendConfig[trend];
  const Icon = config.icon;

  // Convert sentiment from -1 to 1 scale to 0-100 percentage
  const sentimentPercentage = Math.round(((averageSentiment + 1) / 2) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundupplevelse Trend</CardTitle>
        <CardDescription>Övergripande utveckling</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className={`flex items-center justify-between p-4 rounded-lg ${config.bgColor}`}>
            <div className="flex items-center gap-3">
              <Icon className={`h-8 w-8 ${config.color}`} />
              <div>
                <div className={`text-2xl font-bold ${config.color}`}>
                  {config.label}
                </div>
                <p className="text-sm text-muted-foreground">{config.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Genomsnittlig sentiment</span>
              <span className="text-2xl font-bold">{sentimentPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  sentimentPercentage >= 70 ? 'bg-success' :
                  sentimentPercentage >= 40 ? 'bg-warning' :
                  'bg-destructive'
                }`}
                style={{ width: `${sentimentPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Negativ</span>
              <span>Neutral</span>
              <span>Positiv</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
