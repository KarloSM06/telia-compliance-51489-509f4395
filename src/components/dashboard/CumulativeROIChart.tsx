import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { CumulativeMetrics } from "@/lib/roiCalculations";

interface CumulativeROIChartProps {
  data: CumulativeMetrics[];
  breakEvenMonth?: number;
}

export function CumulativeROIChart({ data, breakEvenMonth }: CumulativeROIChartProps) {
  // Transform data for chart
  const chartData = data.map(d => ({
    name: d.monthName,
    kostnader: d.accumulatedCost,
    intäkter: d.accumulatedRevenue,
    vinst: d.netProfit
  }));

  return (
    <div className="space-y-3">
      <AreaChartComponent
        title={
          breakEvenMonth 
            ? `Kumulativ ROI (Break-even: Månad ${breakEvenMonth})` 
            : "Kumulativ ROI"
        }
        data={chartData}
        dataKeys={[
          { key: "kostnader", color: "hsl(0, 84%, 60%)", name: "Kostnader" },
          { key: "intäkter", color: "hsl(142, 76%, 36%)", name: "Intäkter" },
          { key: "vinst", color: "hsl(43, 96%, 56%)", name: "Vinst" }
        ]}
        height={280}
      />
      
      {breakEvenMonth && breakEvenMonth <= data.length && (
        <div className="bg-green-50 dark:bg-green-950 p-2 rounded border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 font-medium">
            ✅ Break-even: Månad {breakEvenMonth}
          </p>
        </div>
      )}
    </div>
  );
}
