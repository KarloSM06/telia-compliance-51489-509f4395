import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface CumulativeRevenueChartProps {
  data: Array<{ date: string; revenue: number; costs: number }>;
  isLoading?: boolean;
}

export const CumulativeRevenueChart = ({ data, isLoading }: CumulativeRevenueChartProps) => {
  const chartData = useMemo(() => {
    let cumulativeRevenue = 0;
    let cumulativeCosts = 0;
    
    return data.map(d => {
      cumulativeRevenue += d.revenue;
      cumulativeCosts += d.costs;
      return {
        date: d.date,
        intäkter: cumulativeRevenue,
        kostnader: cumulativeCosts
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Kumulativ utveckling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Kumulativ utveckling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Kumulativ utveckling
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cumulativeRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="cumulativeCostsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number) => [`${value.toFixed(2)} SEK`]}
              labelFormatter={(label) => new Date(label).toLocaleDateString('sv-SE')}
            />
            <Area
              type="monotone"
              dataKey="intäkter"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              fill="url(#cumulativeRevenueGradient)"
              name="Kumulativa intäkter"
            />
            <Area
              type="monotone"
              dataKey="kostnader"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fill="url(#cumulativeCostsGradient)"
              name="Kumulativa kostnader"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
