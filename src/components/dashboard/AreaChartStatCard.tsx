import React, { useState } from 'react';
import { CardEnhanced, CardEnhancedContent } from '@/components/ui/card-enhanced';
import { LucideIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export interface AreaChartStatCardProps {
  title: string;
  value: string | number;
  period?: string;
  icon: LucideIcon;
  chartData: { value: number }[];
  color: string;
  gradientId: string;
  formatValue?: (val: number) => string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function AreaChartStatCard({
  title,
  value,
  period = 'Senaste 15 dagarna',
  icon: Icon,
  chartData,
  color,
  gradientId,
  formatValue,
  trend,
}: AreaChartStatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300",
        "hover:shadow-elegant hover:scale-[1.02] hover:-translate-y-1",
        "bg-gradient-to-br from-background via-background to-primary/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background snowflake decoration */}
      <div className="absolute -top-8 -right-8 w-32 h-32 opacity-[0.03] pointer-events-none transition-all duration-500 group-hover:opacity-[0.06] group-hover:rotate-12">
        <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain" />
      </div>

      {/* Gradient overlay on hover */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 transition-opacity duration-300",
        isHovered && "opacity-100"
      )} />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardEnhancedContent className="space-y-5 relative z-10">
        {/* Header med ikon och titel */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "group-hover:scale-110 group-hover:rotate-3"
          )}>
            <Icon className="size-5" style={{ color }} />
          </div>
          <span className="text-base font-semibold text-foreground transition-all duration-300 group-hover:text-primary">{title}</span>
        </div>

        <div className="flex items-end gap-2.5 justify-between">
          {/* Detaljer */}
          <div className="flex flex-col gap-1">
            {/* Period */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">{period}</div>

            {/* Värde */}
            <div className="text-3xl font-bold text-foreground tracking-tight transition-all duration-300 group-hover:text-primary">
              {value}
            </div>

            {/* Trend */}
            {trend && (
              <div className={cn(
                "text-xs font-medium transition-all duration-300",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value).toFixed(1)}%
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="max-w-40 h-16 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 5,
                  left: 5,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                  <filter id={`dotShadow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                  </filter>
                </defs>

                <Tooltip
                  cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '2 2' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      const displayValue = formatValue ? formatValue(val) : val.toLocaleString('sv-SE');

                      return (
                        <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-elegant rounded-lg p-2 pointer-events-none">
                          <p className="text-sm font-semibold text-popover-foreground">{displayValue}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={`url(#${gradientId})`}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: color,
                    stroke: 'hsl(var(--background))',
                    strokeWidth: 2,
                    filter: `url(#dotShadow-${gradientId})`,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardEnhancedContent>

      {/* Bottom gradient bar */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )} />
    </div>
  );
}

