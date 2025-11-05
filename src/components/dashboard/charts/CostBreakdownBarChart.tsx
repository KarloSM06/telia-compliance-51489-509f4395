import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/line-charts-4';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Phone, MessageSquare, Mail, Brain, CheckCircle } from 'lucide-react';

interface CostBreakdownBarChartProps {
  telephonyCost: number;
  smsCost: number;
  emailCost: number;
  aiCost: number;
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
    <Card className="border-2 border-primary/10 shadow-lg shadow-primary/5 hover:border-primary/20 hover:shadow-xl transition-all duration-300">
      <CardHeader className="border-0 pt-6 pb-4">
        <CardTitle className="text-lg font-semibold">Kostnadsfördelning</CardTitle>
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
              stroke="var(--input)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              tickMargin={10}
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
                />
              }
              cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
