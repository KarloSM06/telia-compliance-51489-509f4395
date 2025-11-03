import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kostnadstrend</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        ) : (
          <LineChartComponent
            title=""
            data={chartData}
            dataKeys={[
              { key: 'kostnad', color: 'hsl(var(--primary))', name: 'Kostnad (SEK)' }
            ]}
            xAxisKey="name"
            height={300}
          />
        )}
      </CardContent>
    </Card>
  );
};
