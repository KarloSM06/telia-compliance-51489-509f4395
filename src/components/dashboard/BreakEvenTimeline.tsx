import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { TrendingUp, CheckCircle2 } from "lucide-react";
import { PaybackMetrics } from "@/lib/roiCalculations";
import { formatCostInSEK } from "@/lib/telephonyFormatters";
import { AreaChartComponent } from "./charts/AreaChartComponent";

interface BreakEvenTimelineProps {
  metrics: PaybackMetrics;
}

export function BreakEvenTimeline({ metrics }: BreakEvenTimelineProps) {
  const {
    initialInvestment,
    monthlyRecurringCost,
    averageMonthlyRevenue,
    paybackPeriodMonths,
    monthsSinceStart
  } = metrics;

  // Generate timeline data for up to 12 months
  const timelineData = [];
  const monthsToShow = Math.max(12, Math.ceil(paybackPeriodMonths) + 2);
  
  let cumulativeProfit = -initialInvestment;
  
  for (let month = 0; month <= Math.min(monthsToShow, 24); month++) {
    if (month > 0) {
      cumulativeProfit += (averageMonthlyRevenue - monthlyRecurringCost);
    }
    
    timelineData.push({
      month: `Månad ${month}`,
      "Kumulativ Vinst": Math.round(cumulativeProfit),
      isBreakEven: cumulativeProfit >= 0 && timelineData[timelineData.length - 1]?.["Kumulativ Vinst"] < 0
    });
  }

  // Find break-even month
  const breakEvenMonth = timelineData.findIndex(d => d["Kumulativ Vinst"] >= 0);

  return (
    <PremiumCard>
      <PremiumCardHeader>
        <PremiumCardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Break-Even Tidslinje
        </PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent className="space-y-6">
        {/* Key milestones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Månad 0</p>
            <p className="text-lg font-semibold text-red-600">
              {formatCostInSEK(-initialInvestment)}
            </p>
            <p className="text-xs text-muted-foreground">Initial investering</p>
          </div>
          
          {breakEvenMonth > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Månad {breakEvenMonth}</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-lg font-semibold text-green-600">
                  Break-Even!
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Alla kostnader täckta</p>
            </div>
          )}
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Månad 12</p>
            <p className={`text-lg font-semibold ${timelineData[12]?.["Kumulativ Vinst"] >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {formatCostInSEK(timelineData[12]?.["Kumulativ Vinst"] || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Efter 1 år</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <AreaChartComponent
            title=""
            data={timelineData}
            xAxisKey="month"
            dataKeys={[
              { key: "Kumulativ Vinst", name: "Kumulativ Vinst", color: "hsl(var(--primary))" }
            ]}
            height={300}
          />
        </div>

        {/* Current status */}
        {monthsSinceStart > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Nuvarande status: <span className="font-semibold">Månad {monthsSinceStart.toFixed(1)}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Genomsnittlig månadsinkomst: {formatCostInSEK(averageMonthlyRevenue)} | 
              Månadskostnad: {formatCostInSEK(monthlyRecurringCost)} | 
              Nettoresultat/månad: {formatCostInSEK(averageMonthlyRevenue - monthlyRecurringCost)}
            </p>
          </div>
        )}
      </PremiumCardContent>
    </PremiumCard>
  );
}