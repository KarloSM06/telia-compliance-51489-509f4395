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
    <Card className="transition-all hover:shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        
        <div className="space-y-2">
          <p className="text-3xl font-bold">{value}</p>
          
          {change !== undefined && (
            <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
              {getTrendIcon()}
              <span className="font-medium">{Math.abs(change)}%</span>
              {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
            </div>
          )}
          
          {sparklineData && sparklineData.length > 0 && (
            <div className="mt-4">
              <SparklineComponent data={sparklineData} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
