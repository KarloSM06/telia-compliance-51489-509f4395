import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { TopicDistribution as TopicDistributionType } from "@/hooks/useReviewInsights";

interface TopicDistributionProps {
  distribution: TopicDistributionType;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

export const TopicDistribution = ({ distribution }: TopicDistributionProps) => {
  if (!distribution?.categories || distribution.categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ämnesfördelning</CardTitle>
          <CardDescription>Kategorier av kundinteraktioner</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Ingen data tillgänglig för ämnesfördelning
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = distribution.categories.map(cat => ({
    name: cat.name,
    value: cat.count,
    percentage: cat.percentage
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ämnesfördelning</CardTitle>
        <CardDescription>
          {distribution.categories.reduce((sum, cat) => sum + cat.count, 0)} interaktioner analyserade
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any, props: any) => [
                  `${value} (${props.payload.percentage.toFixed(1)}%)`,
                  props.payload.name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
