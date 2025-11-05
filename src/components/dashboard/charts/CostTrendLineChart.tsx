import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/line-charts-4';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CostTrendLineChartProps {
  data: Array<{
    date: string;
    telephony: number;
    sms: number;
    email: number;
    ai: number;
    hiems: number;
  }>;
}

const chartConfig = {
  telephony: {
    label: 'Telefoni',
    color: 'hsl(142, 76%, 36%)',
  },
  sms: {
    label: 'SMS',
    color: 'hsl(168, 76%, 42%)',
  },
  email: {
    label: 'Email',
    color: 'hsl(189, 94%, 43%)',
  },
  ai: {
    label: 'AI & Modeller',
    color: 'hsl(217, 91%, 60%)',
  },
  hiems: {
    label: 'Hiems Plattform',
    color: 'hsl(271, 70%, 60%)',
  },
} satisfies ChartConfig;

export function CostTrendLineChart({ data }: CostTrendLineChartProps) {
  return (
    <Card className="border-2 border-primary/10 shadow-lg shadow-primary/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-0 pt-6 pb-4">
        <CardTitle className="text-lg font-semibold">Kostnadsutveckling över tid</CardTitle>
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
              stroke="var(--input)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickMargin={10}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
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
              cursor={{ strokeDasharray: '3 3', stroke: 'var(--input)' }}
            />
            <Line dataKey="telephony" type="monotone" stroke="var(--color-telephony)" strokeWidth={2} dot={false} />
            <Line dataKey="sms" type="monotone" stroke="var(--color-sms)" strokeWidth={2} dot={false} />
            <Line dataKey="email" type="monotone" stroke="var(--color-email)" strokeWidth={2} dot={false} />
            <Line dataKey="ai" type="monotone" stroke="var(--color-ai)" strokeWidth={2} dot={false} />
            <Line dataKey="hiems" type="monotone" stroke="var(--color-hiems)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
