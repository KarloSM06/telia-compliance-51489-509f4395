import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/area-charts-2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CostTrendLineChartProps {
  data: Array<{
    date: string;
    telephony: number;
    sms: number;
    email: number;
    ai: number;
  }>;
}

const chartConfig = {
  telephony: {
    label: 'Telefoni',
    color: 'hsl(222, 47%, 25%)',
  },
  sms: {
    label: 'SMS',
    color: 'hsl(222, 47%, 35%)',
  },
  email: {
    label: 'Email',
    color: 'hsl(222, 47%, 45%)',
  },
  ai: {
    label: 'AI & Modeller',
    color: 'hsl(222, 47%, 55%)',
  },
} satisfies ChartConfig;

export function CostTrendLineChart({ data }: CostTrendLineChartProps) {
  return (
    <Card className="border border-primary/20 bg-gradient-to-br from-background to-primary/[0.02] shadow-[0_8px_30px_-8px_hsl(222_47%_11%/0.15)] hover:shadow-[0_20px_60px_-15px_hsl(222_47%_11%/0.25)] transition-all duration-500">
      <CardHeader className="border-0 pt-6 pb-4">
        <CardTitle className="text-lg font-semibold text-primary">Kostnadsutveckling över tid</CardTitle>
        <p className="text-sm text-muted-foreground">Dagliga kostnader per kategori</p>
      </CardHeader>
      <CardContent className="ps-2 pe-4 pb-6">
        <ChartContainer
          config={chartConfig}
          className="h-[280px] w-full [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
        >
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="hsl(222 47% 11% / 0.1)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(222 47% 11% / 0.6)' }}
              tickMargin={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(222 47% 11% / 0.6)' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              tickMargin={10}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' });
                  }}
                />
              }
              cursor={{ strokeDasharray: '3 3', stroke: 'hsl(222 47% 11% / 0.2)' }}
            />
            <Line dataKey="telephony" type="monotone" stroke="var(--color-telephony)" strokeWidth={2} dot={false} />
            <Line dataKey="sms" type="monotone" stroke="var(--color-sms)" strokeWidth={2} dot={false} />
            <Line dataKey="email" type="monotone" stroke="var(--color-email)" strokeWidth={2} dot={false} />
            <Line dataKey="ai" type="monotone" stroke="var(--color-ai)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
