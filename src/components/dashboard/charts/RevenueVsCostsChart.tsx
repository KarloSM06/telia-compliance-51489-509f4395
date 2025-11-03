import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiLineChart } from "./MultiLineChart";
import { useMemo } from "react";

interface RevenueVsCostsChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const RevenueVsCostsChart = ({ data, isLoading }: RevenueVsCostsChartProps) => {
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
          <div className="flex items-center justify-center h-80">
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
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intäkter vs Kostnader</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daglig jämförelse av intäkter, kostnader och vinst
        </p>
      </CardHeader>
      <CardContent>
        <MultiLineChart
          data={chartData}
          lines={[
            { dataKey: 'revenue', color: 'hsl(142, 76%, 36%)', name: 'Intäkter' },
            { dataKey: 'costs', color: 'hsl(0, 84%, 60%)', name: 'Kostnader' },
            { dataKey: 'profit', color: 'hsl(43, 96%, 56%)', name: 'Vinst' }
          ]}
          yAxisFormatter={(v) => `${v.toFixed(0)} kr`}
          tooltipFormatter={(v) => `${v.toFixed(2)} SEK`}
          height={350}
        />
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Klicka på linjenamnen i förklaringen för att visa/dölja dem
        </p>
      </CardContent>
    </Card>
  );
};
