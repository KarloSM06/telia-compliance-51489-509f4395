import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Target } from 'lucide-react';
import { useMemo } from 'react';

interface DailyROIChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const DailyROIChart = ({ data, isLoading }: DailyROIChartProps) => {
  const chartData = useMemo(() => {
    return data.map(d => ({
      date: d.date,
      roi: d.costs > 0 ? ((d.revenue - d.costs) / d.costs) * 100 : 0
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Daglig ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4" />
            Daglig ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Target className="h-4 w-4" />
          Daglig ROI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${v.toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="hsl(271, 70%, 60%)"
              strokeWidth={2}
              dot={{ fill: "hsl(271, 70%, 60%)", r: 3 }}
              activeDot={{ r: 5 }}
              name="ROI %"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
