import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, DollarSign, Phone, TrendingUp } from "lucide-react";
import { DailyData } from "@/hooks/useTelephonyChartData";

const PROVIDER_COLORS: Record<string, string> = {
  vapi: 'hsl(217, 91%, 60%)',
  retell: 'hsl(271, 70%, 60%)',
  twilio: 'hsl(0, 84%, 60%)',
  telnyx: 'hsl(158, 64%, 52%)'
};

type MetricType = 'cost' | 'calls' | 'avgCost';

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
              <span className="flex-1 text-muted-foreground capitalize">{entry.name}</span>
              <span className="font-semibold tabular-nums">
                {metric === 'calls' 
                  ? entry.value.toFixed(0)
                  : `${entry.value.toFixed(2)} SEK`
                }
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

interface ProviderPerformanceChartProps {
  data: DailyData[];
  providers: string[];
  isLoading?: boolean;
}

export const ProviderPerformanceChart = ({ data, providers, isLoading }: ProviderPerformanceChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cost');
  const [hiddenProviders, setHiddenProviders] = useState<Set<string>>(new Set());

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(day => {
      const result: any = { date: day.date };
      providers.forEach(provider => {
        result[provider] = day[`${provider}_${selectedMetric}`] || 0;
      });
      return result;
    });
  }, [data, providers, selectedMetric]);

  const handleToggleProvider = (provider: string) => {
    setHiddenProviders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(provider)) {
        newSet.delete(provider);
      } else {
        newSet.add(provider);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[350px] animate-pulse" />
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Provider Prestanda</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <Activity className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Provider Prestanda</h3>
        </div>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList className="h-7">
            <TabsTrigger value="cost" className="gap-1 text-xs px-2 py-1">
              <DollarSign className="h-3 w-3" />
              Kostnad
            </TabsTrigger>
            <TabsTrigger value="calls" className="gap-1 text-xs px-2 py-1">
              <Phone className="h-3 w-3" />
              Samtal
            </TabsTrigger>
            <TabsTrigger value="avgCost" className="gap-1 text-xs px-2 py-1">
              <TrendingUp className="h-3 w-3" />
              Snitt
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
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
              selectedMetric === 'calls' 
                ? value.toFixed(0)
                : `${value.toFixed(0)} kr`
            }
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={50}
          />
          <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
          <Legend 
            onClick={(e) => handleToggleProvider(e.value)}
            wrapperStyle={{ 
              cursor: 'pointer',
              paddingTop: '10px',
              fontSize: '10px'
            }}
            iconType="circle"
            iconSize={8}
          />
          {providers.map((provider) => (
            <Line
              key={provider}
              type="natural"
              dataKey={provider}
              stroke={PROVIDER_COLORS[provider] || 'hsl(var(--primary))'}
              strokeWidth={2}
              dot={{ r: 2, strokeWidth: 1 }}
              activeDot={{ r: 4, strokeWidth: 1 }}
              hide={hiddenProviders.has(provider)}
              name={provider.charAt(0).toUpperCase() + provider.slice(1)}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
