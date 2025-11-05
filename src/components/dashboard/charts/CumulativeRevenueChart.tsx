import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Brush } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ChartActionMenu } from './enhanced/ChartActionMenu';
import { useChartExport } from '@/hooks/useChartExport';

interface CumulativeRevenueChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const CumulativeRevenueChart = ({ data, isLoading }: CumulativeRevenueChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();
  
  const chartData = useMemo(() => {
    let cumulativeRevenue = 0;
    let cumulativeCosts = 0;
    
    return data.map(d => {
      cumulativeRevenue += d.revenue;
      cumulativeCosts += d.costs;
      return {
        date: d.date,
        intäkter: cumulativeRevenue,
        kostnader: cumulativeCosts
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Kumulativ utveckling
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
            <TrendingUp className="h-4 w-4" />
            Kumulativ utveckling
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
            <TrendingUp className="h-4 w-4 text-primary" />
            Kumulativ utveckling
          </CardTitle>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'kumulativ-utveckling')}
            onExportCSV={() => exportToCSV(chartData, 'kumulativ-utveckling')}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cumulativeRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(158, 64%, 52%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="cumulativeCostsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="hsl(345, 82%, 52%)" stopOpacity={0.05} />
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
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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
              formatter={(value: number) => [`${value.toFixed(2)} SEK`]}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <Area
              type="monotone"
              dataKey="intäkter"
              stroke="hsl(142, 76%, 45%)"
              strokeWidth={2.5}
              fill="url(#cumulativeRevenueGradient)"
              name="Kumulativa intäkter"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Area
              type="monotone"
              dataKey="kostnader"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2.5}
              fill="url(#cumulativeCostsGradient)"
              name="Kumulativa kostnader"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
