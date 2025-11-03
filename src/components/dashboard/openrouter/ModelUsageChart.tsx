import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ModelUsageChartProps {
  data: Record<string, Record<string, { tokens: number; requests: number; cost: number }>> | undefined;
  isLoading?: boolean;
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#ef4444', // red
];

type MetricType = 'tokens' | 'requests' | 'cost';

export const ModelUsageChart = ({ data, isLoading }: ModelUsageChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cost');
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set());

  const { chartData, modelNames } = useMemo(() => {
    if (!data) return { chartData: [], modelNames: [] };

    const dates = Object.keys(data).sort();
    const allModels = new Set<string>();
    
    dates.forEach(date => {
      Object.keys(data[date]).forEach(model => allModels.add(model));
    });

    const sortedModels = Array.from(allModels)
      .map(model => ({
        name: model,
        totalCost: dates.reduce((sum, date) => 
          sum + (data[date][model]?.cost || 0), 0
        )
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10)
      .map(m => m.name);

    const formattedData = dates.map(date => {
      const point: any = { 
        date,
        displayDate: format(new Date(date), 'd MMM', { locale: sv })
      };
      
      sortedModels.forEach(model => {
        point[model] = data[date][model]?.[selectedMetric] || 0;
      });
      
      return point;
    });

    return { chartData: formattedData, modelNames: sortedModels };
  }, [data, selectedMetric]);

  const toggleModel = (model: string) => {
    setHiddenModels(prev => {
      const next = new Set(prev);
      if (next.has(model)) {
        next.delete(model);
      } else {
        next.add(model);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Användning per Modell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Laddar data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Användning per Modell</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Ingen data tillgänglig för vald period
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'tokens': return 'Tokens';
      case 'requests': return 'Requests';
      case 'cost': return 'Kostnad (SEK)';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Användning per Modell</CardTitle>
          <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
            <TabsList>
              <TabsTrigger value="cost">Kostnad</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="displayDate" 
              className="text-xs text-muted-foreground"
            />
            <YAxis 
              className="text-xs text-muted-foreground"
              label={{ value: getMetricLabel(), angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => {
                if (selectedMetric === 'cost') return `${value.toFixed(2)} SEK`;
                if (selectedMetric === 'tokens') return value.toLocaleString();
                return value;
              }}
            />
            <Legend 
              onClick={(e) => toggleModel(e.value)}
              wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
            />
            {modelNames.map((model, index) => (
              <Line
                key={model}
                type="monotone"
                dataKey={model}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                hide={hiddenModels.has(model)}
                name={model}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
