import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Target } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ChartActionMenu } from './enhanced/ChartActionMenu';
import { ChartInsightsBox } from './enhanced/ChartInsightsBox';
import { useChartExport } from '@/hooks/useChartExport';

interface DailyROIChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const DailyROIChart = ({ data, isLoading }: DailyROIChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();
  
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
    <Card ref={chartRef} className="border border-border/30 shadow-sm hover:border-border/50 transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Daglig ROI
          </CardTitle>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'daglig-roi')}
            onExportCSV={() => exportToCSV(chartData, 'daglig-roi')}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" opacity={0.5} />
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
                backgroundColor: "hsla(var(--card), 0.95)",
                border: "1px solid hsla(var(--border), 0.5)",
                borderRadius: "12px",
                backdropFilter: "blur(12px) saturate(180%)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                padding: "12px 16px",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <ReferenceLine 
              y={0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="hsl(271, 70%, 60%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(271, 70%, 60%)", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              name="ROI %"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
