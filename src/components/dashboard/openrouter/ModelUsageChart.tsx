import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Hash, Zap, LineChartIcon } from "lucide-react";

interface ActivityItem {
  date: string;
  model: string;
  usage: number;
  prompt_tokens: number;
  completion_tokens: number;
  requests: number;
}

interface ModelUsageChartProps {
  activityData: ActivityItem[];
  isLoading: boolean;
}

const COLORS = [
  'hsl(217, 91%, 60%)',  // Blue
  'hsl(271, 70%, 60%)',  // Purple
  'hsl(330, 81%, 60%)',  // Pink
  'hsl(38, 92%, 50%)',   // Amber
  'hsl(158, 64%, 52%)',  // Green
  'hsl(189, 94%, 43%)',  // Cyan
  'hsl(24, 95%, 53%)',   // Orange
  'hsl(239, 84%, 67%)',  // Indigo
  'hsl(173, 80%, 40%)',  // Teal
  'hsl(0, 84%, 60%)',    // Red
  'hsl(271, 76%, 53%)',  // Violet
  'hsl(84, 81%, 44%)',   // Lime
];

type MetricType = 'cost' | 'tokens' | 'requests';

const CustomTooltip = ({ active, payload, label, metric }: any) => {
  if (!active || !payload) return null;
  
  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
      <p className="font-semibold mb-2 text-sm">
        {format(new Date(label), 'dd MMMM yyyy', { locale: sv })}
      </p>
      <div className="space-y-1.5">
        {payload
          .sort((a: any, b: any) => b.value - a.value)
          .map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full ring-2 ring-background" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="flex-1 text-muted-foreground">{entry.name}</span>
              <span className="font-semibold tabular-nums">
                {metric === 'cost' 
                  ? `$${entry.value.toFixed(4)}`
                  : entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
      </div>
      <div className="border-t border-border mt-2 pt-2">
        <div className="flex justify-between text-sm font-semibold">
          <span>Totalt:</span>
          <span className="tabular-nums">
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
      const date = item.date.split(' ')[0]; // Extract YYYY-MM-DD from "2025-11-02 00:00:00"
      const model = item.model || 'Unknown';
      
      if (!acc[date]) acc[date] = {};
      if (!acc[date][model]) {
        acc[date][model] = { cost: 0, tokens: 0, requests: 0 };
      }
      
      acc[date][model].cost += item.usage || 0;
      acc[date][model].tokens += (item.prompt_tokens || 0) + (item.completion_tokens || 0);
      acc[date][model].requests += item.requests || 1;
      
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
      <Card className="p-3">
        <Skeleton className="h-[250px] animate-pulse" />
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">AI-modeller</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <LineChartIcon className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">AI-modeller</h3>
        </div>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList className="h-7">
            <TabsTrigger value="cost" className="gap-1 text-xs px-2 py-1">
              <DollarSign className="h-3 w-3" />
              $
            </TabsTrigger>
            <TabsTrigger value="tokens" className="gap-1 text-xs px-2 py-1">
              <Hash className="h-3 w-3" />
              T
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-1 text-xs px-2 py-1">
              <Zap className="h-3 w-3" />
              R
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-muted" 
            strokeOpacity={0.3}
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: sv })}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
          />
          <YAxis 
            tickFormatter={(value) => 
              selectedMetric === 'cost' 
                ? `$${value.toFixed(1)}` 
                : value > 1000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString()
            }
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={40}
          />
          <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
          <Legend 
            onClick={(e) => handleToggleModel(e.value)}
            wrapperStyle={{ 
              cursor: 'pointer',
              paddingTop: '10px',
              fontSize: '10px'
            }}
            iconType="circle"
            iconSize={8}
          />
          {uniqueModels.map((model, index) => (
            <Line
              key={model}
              type="natural"
              dataKey={model}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={1.5}
              dot={{ r: 2, strokeWidth: 1 }}
              activeDot={{ r: 3, strokeWidth: 1 }}
              hide={hiddenModels.has(model)}
              name={model.split('/').pop() || model}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
