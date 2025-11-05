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
        <PremiumCardTitle>Break-Even Analys</PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>Break-Even Status</span>
            </div>
            <p className="text-2xl font-bold">
              {breakEven.isBreakEvenReached ? 'Uppnådd' : breakEven.breakEvenMonth > 0 ? `Månad ${breakEven.breakEvenMonth}` : 'Ej uppnådd'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Estimerat Datum</span>
            </div>
            <p className="text-2xl font-bold">
              {breakEven.breakEvenDate ? format(breakEven.breakEvenDate, 'PP', { locale: sv }) : 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Månadsvinst</span>
            </div>
            <p className="text-2xl font-bold">{breakEven.monthlyProfit.toLocaleString('sv-SE')} kr</p>
          </div>
        </div>
      </PremiumCardContent>
    </PremiumCard>
  );
}