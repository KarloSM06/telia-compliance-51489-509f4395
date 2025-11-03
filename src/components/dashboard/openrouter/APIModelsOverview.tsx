import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Zap } from "lucide-react";

interface ModelOverview {
  model: string;
  cost: number;
  calls: number;
  percentage: number;
  avgCostPerCall: number;
  status: 'active' | 'inactive';
}

interface APIModelsOverviewProps {
  models: ModelOverview[];
  isLoading?: boolean;
}

export const APIModelsOverview = ({ models, isLoading }: APIModelsOverviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Modeller - Översikt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getCostColor = (percentage: number) => {
    if (percentage > 40) return "text-red-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          API Modeller - Översikt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <div
              key={model.model}
              className="p-4 border rounded-lg space-y-3 bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" title={model.model}>
                    {model.model}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={model.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {model.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {model.calls} anrop
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${getCostColor(model.percentage)}`}>
                    {model.cost.toFixed(2)} SEK
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {model.percentage.toFixed(1)}%
                  </span>
                </div>

                <Progress 
                  value={model.percentage} 
                  className="h-2"
                />

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>Snitt: {model.avgCostPerCall.toFixed(4)} SEK/anrop</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {models.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Ingen aktivitet för vald period
          </div>
        )}
      </CardContent>
    </Card>
  );
};
