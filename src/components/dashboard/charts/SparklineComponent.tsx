import { Line, LineChart, ResponsiveContainer } from "recharts";

interface SparklineData {
  value: number;
}

interface SparklineComponentProps {
  data: SparklineData[];
  color?: string;
  height?: number;
}

export const SparklineComponent = ({
  data,
  color = "hsl(43, 96%, 56%)",
  height = 40,
}: SparklineComponentProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
