import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DailyCost {
  date: string;
  cost: number;
}

interface CostTrendChartProps {
  data: DailyCost[];
  isLoading?: boolean;
}

export const CostTrendChart = ({ data, isLoading }: CostTrendChartProps) => {
  const chartData = data.map(item => ({
    name: new Date(item.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
    kostnad: item.cost
  }));

  // Calculate insights
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const avgDailyCost = data.length > 0 ? totalCost / data.length : 0;
  const highestCostDay = data.length > 0 
    ? data.reduce((max, item) => item.cost > max.cost ? item : max, data[0])
    : null;

  // Calculate trend (compare first half vs second half)
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);
  const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.cost, 0) / (firstHalf.length || 1);
  const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.cost, 0) / (secondHalf.length || 1);
  const trendPercentage = firstHalfAvg > 0 
    ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
    : 0;
  const isIncreasing = trendPercentage > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Kostnadstrend</CardTitle>
          {data.length > 0 && (
            <Badge variant={isIncreasing ? "destructive" : "default"} className="gap-1">
              {isIncreasing ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trendPercentage).toFixed(1)}%
            </Badge>
          )}
        </div>
        
        {data.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Genomsnitt/dag</p>
              <p className="text-lg font-semibold">{avgDailyCost.toFixed(2)} SEK</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Högsta dag</p>
              <p className="text-lg font-semibold">{highestCostDay?.cost.toFixed(2)} SEK</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Totalt</p>
              <p className="text-lg font-semibold">{totalCost.toFixed(2)} SEK</p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Ingen kostnadsdata tillgänglig för vald period</p>
          </div>
        ) : (
          <LineChartComponent
            title=""
            data={chartData}
            dataKeys={[
              { key: 'kostnad', color: 'hsl(var(--primary))', name: 'Kostnad (SEK)' }
            ]}
            xAxisKey="name"
            height={350}
          />
        )}
      </CardContent>
    </Card>
  );
};
