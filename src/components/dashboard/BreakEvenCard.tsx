import { TrendingUp, Calendar, DollarSign } from "lucide-react";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { BreakEvenMetrics } from "@/lib/roiCalculations";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface BreakEvenCardProps {
  breakEven: BreakEvenMetrics;
}

export function BreakEvenCard({ breakEven }: BreakEvenCardProps) {
  return (
    <PremiumCard>
      <PremiumCardHeader>
        <PremiumCardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Break-Even Analys
        </PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent className="p-4">
        <div className="space-y-3">
          {breakEven.isBreakEvenReached ? (
            <>
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-semibold text-green-600">Break-Even Nås Efter:</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {breakEven.breakEvenMonth} {breakEven.breakEvenMonth === 1 ? 'månad' : 'månader'}
                </p>
                {breakEven.breakEvenDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Cirka {format(breakEven.breakEvenDate, "MMMM yyyy", { locale: sv })}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Månadsinkomst</span>
                  <span className="text-sm font-semibold">
                    {breakEven.monthlyRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Månadskostnad</span>
                  <span className="text-sm font-semibold">
                    {breakEven.monthlyCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">Månadsvinst</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {breakEven.monthlyProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-600 font-semibold">Break-Even Kan Inte Beräknas</p>
              <p className="text-xs text-muted-foreground mt-1">
                Månadskostnaden överstiger månadsintäkten.
              </p>
            </div>
          )}
        </div>
      </PremiumCardContent>
    </PremiumCard>
  );
}
