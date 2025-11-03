import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ModelCost {
  model: string;
  cost: number;
  percentage: number;
  calls?: number;
}

interface TopModelsCardProps {
  models: ModelCost[];
  isLoading?: boolean;
}

export const TopModelsCard = ({ models, isLoading }: TopModelsCardProps) => {
  const topModels = models.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Modeller</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topModels.map((model, index) => (
              <div key={model.model} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="font-medium text-sm">{model.model}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {model.cost.toFixed(2)} SEK
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={model.percentage} className="flex-1" />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {model.percentage.toFixed(1)}%
                  </span>
                </div>
                {model.calls !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    {model.calls} anrop
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
