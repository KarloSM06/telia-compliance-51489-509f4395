import { PremiumStatCard } from "@/components/ui/premium-stat-card";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

interface SpendOverviewProps {
  totalSpend: number;
  monthlyChange?: number;
  projectedMonthly?: number;
}

export const SpendOverview = ({ 
  totalSpend, 
  monthlyChange,
  projectedMonthly 
}: SpendOverviewProps) => {
  const formatSEK = (amount: number) => {
    return `${amount.toFixed(2)} SEK`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <PremiumStatCard
        title="Total Användning"
        value={formatSEK(totalSpend)}
        icon={<DollarSign className="h-6 w-6" />}
      />
      
      {monthlyChange !== undefined && (
        <PremiumStatCard
          title="Månatlig Förändring"
          value={formatSEK(Math.abs(monthlyChange))}
          icon={<TrendingUp className="h-6 w-6" />}
          trend={{
            value: monthlyChange,
            isPositive: monthlyChange >= 0
          }}
        />
      )}
      
      {projectedMonthly !== undefined && (
        <PremiumStatCard
          title="Projicerad Månadskostnad"
          value={formatSEK(projectedMonthly)}
          icon={<Calendar className="h-6 w-6" />}
        />
      )}
    </div>
  );
};
