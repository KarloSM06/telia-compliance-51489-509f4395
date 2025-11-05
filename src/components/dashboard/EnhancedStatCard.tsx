import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

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

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover/95 p-2.5 text-sm shadow-elegant backdrop-blur-sm">
        <p className="font-medium text-popover-foreground">
          Värde: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

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
  const isPositive = trend?.isPositive ?? true;
  const chartColor = isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)';

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-card",
        "transition-all duration-500 ease-smooth",
        "hover:shadow-elegant hover:scale-[1.02] hover:-translate-y-1",
        "bg-gradient-to-br from-card via-card to-primary/5",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Gradient overlay on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
          "from-primary/0 via-primary/0 to-primary/10 group-hover:opacity-100"
        )} 
      />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {title}
          </h3>
          {icon && (
            <div className={cn(
              "p-2.5 rounded-lg transition-all duration-300",
              "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-110 group-hover:rotate-3"
            )}>
              <div className={cn("h-5 w-5 text-primary", color)}>
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Value and Chart */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary">
              {value}
            </p>
            {trend && (
              <p className={cn(
                "text-xs font-medium transition-colors duration-300",
                isPositive 
                  ? "text-success group-hover:text-success/90" 
                  : "text-destructive group-hover:text-destructive/90"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}% {trend.label || ''}
              </p>
            )}
            {subtitle && !trend && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Sparkline Chart */}
          {sparklineData && sparklineData.length > 0 && (
            <div className="h-14 w-28 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={chartColor} 
                        stopOpacity={0.3} 
                      />
                      <stop 
                        offset="95%" 
                        stopColor={chartColor} 
                        stopOpacity={0} 
                      />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: 'hsl(var(--border))',
                      strokeWidth: 1,
                      strokeDasharray: '3 3',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2}
                    fill={`url(#gradient-${title})`}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1",
        "bg-gradient-to-r from-primary/0 via-primary to-primary/0",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      )} />
    </div>
  );
}
