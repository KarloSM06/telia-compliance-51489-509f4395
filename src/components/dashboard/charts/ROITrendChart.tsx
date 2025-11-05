import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Brush, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ChartActionMenu } from './enhanced/ChartActionMenu';
import { ChartInsightsBox } from './enhanced/ChartInsightsBox';
import { InlineStatsBadge } from './enhanced/InlineStatsBadge';
import { useChartExport } from '@/hooks/useChartExport';

interface ROITrendChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const ROITrendChart = ({ data, isLoading }: ROITrendChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();

  const chartData = useMemo(() => {
    return data.map((d, idx) => {
      const roi = d.costs > 0 ? ((d.revenue - d.costs) / d.costs) * 100 : 0;
      
      const startIdx = Math.max(0, idx - 6);
      const slice = data.slice(startIdx, idx + 1);
      const avgRoi = slice.reduce((sum, item) => {
        const itemRoi = item.costs > 0 ? ((item.revenue - item.costs) / item.costs) * 100 : 0;
        return sum + itemRoi;
      }, 0) / slice.length;

      return {
        date: d.date,
        roi,
        roiMA: avgRoi
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            ROI-trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[450px]">
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
            ROI-trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[450px]">
            <p className="text-sm text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={chartRef} className="col-span-full border-2 border-primary/10 shadow-lg shadow-primary/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            ROI-trend
          </CardTitle>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'roi-trend')}
            onExportCSV={() => exportToCSV(chartData, 'roi-trend')}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <ChartInsightsBox data={chartData} dataKey="roi" type="roi" />
        <InlineStatsBadge data={chartData} dataKey="roi" />
        
        <ResponsiveContainer width="100%" height={480}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(271, 70%, 60%)" stopOpacity={0.6} />
                <stop offset="20%" stopColor="hsl(271, 70%, 60%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(271, 70%, 60%)" stopOpacity={0.2} />
                <stop offset="80%" stopColor="hsl(280, 78%, 65%)" stopOpacity={0.08} />
                <stop offset="100%" stopColor="hsl(280, 78%, 65%)" stopOpacity={0.02} />
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
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
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
              dataKey="roi"
              stroke="hsl(271, 70%, 60%)"
              strokeWidth={2.5}
              fill="url(#roiGradient)"
              name="ROI %"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
            <Line
              type="monotone"
              dataKey="roiMA"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="7-dagars genomsnitt"
            />
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="hsl(var(--primary))"
              fill="hsl(var(--muted))"
              tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short' })}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
