import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CompactChartWrapper } from "./CompactChartWrapper";

interface BarChartData {
  name: string;
  [key: string]: string | number;
}

interface CompactBarChartProps {
  title: string;
  data: BarChartData[];
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey?: string;
  height?: number;
}

export const CompactBarChart = ({
  title,
  data,
  dataKeys,
  xAxisKey = "name",
  height = 180,
}: CompactBarChartProps) => {
  return (
    <CompactChartWrapper title={title} height={height}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
          <XAxis
            dataKey={xAxisKey}
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          {dataKeys.map((dk) => (
            <Bar key={dk.key} dataKey={dk.key} fill={dk.color} name={dk.name} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </CompactChartWrapper>
  );
};
