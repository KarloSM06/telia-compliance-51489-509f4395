import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
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
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
