import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MultiLineModelCostChartProps {
  data: Array<{ date: string; [key: string]: string | number }>;
  modelNames: string[];
  isLoading?: boolean;
}

const COLORS = [
  "#8b5cf6", // purple
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#84cc16", // lime
];

export const MultiLineModelCostChart = ({ 
  data, 
  modelNames, 
  isLoading 
}: MultiLineModelCostChartProps) => {
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kostnadstrend per Modell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kostnadstrend per Modell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const toggleModel = (modelName: string) => {
    setHiddenModels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(modelName)) {
        newSet.delete(modelName);
      } else {
        newSet.add(modelName);
      }
      return newSet;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium mb-2">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold">{entry.value.toFixed(2)} SEK</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kostnadstrend per Modell</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
            />
            <YAxis
              className="text-xs"
              tickFormatter={(value) => `${value} SEK`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              onClick={(e) => toggleModel(e.value)}
              wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
              formatter={(value) => (
                <span
                  style={{
                    color: hiddenModels.has(value) ? '#999' : 'inherit',
                    textDecoration: hiddenModels.has(value) ? 'line-through' : 'none',
                  }}
                >
                  {value}
                </span>
              )}
            />
            {modelNames.map((modelName, index) => (
              <Line
                key={modelName}
                type="monotone"
                dataKey={modelName}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                hide={hiddenModels.has(modelName)}
                name={modelName}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Klicka på modellnamnen i förklaringen för att visa/dölja dem
        </p>
      </CardContent>
    </Card>
  );
};
