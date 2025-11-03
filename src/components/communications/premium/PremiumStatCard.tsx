import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import hiemsLogo from "@/assets/hiems-logo-snowflake.png";

interface PremiumStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "primary" | "secondary" | "success" | "warning" | "violet";
  isLoading?: boolean;
}

export const PremiumStatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "primary",
  isLoading,
}: PremiumStatCardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5",
    secondary: "from-secondary/20 to-secondary/5",
    success: "from-success/20 to-success/5",
    warning: "from-warning/20 to-warning/5",
    violet: "from-violet-500/20 to-violet-500/5",
  };

  const iconColorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    violet: "text-violet-500",
  };

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md h-[160px]">
        <div className="p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-muted rounded w-2/3 mb-2"></div>
          <div className="h-3 bg-muted rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-border/50 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-md hover:shadow-elegant hover:-translate-y-1 transition-all duration-500 group">
      {/* Snowflake background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 opacity-[0.03] pointer-events-none">
        <img 
          src={hiemsLogo} 
          alt="" 
          className="w-full h-full object-contain animate-[spin_60s_linear_infinite] group-hover:animate-[spin_30s_linear_infinite]"
        />
      </div>

      {/* Radial gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-50`} />

      <div className="relative p-6">
        {/* Icon and title */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} border border-border/30`}>
            <Icon className={`h-5 w-5 ${iconColorClasses[color]}`} />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span className={trend.value >= 0 ? "text-success" : "text-destructive"}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} blur-xl`} />
      </div>
    </Card>
  );
};
