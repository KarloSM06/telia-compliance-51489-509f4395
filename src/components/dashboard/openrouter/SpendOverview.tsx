import { PremiumStatCard } from "@/components/ui/premium-stat-card";
import { DollarSign, TrendingUp, Calendar, Activity } from "lucide-react";

interface SpendOverviewProps {
  totalSpend: number;
  averageDailyCost: number;
  highestCostDay: number;
  periodDays: number;
}

export const SpendOverview = ({ 
  totalSpend, 
  averageDailyCost,
  highestCostDay,
  periodDays
}: SpendOverviewProps) => {
  const formatSEK = (amount: number) => {
    return `${amount.toFixed(2)} SEK`;
  };

  // Calculate projected monthly cost based on average
  const projectedMonthly = averageDailyCost * 30;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <PremiumStatCard
        title="Total Kostnad"
        value={formatSEK(totalSpend)}
        icon={<DollarSign className="h-6 w-6" />}
      />
      
      <PremiumStatCard
        title="Genomsnitt/Dag"
        value={formatSEK(averageDailyCost)}
        icon={<Activity className="h-6 w-6" />}
      />
      
      <PremiumStatCard
        title="Högsta Dag"
        value={formatSEK(highestCostDay)}
        icon={<TrendingUp className="h-6 w-6" />}
      />
      
      <PremiumStatCard
        title="Projicerad Månad"
        value={formatSEK(projectedMonthly)}
        icon={<Calendar className="h-6 w-6" />}
      />
    </div>
  );
};
