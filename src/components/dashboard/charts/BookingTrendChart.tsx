import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceDot } from 'recharts';
import { Calendar } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ChartActionMenu } from './enhanced/ChartActionMenu';
import { ChartInsightsBox } from './enhanced/ChartInsightsBox';
import { InlineStatsBadge } from './enhanced/InlineStatsBadge';
import { useChartExport } from '@/hooks/useChartExport';

interface BookingTrendChartProps {
  data: Array<{ date: string; bookings: number }>;
  isLoading?: boolean;
}

export const BookingTrendChart = ({ data, isLoading }: BookingTrendChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();
  
  const chartData = useMemo(() => {
    return data.map(d => ({
      date: d.date,
      bokningar: d.bookings
    }));
  }, [data]);

  const maxBooking = useMemo(() => {
    const max = Math.max(...chartData.map(d => d.bokningar));
    const maxEntry = chartData.find(d => d.bokningar === max);
    return maxEntry;
  }, [chartData]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Bokningstrend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[320px]">
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
            <Calendar className="h-4 w-4" />
            Bokningstrend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[320px]">
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
            <Calendar className="h-4 w-4 text-primary" />
            Bokningstrend
          </CardTitle>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'bokningstrend')}
            onExportCSV={() => exportToCSV(chartData, 'bokningstrend')}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-5">
        <InlineStatsBadge data={chartData} dataKey="bokningar" />
        
        <ResponsiveContainer width="100%" height={400}>
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
              allowDecimals={false}
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
              formatter={(value: number) => [value, 'Bokningar']}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <Line
              type="monotone"
              dataKey="bokningar"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(217, 91%, 60%)", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              name="Bokningar"
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
