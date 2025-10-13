import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartToolbar } from "./ChartToolbar";

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartComponentProps {
  title: string;
  data: PieChartData[];
  colors?: string[];
  height?: number;
  innerRadius?: number;
}

const DEFAULT_COLORS = [
  "hsl(43, 96%, 56%)", // Gold
  "hsl(222, 47%, 18%)", // Dark blue
  "hsl(142, 76%, 36%)", // Success green
  "hsl(38, 92%, 50%)", // Warning orange
  "hsl(0, 84%, 60%)", // Violation red
  "hsl(217, 32%, 17%)", // Secondary
];

export const PieChartComponent = ({
  title,
  data,
  colors = DEFAULT_COLORS,
  height = 300,
  innerRadius = 0,
}: PieChartComponentProps) => {
  return (
    <Card className="transition-all hover:shadow-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <ChartToolbar showChartType={false} />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => `${value} (${entry.payload.value})`}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
