import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Brush } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ChartActionMenu } from './enhanced/ChartActionMenu';
import { ChartInsightsBox } from './enhanced/ChartInsightsBox';
import { InlineStatsBadge } from './enhanced/InlineStatsBadge';
import { useChartExport } from '@/hooks/useChartExport';

interface ProfitMarginChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const ProfitMarginChart = ({ data, isLoading }: ProfitMarginChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();

  const chartData = useMemo(() => {
    return data.map(d => {
      const profit = d.revenue - d.costs;
      const margin = d.revenue > 0 ? (profit / d.revenue) * 100 : 0;
      return {
        date: d.date,
        margin,
        profit
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Vinstmarginal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[380px]">
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
            <TrendingUp className="h-4 w-4" />
            Vinstmarginal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[380px]">
            <p className="text-sm text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={chartRef} className="border border-border/50 shadow-md hover:border-border hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Vinstmarginal
          </CardTitle>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'vinstmarginal')}
            onExportCSV={() => exportToCSV(chartData, 'vinstmarginal')}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <InlineStatsBadge data={chartData} dataKey="margin" />
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="marginGradientPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.6} />
                <stop offset="20%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.2} />
                <stop offset="80%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.08} />
                <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Marginal']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <ReferenceLine 
              y={0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
            <Area
              type="monotone"
              dataKey="margin"
              stroke="hsl(43, 96%, 56%)"
              strokeWidth={2.5}
              fill="url(#marginGradientPositive)"
              name="Vinstmarginal %"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
