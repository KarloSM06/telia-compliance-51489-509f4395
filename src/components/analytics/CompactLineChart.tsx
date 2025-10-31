import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CompactChartWrapper } from "./CompactChartWrapper";

interface LineChartData {
  name: string;
  [key: string]: string | number;
}

interface CompactLineChartProps {
  title: string;
  data: LineChartData[];
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey?: string;
  height?: number;
}

export const CompactLineChart = ({
  title,
  data,
  dataKeys,
  xAxisKey = "name",
  height = 180,
}: CompactLineChartProps) => {
  return (
    <CompactChartWrapper title={title} height={height}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
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
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              stroke={dk.color}
              strokeWidth={2}
              dot={{ r: 3, fill: dk.color }}
              activeDot={{ r: 5 }}
              name={dk.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </CompactChartWrapper>
  );
};
