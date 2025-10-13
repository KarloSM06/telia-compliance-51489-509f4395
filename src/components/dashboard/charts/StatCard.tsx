import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SparklineComponent } from "./SparklineComponent";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  sparklineData?: { value: number }[];
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export const StatCard = ({
  title,
  value,
  change,
  changeLabel,
  sparklineData,
  icon,
  trend,
}: StatCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card className="transition-all hover:shadow-lg group overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
            <p className="text-4xl font-bold tracking-tight">{value}</p>
          </div>
          {icon && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-transform group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {change !== undefined && (
            <div className={cn("flex items-center gap-1.5 text-sm font-medium", getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(change)}%</span>
              {changeLabel && <span className="text-muted-foreground ml-1 font-normal">{changeLabel}</span>}
            </div>
          )}
          
          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-3 -mb-2">
              <SparklineComponent data={sparklineData} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
