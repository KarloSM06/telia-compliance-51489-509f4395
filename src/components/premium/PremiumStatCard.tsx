import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { PremiumCard } from "./PremiumCard";

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
}

export const PremiumStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  iconColor = "text-primary"
}: PremiumStatCardProps) => (
  <PremiumCard>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg bg-primary/10`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      {trend && (
        <div className={`text-sm font-semibold flex items-center gap-1 ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
    <p className="text-sm text-muted-foreground mb-1">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </PremiumCard>
);
