import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  date: string;
  usage: number;
  endpoint_id?: string;
  requests: number;
}

interface APIKey {
  hash: string;
  name?: string;
  label?: string;
}

interface APIKeyUsageChartProps {
  activityData: ActivityItem[];
  keysList: APIKey[];
  isLoading: boolean;
}

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4',
  '#f97316', '#6366f1', '#14b8a6', '#ef4444', '#a855f7', '#84cc16',
];

type MetricType = 'cost' | 'requests';

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (!active || !payload) return null;
  
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="font-medium mb-2">
        {format(new Date(label), 'dd MMMM yyyy', { locale: sv })}
      </p>
      <div className="space-y-1">
        {payload
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="flex-1">{entry.name}</span>
              <span className="font-medium">
                {metric === 'cost' 
                  ? `$${entry.value.toFixed(4)}`
                  : entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
      </div>
      <div className="border-t border-border mt-2 pt-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Totalt:</span>
          <span>
            {metric === 'cost'
              ? `$${payload.reduce((sum: number, p: any) => sum + p.value, 0).toFixed(4)}`
              : payload.reduce((sum: number, p: any) => sum + p.value, 0).toLocaleString()
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export const APIKeyUsageChart = ({ activityData, keysList, isLoading }: APIKeyUsageChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cost');
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const getEndpointId = (endpointId: string) => {
    if (!endpointId) return 'Unknown';
    return endpointId;
  };

  const getKeyName = (endpointId: string) => {
    if (!endpointId || endpointId === 'Unknown') return 'Unknown';
    return `Endpoint ${endpointId.substring(0, 12)}`;
  };

  const { chartData, uniqueKeys } = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { chartData: [], uniqueKeys: [] };
    }

    const keyDataByDate = activityData.reduce((acc, item) => {
      const date = item.date.split(' ')[0];
      const endpointId = getEndpointId(item.endpoint_id || '');
      const keyName = getKeyName(endpointId);
      
      if (!acc[date]) acc[date] = {};
      if (!acc[date][keyName]) {
        acc[date][keyName] = { cost: 0, requests: 0 };
      }
      
      acc[date][keyName].cost += item.usage || 0;
      acc[date][keyName].requests += item.requests || 1;
      
      return acc;
    }, {} as Record<string, Record<string, {cost: number, requests: number}>>);

    const data = Object.entries(keyDataByDate).map(([date, keys]) => ({
      date,
      ...Object.fromEntries(
        Object.entries(keys).map(([key, data]) => [key, data[selectedMetric]])
      )
    })).sort((a, b) => a.date.localeCompare(b.date));

    const keys = Array.from(new Set(activityData.map(item => {
      const endpointId = getEndpointId(item.endpoint_id || '');
      return getKeyName(endpointId);
    })));

    return { chartData: data, uniqueKeys: keys };
  }, [activityData, keysList, selectedMetric]);

  const handleToggleKey = (key: string) => {
    setHiddenKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-[400px]" />
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">API-nycklar användning över tid</h3>
        <p className="text-muted-foreground">Ingen data tillgänglig för vald period</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">API-nycklar användning över tid</h3>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList>
            <TabsTrigger value="cost">Kostnad ($)</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'dd MMM', { locale: sv })}
          />
          <YAxis 
            tickFormatter={(value) => 
              selectedMetric === 'cost' 
                ? `$${value.toFixed(2)}` 
                : value.toLocaleString()
            }
          />
          <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
          <Legend 
            onClick={(e) => handleToggleKey(e.value)}
            wrapperStyle={{ cursor: 'pointer' }}
          />
          {uniqueKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              hide={hiddenKeys.has(key)}
              name={key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
