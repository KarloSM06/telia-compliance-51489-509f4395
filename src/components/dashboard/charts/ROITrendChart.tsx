import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Brush, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { ChartActionMenu } from './enhanced/ChartActionMenu';
import { ChartInsightsBox } from './enhanced/ChartInsightsBox';
import { InlineStatsBadge } from './enhanced/InlineStatsBadge';
import { useChartExport } from '@/hooks/useChartExport';
interface ROITrendChartProps {
  data: Array<{
    date: string;
    revenue: number;
    costs: number;
  }>;
  isLoading?: boolean;
}
export const ROITrendChart = ({
  data,
  isLoading
}: ROITrendChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    exportToPNG,
    exportToCSV
  } = useChartExport();
  const chartData = useMemo(() => {
    return data.map((d, idx) => {
      const roi = d.costs > 0 ? (d.revenue - d.costs) / d.costs * 100 : 0;
      const startIdx = Math.max(0, idx - 6);
      const slice = data.slice(startIdx, idx + 1);
      const avgRoi = slice.reduce((sum, item) => {
        const itemRoi = item.costs > 0 ? (item.revenue - item.costs) / item.costs * 100 : 0;
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
    return <Card>
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
      </Card>;
  }
  if (data.length === 0) {
    return <Card>
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
      </Card>;
  }
  return;
};