import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CompactChartWrapper } from "./CompactChartWrapper";

interface PieChartData {
  name: string;
  value: number;
}

interface CompactPieChartProps {
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

export const CompactPieChart = ({
  title,
  data,
  colors = DEFAULT_COLORS,
  height = 180,
  innerRadius = 0,
}: CompactPieChartProps) => {
  return (
    <CompactChartWrapper title={title} height={height}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={Math.min(height * 0.35, 70)}
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
            height={24}
            wrapperStyle={{ fontSize: "10px" }}
            formatter={(value, entry: any) => `${value} (${entry.payload.value})`}
          />
        </PieChart>
      </ResponsiveContainer>
    </CompactChartWrapper>
  );
};
