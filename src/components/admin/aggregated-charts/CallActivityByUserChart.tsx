import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

interface CallActivityByUserChartProps {
  data: Array<{
    userName: string;
    calls: number;
    sms: number;
  }>;
}

export const CallActivityByUserChart = ({ data }: CallActivityByUserChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Samtalsaktivitet per Användare</CardTitle>
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
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar 
              dataKey="calls" 
              name="Samtal" 
              fill="hsl(var(--chart-1))" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="sms" 
              name="SMS" 
              fill="hsl(var(--chart-2))" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
