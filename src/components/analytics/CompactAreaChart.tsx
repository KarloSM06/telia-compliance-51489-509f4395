import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CompactChartWrapper } from "./CompactChartWrapper";

interface AreaChartData {
  name: string;
  [key: string]: string | number;
}

interface CompactAreaChartProps {
  title: string;
  data: AreaChartData[];
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey?: string;
  height?: number;
}

export const CompactAreaChart = ({
  title,
  data,
  dataKeys,
  xAxisKey = "name",
  height = 180,
}: CompactAreaChartProps) => {
  return (
    <CompactChartWrapper title={title} height={height}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            {dataKeys.map((dk) => (
              <linearGradient key={dk.key} id={`compact-gradient-${dk.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dk.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={dk.color} stopOpacity={0.05} />
              </linearGradient>
            ))}
          </defs>
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
            <Area
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              stroke={dk.color}
              strokeWidth={2}
              fill={`url(#compact-gradient-${dk.key})`}
              name={dk.name}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </CompactChartWrapper>
  );
};
