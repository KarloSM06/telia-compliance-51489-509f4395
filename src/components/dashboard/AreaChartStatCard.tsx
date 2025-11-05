import React from 'react';
import { CardEnhanced, CardEnhancedContent } from '@/components/ui/card-enhanced';
import { LucideIcon } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

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
  return (
    <CardEnhanced className="group transition-all duration-300 hover:shadow-card hover:scale-[1.02]">
      <CardEnhancedContent className="space-y-5">
        {/* Header med ikon och titel */}
        <div className="flex items-center gap-2">
          <Icon className="size-5" style={{ color }} />
          <span className="text-base font-semibold text-foreground">{title}</span>
        </div>

        <div className="flex items-end gap-2.5 justify-between">
          {/* Detaljer */}
          <div className="flex flex-col gap-1">
            {/* Period */}
            <div className="text-sm text-muted-foreground whitespace-nowrap">{period}</div>

            {/* Värde */}
            <div className="text-3xl font-bold text-foreground tracking-tight">{value}</div>

            {/* Trend */}
            {trend && (
              <div className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
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
                        <div className="bg-popover/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-2 pointer-events-none">
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
    </CardEnhanced>
  );
}
