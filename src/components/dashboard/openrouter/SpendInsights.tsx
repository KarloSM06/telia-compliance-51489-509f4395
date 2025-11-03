import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";

interface Insight {
  type: 'info' | 'warning' | 'success';
  message: string;
}

interface SpendInsightsProps {
  insights: Insight[];
}

export const SpendInsights = ({ insights }: SpendInsightsProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insikter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <Alert key={index} variant={insight.type === 'warning' ? 'destructive' : 'default'}>
            {getIcon(insight.type)}
            <AlertDescription className="ml-2">
              {insight.message}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};
