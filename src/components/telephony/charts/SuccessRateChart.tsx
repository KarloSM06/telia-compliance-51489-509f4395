import { Card } from "@/components/ui/card";
import { Area, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";

interface SuccessRateChartProps {
  data: Array<{
    date: string;
    successRate: number;
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
  }>;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  
  const data = payload[0]?.payload;
  if (!data) return null;
  
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
      <p className="font-semibold mb-2 text-sm">
        {format(new Date(label), 'dd MMMM yyyy', { locale: sv })}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Success Rate:</span>
          <span className="font-semibold text-green-500">{data.successRate.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Lyckade:</span>
          <span className="font-semibold">{data.successfulCalls}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Misslyckade:</span>
          <span className="font-semibold text-red-500">{data.failedCalls}</span>
        </div>
        <div className="border-t border-border pt-1.5 flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Totalt:</span>
          <span className="font-semibold">{data.totalCalls}</span>
        </div>
      </div>
    </div>
  );
};

export const SuccessRateChart = ({ data, isLoading }: SuccessRateChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[400px] animate-pulse" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Success Rate</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <CheckCircle2 className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  // Calculate average success rate
  const avgSuccessRate = data.reduce((sum, d) => sum + d.successRate, 0) / data.length;
  
  // Find best day
  const bestDay = data.reduce((best, current) => 
    current.successRate > best.successRate ? current : best
  );

  // Calculate trend (first half vs second half)
  const midpoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midpoint);
  const secondHalf = data.slice(midpoint);
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.successRate, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.successRate, 0) / secondHalf.length;
  const trend = secondAvg - firstAvg;

  const getSuccessColor = (rate: number) => {
    if (rate >= 80) return 'hsl(158, 64%, 52%)'; // Green
    if (rate >= 60) return 'hsl(38, 92%, 50%)'; // Amber
    return 'hsl(0, 84%, 60%)'; // Red
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Success Rate</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Genomsnitt:</span>
            <span className="font-semibold" style={{ color: getSuccessColor(avgSuccessRate) }}>
              {avgSuccessRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-muted" 
            strokeOpacity={0.3}
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: sv })}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
          />
          <YAxis 
            yAxisId="left"
            tickFormatter={(value) => `${value}%`}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={40}
            domain={[0, 100]}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar 
            yAxisId="right"
            dataKey="totalCalls" 
            fill="hsl(var(--muted))" 
            opacity={0.2}
            radius={[4, 4, 0, 0]}
          />
          
          <Area
            yAxisId="left"
            type="natural"
            dataKey="successRate"
            stroke={getSuccessColor(avgSuccessRate)}
            fill={getSuccessColor(avgSuccessRate)}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
        <span>Bästa dag: </span>
        <span className="font-semibold text-foreground">
          {format(new Date(bestDay.date), 'dd MMM', { locale: sv })} ({bestDay.successRate.toFixed(1)}%)
        </span>
      </div>
    </Card>
  );
};
