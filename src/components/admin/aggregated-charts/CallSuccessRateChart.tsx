import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

interface CallSuccessRateChartProps {
  data: Array<{
    userName: string;
    successRate: number;
    totalCalls: number;
  }>;
}

export const CallSuccessRateChart = ({ data }: CallSuccessRateChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Framgångsfrekvens per Användare</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="userName" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'successRate') return [`${value.toFixed(1)}%`, 'Framgång'];
                return [value, 'Totalt'];
              }}
            />
            <Legend />
            <Bar 
              dataKey="successRate" 
              name="Framgångsfrekvens (%)" 
              fill="hsl(var(--chart-4))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
