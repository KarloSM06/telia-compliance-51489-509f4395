import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function PremiumStatCard({
  title,
  value,
  icon,
  trend,
  className
}: PremiumStatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-6 shadow-elegant transition-all hover:shadow-xl hover:shadow-white/5 hover:border-white/20 hover:bg-white/10 hover-scale",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary/80">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}