import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { SparklineComponent } from "@/components/dashboard/charts/SparklineComponent";

interface MiniMetricCardProps {
  title: string;
  value: string | number;
  sparklineData?: number[];
  trend?: { value: number; isPositive: boolean };
  icon?: LucideIcon;
  className?: string;
}

export const MiniMetricCard = ({ 
  title, 
  value, 
  sparklineData, 
  trend, 
  icon: Icon,
  className 
}: MiniMetricCardProps) => {
  return (
    <Card className={cn("p-3 hover:shadow-lg transition-all duration-300", className)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground truncate">{title}</span>
        {Icon && <Icon className="h-3 w-3 text-primary/60 flex-shrink-0" />}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold leading-none">{value}</span>
        {trend && (
          <span className={cn(
            "text-xs font-semibold",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? '↑' : '↓'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      {sparklineData && sparklineData.length > 0 && (
        <div className="h-10 -mx-1">
          <SparklineComponent 
            data={sparklineData.map(v => ({ value: v }))} 
            height={40}
            color="hsl(43, 96%, 56%)"
          />
        </div>
      )}
    </Card>
  );
};
