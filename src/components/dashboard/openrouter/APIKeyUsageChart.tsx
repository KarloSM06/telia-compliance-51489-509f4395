import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface APIKeyUsageChartProps {
  data: Record<string, Record<string, { requests: number; cost: number }>> | undefined;
  keys: any[] | undefined;
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

type MetricType = 'cost' | 'requests';

export const APIKeyUsageChart = ({ data, keys, isLoading }: APIKeyUsageChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cost');
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const { chartData, keyIds } = useMemo(() => {
    if (!data) return { chartData: [], keyIds: [] };

    const dates = Object.keys(data).sort();
    const allKeys = new Set<string>();
    
    dates.forEach(date => {
      Object.keys(data[date]).forEach(key => allKeys.add(key));
    });

    const sortedKeys = Array.from(allKeys)
      .map(key => ({
        id: key,
        totalCost: dates.reduce((sum, date) => 
          sum + (data[date][key]?.cost || 0), 0
        )
      }))
      .sort((a, b) => b.totalCost - a.totalCost)
      .slice(0, 10)
      .map(k => k.id);

    const formattedData = dates.map(date => {
      const point: any = { 
        date,
        displayDate: format(new Date(date), 'd MMM', { locale: sv })
      };
      
      sortedKeys.forEach(key => {
        point[key] = data[date][key]?.[selectedMetric] || 0;
      });
      
      return point;
    });

    return { chartData: formattedData, keyIds: sortedKeys };
  }, [data, selectedMetric]);

  const getKeyLabel = (keyId: string) => {
    const key = keys?.find(k => k.key?.includes(keyId.substring(0, 8)));
    if (key?.label) return key.label;
    return `sk-***${keyId.substring(keyId.length - 6)}`;
  };

  const toggleKey = (keyId: string) => {
    setHiddenKeys(prev => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Användning per API-nyckel</CardTitle>
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
          <CardTitle>Användning per API-nyckel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            Ingen data tillgänglig för vald period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Användning per API-nyckel</CardTitle>
          <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
            <TabsList>
              <TabsTrigger value="cost">Kostnad</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
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
              label={{ 
                value: selectedMetric === 'cost' ? 'Kostnad (SEK)' : 'Requests', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: number) => {
                if (selectedMetric === 'cost') return `${value.toFixed(2)} SEK`;
                return value;
              }}
            />
            <Legend 
              onClick={(e) => toggleKey(e.value)}
              wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
              formatter={(value) => getKeyLabel(value)}
            />
            {keyIds.map((keyId, index) => (
              <Line
                key={keyId}
                type="monotone"
                dataKey={keyId}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                hide={hiddenKeys.has(keyId)}
                name={keyId}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
