import { Line } from 'recharts';
import { useMemo } from 'react';

interface MovingAverageLineProps {
  data: any[];
  dataKey: string;
  period?: number;
  color?: string;
  name?: string;
}

export const MovingAverageLine = ({
  data,
  dataKey,
  period = 7,
  color = 'hsl(var(--muted-foreground))',
  name = 'Glidande medelvärde',
}: MovingAverageLineProps) => {
  const maData = useMemo(() => {
    if (!data || data.length < period) return data;

    return data.map((item, index) => {
      if (index < period - 1) {
        return { ...item, [`${dataKey}_ma`]: null };
      }

      const slice = data.slice(index - period + 1, index + 1);
      const sum = slice.reduce((acc, curr) => acc + (curr[dataKey] || 0), 0);
      const avg = sum / period;

      return { ...item, [`${dataKey}_ma`]: avg };
    });
  }, [data, dataKey, period]);

  return (
    <Line
      data={maData}
      type="monotone"
      dataKey={`${dataKey}_ma`}
      stroke={color}
      strokeWidth={2}
      strokeDasharray="5 5"
      dot={false}
      name={`${name} (${period}d)`}
      connectNulls
    />
  );
};
