import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiLineChart } from "./MultiLineChart";
import { useMemo, useRef } from "react";
import { ChartActionMenu } from "./enhanced/ChartActionMenu";
import { ChartInsightsBox } from "./enhanced/ChartInsightsBox";
import { InlineStatsBadge } from "./enhanced/InlineStatsBadge";
import { useChartExport } from "@/hooks/useChartExport";
interface RevenueVsCostsChartProps {
  data: Array<{
    date: string;
    revenue: number;
    costs: number;
  }>;
  isLoading?: boolean;
}
export const RevenueVsCostsChart = ({
  data,
  isLoading
}: RevenueVsCostsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const {
    exportToPNG,
    exportToCSV
  } = useChartExport();
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      profit: d.revenue - d.costs
    }));
  }, [data]);
  if (isLoading) {
    return <Card>
        <CardHeader>
          <CardTitle>Intäkter vs Kostnader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>;
  }
  if (data.length === 0) {
    return <Card>
        <CardHeader>
          <CardTitle>Intäkter vs Kostnader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card ref={chartRef} className="col-span-full border-2 border-primary/10 shadow-lg shadow-primary/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      
      
    </Card>;
};