import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiLineChart } from "./MultiLineChart";
import { useMemo, useRef } from "react";
import { ChartActionMenu } from "./enhanced/ChartActionMenu";
import { ChartInsightsBox } from "./enhanced/ChartInsightsBox";
import { InlineStatsBadge } from "./enhanced/InlineStatsBadge";
import { useChartExport } from "@/hooks/useChartExport";

interface RevenueVsCostsChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const RevenueVsCostsChart = ({ data, isLoading }: RevenueVsCostsChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();
  
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      profit: d.revenue - d.costs
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intäkter vs Kostnader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Intäkter vs Kostnader</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={chartRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Intäkter vs Kostnader</CardTitle>
            <p className="text-sm text-muted-foreground">
              Daglig jämförelse av intäkter, kostnader och vinst
            </p>
          </div>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'intakter-vs-kostnader')}
            onExportCSV={() => exportToCSV(chartData, 'intakter-vs-kostnader')}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartInsightsBox data={chartData} dataKey="revenue" type="revenue" />
        <InlineStatsBadge data={chartData} dataKey="profit" />
        
        <MultiLineChart
          data={chartData}
          lines={[
            { dataKey: 'revenue', color: 'hsl(142, 76%, 36%)', name: 'Intäkter' },
            { dataKey: 'costs', color: 'hsl(0, 84%, 60%)', name: 'Kostnader' },
            { dataKey: 'profit', color: 'hsl(43, 96%, 56%)', name: 'Vinst' }
          ]}
          yAxisFormatter={(v) => `${v.toFixed(0)} kr`}
          tooltipFormatter={(v) => `${v.toFixed(2)} SEK`}
          height={450}
          showBrush
        />
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Klicka på linjenamnen i förklaringen för att visa/dölja dem
        </p>
      </CardContent>
    </Card>
  );
};
