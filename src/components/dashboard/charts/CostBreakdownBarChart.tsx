import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/area-charts-2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CostBreakdownBarChartProps {
  telephonyCost: number;
  smsCost: number;
  emailCost: number;
  aiCost: number;
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

export function CostBreakdownBarChart({
  telephonyCost,
  smsCost,
  emailCost,
  aiCost,
}: CostBreakdownBarChartProps) {
  const data = [
    {
      category: 'Telefoni',
      value: telephonyCost,
      fill: 'var(--color-telephony)',
    },
    {
      category: 'SMS',
      value: smsCost,
      fill: 'var(--color-sms)',
    },
    {
      category: 'Email',
      value: emailCost,
      fill: 'var(--color-email)',
    },
    {
      category: 'AI',
      value: aiCost,
      fill: 'var(--color-ai)',
    },
  ];

  const totalCost = telephonyCost + smsCost + emailCost + aiCost;

  return (
    <Card className="border border-primary/20 bg-gradient-to-br from-background to-primary/[0.02] shadow-[0_8px_30px_-8px_hsl(222_47%_11%/0.15)] hover:shadow-[0_20px_60px_-15px_hsl(222_47%_11%/0.25)] transition-all duration-500">
      <CardHeader className="border-0 pt-6 pb-4">
        <CardTitle className="text-lg font-semibold text-primary">Kostnadsfördelning</CardTitle>
        <p className="text-sm text-muted-foreground">
          Totalt: {totalCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
        </p>
      </CardHeader>
      <CardContent className="ps-2 pe-4 pb-6">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
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
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(222 47% 11% / 0.6)' }}
              tickMargin={10}
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
                />
              }
              cursor={{ fill: 'hsl(222 47% 11% / 0.05)', opacity: 0.15 }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
