'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/line-charts-9';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

interface RevenueTrendLineChartProps {
  data: Array<{
    date: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
}

// Chart configuration with green growth theme
const chartConfig = {
  revenue: {
    label: 'Intäkt',
    color: 'hsl(142, 76%, 36%)', // Growth green
  },
  profit: {
    label: 'Vinst',
    color: 'hsl(158, 64%, 52%)', // Teal green
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      revenue: number;
      profit: number;
      cost: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const profitPercentage = data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-xl animate-fade-in">
        <div className="text-sm text-muted-foreground mb-2 font-medium">
          {format(parseISO(data.date), 'dd MMM yyyy', { locale: sv })}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Intäkt:</span>
            <span className="font-semibold">{data.revenue.toLocaleString('sv-SE')} kr</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">Kostnad:</span>
            <span className="font-semibold text-red-600">{data.cost.toLocaleString('sv-SE')} kr</span>
          </div>
          <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
            <span className="text-xs text-muted-foreground">Vinst:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[hsl(142,76%,36%)]">
                {data.profit.toLocaleString('sv-SE')} kr
              </span>
              <span className="text-xs text-emerald-600">({profitPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueTrendLineChart({ data }: RevenueTrendLineChartProps) {
  // Calculate metrics
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit, 0);
  const avgRevenue = totalRevenue / data.length;
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;
  
  // Find highest revenue day
  const highestDay = data.reduce((max, item) => item.revenue > max.revenue ? item : max, data[0]);
  const lowestDay = data.reduce((min, item) => item.revenue < min.revenue ? item : min, data[0]);

  // Calculate growth
  const firstRevenue = data[0]?.revenue || 0;
  const lastRevenue = data[data.length - 1]?.revenue || 0;
  const growth = firstRevenue > 0 ? (((lastRevenue - firstRevenue) / firstRevenue) * 100).toFixed(1) : 0;

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="flex flex-col items-stretch gap-5 p-6">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-base text-muted-foreground font-medium mb-1">Intäktsutveckling</h1>
          <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-3.5">
            <span className="text-4xl font-bold text-[hsl(142,76%,36%)]">
              {totalRevenue.toLocaleString('sv-SE')} kr
            </span>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{Number(growth) > 0 ? '+' : ''}{growth}%</span>
              <span className="text-muted-foreground font-normal text-sm">tillväxt</span>
            </div>
          </div>
        </div>

        <div className="grow">
          {/* Stats Row */}
          <div className="flex items-center justify-between flex-wrap gap-2.5 text-sm mb-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Genomsnitt/dag:</span>
                <span className="font-semibold">{avgRevenue.toLocaleString('sv-SE')} kr</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Vinstmarginal:</span>
                <span className="font-semibold text-[hsl(142,76%,36%)]">{profitMargin}%</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground text-xs">
              <span>
                Högst: <span className="text-emerald-600 font-medium">{highestDay?.revenue.toLocaleString('sv-SE')} kr</span>
              </span>
              <span>
                Lägst: <span className="text-yellow-600 font-medium">{lowestDay?.revenue.toLocaleString('sv-SE')} kr</span>
              </span>
            </div>
          </div>

          {/* Chart */}
          <ChartContainer
            config={chartConfig}
            className="h-80 w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
          >
            <ComposedChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartConfig.revenue.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartConfig.revenue.color} stopOpacity={0.05} />
                </linearGradient>
                <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1" fill="var(--input)" fillOpacity="0.2" />
                </pattern>
                <filter id="lineShadow" x="-100%" y="-100%" width="300%" height="300%">
                  <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="hsl(142, 76%, 36%)" floodOpacity="0.3" />
                </filter>
                <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.3)" />
                </filter>
              </defs>

              <rect x="0" y="0" width="100%" height="100%" fill="url(#dotGrid)" style={{ pointerEvents: 'none' }} />

              <CartesianGrid
                strokeDasharray="3 6"
                stroke="var(--border)"
                strokeOpacity={0.5}
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={12}
                interval="preserveStartEnd"
                tickFormatter={(value) => format(parseISO(value), 'dd MMM', { locale: sv })}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tickMargin={10}
              />

              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{ strokeDasharray: '3 3', stroke: 'var(--muted-foreground)', strokeOpacity: 0.3 }}
              />

              {/* Revenue Line with gradient fill */}
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartConfig.revenue.color}
                strokeWidth={3}
                filter="url(#lineShadow)"
                fill="url(#revenueGradient)"
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const currentRevenue = typeof payload.revenue === 'number' ? payload.revenue : parseFloat(payload.revenue as string);
                  // Highlight peaks and valleys
                  if (currentRevenue === highestDay?.revenue || currentRevenue === lowestDay?.revenue) {
                    return (
                      <circle
                        key={`dot-${payload.date}`}
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={chartConfig.revenue.color}
                        stroke="white"
                        strokeWidth={2}
                        filter="url(#dotShadow)"
                        className="animate-scale-in"
                      />
                    );
                  }
                  return <g key={`dot-${payload.date}`} />;
                }}
                activeDot={{
                  r: 7,
                  fill: chartConfig.revenue.color,
                  stroke: 'white',
                  strokeWidth: 3,
                  filter: 'url(#dotShadow)',
                  className: 'animate-scale-in',
                }}
              />

              {/* Profit Line */}
              <Line
                type="monotone"
                dataKey="profit"
                stroke={chartConfig.profit.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: chartConfig.profit.color,
                  stroke: 'white',
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ChartContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded-full bg-[hsl(142,76%,36%)]" />
              <span className="text-muted-foreground">Intäkt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 rounded-full bg-[hsl(158,64%,52%)] opacity-60" style={{ backgroundImage: 'repeating-linear-gradient(to right, hsl(158,64%,52%) 0, hsl(158,64%,52%) 5px, transparent 5px, transparent 10px)' }} />
              <span className="text-muted-foreground">Vinst</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
