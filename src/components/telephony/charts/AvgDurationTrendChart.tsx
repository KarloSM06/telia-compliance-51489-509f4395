import { Card } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";

interface AvgDurationTrendChartProps {
  data: Array<{
    date: string;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    movingAverage: number;
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
          <span className="text-muted-foreground">Genomsnitt:</span>
          <span className="font-semibold">{data.avgDuration.toFixed(1)} min</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-muted-foreground">7-dagars:</span>
          <span className="font-semibold text-primary">{data.movingAverage.toFixed(1)} min</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>Min - Max:</span>
          <span>{data.minDuration.toFixed(1)} - {data.maxDuration.toFixed(1)} min</span>
        </div>
      </div>
    </div>
  );
};

export const AvgDurationTrendChart = ({ data, isLoading }: AvgDurationTrendChartProps) => {
  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[350px] animate-pulse" />
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Genomsnittlig Samtalstid</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Clock className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  // Calculate trend
  const firstHalf = data.slice(0, Math.floor(data.length / 2));
  const secondHalf = data.slice(Math.floor(data.length / 2));
  const firstAvg = firstHalf.reduce((sum, d) => sum + d.avgDuration, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, d) => sum + d.avgDuration, 0) / secondHalf.length;
  const trend = secondAvg - firstAvg;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Genomsnittlig Samtalstid</h3>
        </div>
        <div className="flex items-center gap-1 text-xs">
          {trend >= 0 ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)} min
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
            tickFormatter={(value) => `${value.toFixed(0)} min`}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px', fontSize: '10px' }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            type="natural"
            dataKey="avgDuration"
            stroke="hsl(217, 91%, 60%)"
            strokeWidth={2}
            dot={{ r: 2, strokeWidth: 1 }}
            activeDot={{ r: 4, strokeWidth: 1 }}
            name="Dagligt genomsnitt"
          />
          <Line
            type="natural"
            dataKey="movingAverage"
            stroke="hsl(271, 70%, 60%)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="7-dagars glidande medel"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
