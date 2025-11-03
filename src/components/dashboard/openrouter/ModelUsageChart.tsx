import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityItem {
  created_at: string;
  model: string;
  total_cost: number;
  total_tokens: number;
}

interface ModelUsageChartProps {
  activityData: ActivityItem[];
  isLoading: boolean;
}

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4',
  '#f97316', '#6366f1', '#14b8a6', '#ef4444', '#a855f7', '#84cc16',
];

type MetricType = 'cost' | 'tokens' | 'requests';

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

export const ModelUsageChart = ({ activityData, isLoading }: ModelUsageChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cost');
  const [hiddenModels, setHiddenModels] = useState<Set<string>>(new Set());

  const { chartData, uniqueModels } = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { chartData: [], uniqueModels: [] };
    }

    const modelDataByDate = activityData.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      const model = item.model || 'Unknown';
      
      if (!acc[date]) acc[date] = {};
      if (!acc[date][model]) {
        acc[date][model] = { cost: 0, tokens: 0, requests: 0 };
      }
      
      acc[date][model].cost += item.total_cost || 0;
      acc[date][model].tokens += item.total_tokens || 0;
      acc[date][model].requests += 1;
      
      return acc;
    }, {} as Record<string, Record<string, {cost: number, tokens: number, requests: number}>>);

    const data = Object.entries(modelDataByDate).map(([date, models]) => ({
      date,
      ...Object.fromEntries(
        Object.entries(models).map(([model, data]) => [model, data[selectedMetric]])
      )
    })).sort((a, b) => a.date.localeCompare(b.date));

    const models = Array.from(new Set(activityData.map(item => item.model || 'Unknown')));

    return { chartData: data, uniqueModels: models };
  }, [activityData, selectedMetric]);

  const handleToggleModel = (model: string) => {
    setHiddenModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(model)) {
        newSet.delete(model);
      } else {
        newSet.add(model);
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
        <h3 className="text-lg font-semibold mb-4">AI-modeller användning över tid</h3>
        <p className="text-muted-foreground">Ingen data tillgänglig för vald period</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">AI-modeller användning över tid</h3>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList>
            <TabsTrigger value="cost">Kostnad ($)</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
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
            onClick={(e) => handleToggleModel(e.value)}
            wrapperStyle={{ cursor: 'pointer' }}
          />
          {uniqueModels.map((model, index) => (
            <Line
              key={model}
              type="monotone"
              dataKey={model}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              hide={hiddenModels.has(model)}
              name={model.split('/').pop() || model}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
