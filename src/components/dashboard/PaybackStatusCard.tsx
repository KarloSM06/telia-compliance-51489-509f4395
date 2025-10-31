import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PaybackMetrics } from "@/lib/roiCalculations";
import { formatCostInSEK } from "@/lib/telephonyFormatters";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface PaybackStatusCardProps {
  metrics: PaybackMetrics;
}

export function PaybackStatusCard({ metrics }: PaybackStatusCardProps) {
  const {
    paybackPeriodMonths,
    cumulativeProfit,
    breakEvenDate,
    isBreakEvenReached,
    monthsSinceStart,
    initialInvestment
  } = metrics;

  // Calculate progress percentage
  const progressPercentage = initialInvestment > 0 
    ? Math.min(100, Math.max(0, ((monthsSinceStart / paybackPeriodMonths) * 100)))
    : 0;

  return (
    <PremiumCard className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <PremiumCardHeader>
        <PremiumCardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Återbetalningstid
          </span>
          {isBreakEvenReached ? (
            <Badge variant="default" className="bg-green-500">
              Break-Even nått! ✓
            </Badge>
          ) : (
            <Badge variant="secondary">
              {progressPercentage.toFixed(0)}% återbetalt
            </Badge>
          )}
        </PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent className="space-y-4">
        {/* Payback Period */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Återbetalningstid</span>
            <span className="text-2xl font-bold">
              {paybackPeriodMonths > 0 ? `${paybackPeriodMonths.toFixed(1)} mån` : 'N/A'}
            </span>
          </div>
          
          {/* Progress Bar */}
          {!isBreakEvenReached && paybackPeriodMonths > 0 && (
            <div className="space-y-1">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {monthsSinceStart.toFixed(1)} av {paybackPeriodMonths.toFixed(1)} månader
              </p>
            </div>
          )}
        </div>

        {/* Cumulative Profit */}
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Kumulativ vinst</span>
          </div>
          <p className={`text-2xl font-bold ${cumulativeProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCostInSEK(cumulativeProfit)}
          </p>
          {cumulativeProfit < 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Inkluderar initial investering på {formatCostInSEK(initialInvestment)}
            </p>
          )}
        </div>

        {/* Break-Even Date */}
        {breakEvenDate && !isBreakEvenReached && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Beräknad break-even</span>
            </div>
            <p className="text-lg font-semibold">
              ~{format(breakEvenDate, 'd MMMM yyyy', { locale: sv })}
            </p>
          </div>
        )}
      </PremiumCardContent>
    </PremiumCard>
  );
}