import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts";
import { format } from "date-fns";

interface LineConfig {
  dataKey: string;
  color: string;
  name: string;
}

interface MultiLineChartProps {
  data: any[];
  lines: LineConfig[];
  xAxisKey?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
  height?: number;
  showBrush?: boolean;
}

const COLORS = [
  "hsl(217, 91%, 60%)", // blue
  "hsl(142, 76%, 36%)", // green
  "hsl(0, 84%, 60%)", // red
  "hsl(43, 96%, 56%)", // gold
  "hsl(271, 70%, 60%)", // purple
  "hsl(189, 94%, 43%)", // cyan
  "hsl(330, 81%, 60%)", // pink
  "hsl(25, 95%, 53%)", // orange
];

export const MultiLineChart = ({ 
  data, 
  lines, 
  xAxisKey = "date",
  yAxisFormatter = (v) => `${v.toFixed(0)} kr`,
  tooltipFormatter = (v) => `${v.toFixed(2)} SEK`,
  height = 350,
  showBrush = false
}: MultiLineChartProps) => {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());

  const toggleLine = (dataKey: string) => {
    setHiddenLines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'MMM dd');
    } catch {
      return dateStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div 
        className="border rounded-xl p-3 shadow-2xl"
        style={{
          backgroundColor: "hsla(var(--card), 0.95)",
          borderColor: "hsla(var(--border), 0.5)",
          backdropFilter: "blur(12px) saturate(180%)",
        }}
      >
        <p className="font-medium mb-2 text-xs text-muted-foreground">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground/80 text-xs">{entry.name}:</span>
            <span className="font-semibold text-sm">{tooltipFormatter(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" opacity={0.5} />
        <XAxis
          dataKey={xAxisKey}
          tickFormatter={formatDate}
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          className="text-xs"
          tickFormatter={yAxisFormatter}
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          onClick={(e) => toggleLine(e.dataKey as string)}
          wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
          formatter={(value, entry: any) => (
            <span
              style={{
                color: hiddenLines.has(entry.dataKey) ? '#999' : 'inherit',
                textDecoration: hiddenLines.has(entry.dataKey) ? 'line-through' : 'none',
              }}
            >
              {value}
            </span>
          )}
        />
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color || COLORS[index % COLORS.length]}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            hide={hiddenLines.has(line.dataKey)}
            name={line.name}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        ))}
        {showBrush && (
          <Brush 
            dataKey={xAxisKey}
            height={30} 
            stroke="hsl(var(--primary))"
            fill="hsl(var(--muted))"
            tickFormatter={formatDate}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};
