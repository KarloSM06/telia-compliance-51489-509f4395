import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Progress } from "@/components/ui/progress";
import { CumulativeROIMetrics } from "@/lib/roiCalculations";
import { CheckCircle, TrendingUp, Calendar, Target } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface IntegrationROICardProps {
  data: CumulativeROIMetrics;
}

export const IntegrationROICard = ({ data }: IntegrationROICardProps) => {
  const progressPercentage = data.isBreakEven 
    ? 100 
    : Math.min(100, Math.max(0, ((data.totalRevenueToDate / data.totalCostsToDate) * 100)));

  return (
    <PremiumCard className="border-2 border-primary/20">
      <PremiumCardHeader>
        <PremiumCardTitle className="flex items-center gap-2">
          {data.isBreakEven ? (
            <>
              <CheckCircle className="h-5 w-5 text-success" />
              Integration ROI - Break-Even Uppnått! 🎉
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 text-primary" />
              Integration ROI - På väg mot Break-Even
            </>
          )}
        </PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent className="space-y-6">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Initial Investering</p>
            <p className="text-2xl font-bold">
              {data.initialInvestment.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Kumulativ Vinst</p>
            <p className={`text-2xl font-bold ${data.cumulativeProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
              {data.cumulativeProfit >= 0 ? '+' : ''}
              {data.cumulativeProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Månader Sedan Start</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {data.monthsSinceStart}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Break-Even Progress</span>
            <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Break-Even Status */}
        {data.isBreakEven ? (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <p className="font-semibold text-success">Break-Even Uppnått!</p>
            </div>
            {data.breakEvenDate && (
              <p className="text-sm text-muted-foreground">
                Break-even nåddes: {format(data.breakEvenDate, 'PPP', { locale: sv })}
              </p>
            )}
            <p className="text-sm mt-2">
              Din investering har återbetalats. All framtida vinst är ren tillväxt! 📈
            </p>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <p className="font-semibold">Förväntad Break-Even</p>
            </div>
            {data.projectedBreakEvenMonths !== null ? (
              <p className="text-sm">
                Baserat på nuvarande trend: <strong>{data.projectedBreakEvenMonths}</strong> månader kvar
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nuvarande kostnadsnivå är högre än intäkter. Öka försäljning eller minska kostnader för att nå break-even.
              </p>
            )}
          </div>
        )}

        {/* Monthly Averages */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Genomsnitt Intäkt/Månad</p>
            <p className="text-lg font-semibold text-success">
              {data.monthlyAverageRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Genomsnitt Kostnad/Månad</p>
            <p className="text-lg font-semibold text-destructive">
              {data.monthlyAverageCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </div>
        </div>
      </PremiumCardContent>
    </PremiumCard>
  );
};
