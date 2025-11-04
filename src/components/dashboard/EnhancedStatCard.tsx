import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, TrendingUp, Info } from "lucide-react";
import { SparklineComponent } from "./charts/SparklineComponent";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  sparklineData?: { value: number }[];
  subtitle?: string;
  tooltip?: string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function EnhancedStatCard({
  title,
  value,
  icon,
  trend,
  sparklineData,
  subtitle,
  tooltip,
  color = "text-primary",
  className,
  onClick,
}: EnhancedStatCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [count, setCount] = useState(0);

  // Simple count-up animation on mount
  React.useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  const displayValue = typeof value === 'number' ? count : value;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300",
        "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1",
        "bg-gradient-to-br from-background via-background to-primary/5",
        onClick && "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100"
      )} />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              {tooltip && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-3xl font-bold tracking-tight transition-all duration-300 group-hover:text-primary">
              {displayValue}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300",
              "bg-gradient-to-br from-primary/10 to-primary/5",
              "group-hover:scale-110 group-hover:rotate-3",
              color
            )}>
              {icon}
            </div>
          )}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-all duration-300",
            trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
          )}>
            {trend.isPositive ? (
              <ArrowUp className="h-4 w-4 animate-bounce" />
            ) : (
              <ArrowDown className="h-4 w-4 animate-bounce" />
            )}
            <span>{Math.abs(trend.value)}%</span>
            {trend.label && (
              <span className="text-muted-foreground font-normal ml-1">
                {trend.label}
              </span>
            )}
          </div>
        )}

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className={cn(
            "transition-opacity duration-300 -mx-2 -mb-2",
            isHovered ? "opacity-100" : "opacity-70"
          )}>
            <SparklineComponent 
              data={sparklineData} 
              color={trend?.isPositive ? "hsl(142, 76%, 36%)" : "hsl(var(--primary))"}
              height={50}
            />
          </div>
        )}
      </div>

      {/* Bottom gradient bar */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )} />
    </div>
  );
}

// Add React import for useEffect
import * as React from "react";
