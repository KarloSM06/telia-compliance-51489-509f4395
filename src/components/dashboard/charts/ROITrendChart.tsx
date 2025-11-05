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
    <Card ref={chartRef}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            ROI-trend
          </CardTitle>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'roi-trend')}
            onExportCSV={() => exportToCSV(chartData, 'roi-trend')}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartInsightsBox data={chartData} dataKey="roi" type="roi" />
        <InlineStatsBadge data={chartData} dataKey="roi" />
        
        <ResponsiveContainer width="100%" height={450}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.5} />
                <stop offset="50%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(43, 96%, 56%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <ReferenceLine 
              y={0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3"
              label={{ value: 'Break-even', position: 'insideTopRight', fill: 'hsl(var(--muted-foreground))' }}
            />
            <ReferenceLine 
              y={50} 
              stroke="hsl(142, 76%, 36%)" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
              label={{ value: 'Mål: 50%', position: 'insideTopRight', fill: 'hsl(142, 76%, 36%)', fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="roi"
              stroke="hsl(43, 96%, 56%)"
              strokeWidth={2.5}
              fill="url(#roiGradient)"
              name="ROI %"
            />
            <Line
              type="monotone"
              dataKey="roiMA"
              stroke="hsl(271, 70%, 60%)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="7-dagars genomsnitt"
            />
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="hsl(var(--primary))"
              tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short' })}
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Lila linje visar glidande medelvärde (7 dagar) • Dra i borsten för att zooma
        </p>
      </CardContent>
    </Card>
  );
};
