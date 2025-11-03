import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Phone, DollarSign, Clock, LineChartIcon } from "lucide-react";

interface TelephonyEvent {
  event_timestamp: string;
  provider: string;
  cost_amount?: number;
  aggregate_cost_amount?: number;
  duration_seconds?: number;
  event_type: string;
}

interface TelephonyCallsChartProps {
  events: TelephonyEvent[];
  isLoading: boolean;
}

const PROVIDER_COLORS: Record<string, string> = {
  vapi: 'hsl(217, 91%, 60%)',
  retell: 'hsl(271, 70%, 60%)',
  twilio: 'hsl(0, 84%, 60%)',
  telnyx: 'hsl(271, 76%, 53%)',
};

type MetricType = 'calls' | 'cost' | 'duration';

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
                  ? `${entry.value.toFixed(2)} SEK`
                  : metric === 'duration'
                  ? `${Math.floor(entry.value / 60)}m ${entry.value % 60}s`
                  : entry.value
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
              ? `${payload.reduce((sum: number, p: any) => sum + p.value, 0).toFixed(2)} SEK`
              : metric === 'duration'
              ? `${Math.floor(payload.reduce((sum: number, p: any) => sum + p.value, 0) / 60)}m`
              : payload.reduce((sum: number, p: any) => sum + p.value, 0)
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export const TelephonyCallsChart = ({ events, isLoading }: TelephonyCallsChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('calls');
  const [hiddenProviders, setHiddenProviders] = useState<Set<string>>(new Set());

  const { chartData, uniqueProviders } = useMemo(() => {
    if (!events || events.length === 0) {
      return { chartData: [], uniqueProviders: [] };
    }

    // Group by date and provider
    const dataByDate = events.reduce((acc, event) => {
      const date = event.event_timestamp.split('T')[0];
      const provider = event.provider || 'Unknown';
      
      if (!acc[date]) acc[date] = {};
      if (!acc[date][provider]) {
        acc[date][provider] = { calls: 0, cost: 0, duration: 0 };
      }
      
      acc[date][provider].calls += 1;
      acc[date][provider].cost += (event.aggregate_cost_amount || event.cost_amount || 0) * 10.5; // USD to SEK
      acc[date][provider].duration += event.duration_seconds || 0;
      
      return acc;
    }, {} as Record<string, Record<string, {calls: number, cost: number, duration: number}>>);

    const data = Object.entries(dataByDate).map(([date, providers]) => ({
      date,
      ...Object.fromEntries(
        Object.entries(providers).map(([provider, data]) => [provider, data[selectedMetric]])
      )
    })).sort((a, b) => a.date.localeCompare(b.date));

    const providers = Array.from(new Set(events.map(e => e.provider || 'Unknown')));

    return { chartData: data, uniqueProviders: providers };
  }, [events, selectedMetric]);

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
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Telefoni-aktivitet</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <LineChartIcon className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Telefoni-aktivitet</h3>
        </div>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList className="h-7">
            <TabsTrigger value="calls" className="gap-1 text-xs px-2 py-1">
              <Phone className="h-3 w-3" />
              Samtal
            </TabsTrigger>
            <TabsTrigger value="cost" className="gap-1 text-xs px-2 py-1">
              <DollarSign className="h-3 w-3" />
              kr
            </TabsTrigger>
            <TabsTrigger value="duration" className="gap-1 text-xs px-2 py-1">
              <Clock className="h-3 w-3" />
              Tid
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        {selectedMetric === 'calls' ? (
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickMargin={5}
              width={40}
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
            {uniqueProviders.map((provider) => (
              <Bar
                key={provider}
                dataKey={provider}
                fill={PROVIDER_COLORS[provider] || 'hsl(var(--primary))'}
                hide={hiddenProviders.has(provider)}
                name={provider.charAt(0).toUpperCase() + provider.slice(1)}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        ) : (
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
                  ? `${value.toFixed(0)} kr` 
                  : `${Math.floor(value / 60)}m`
              }
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickMargin={5}
              width={40}
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
            {uniqueProviders.map((provider) => (
              <Line
                key={provider}
                type="natural"
                dataKey={provider}
                stroke={PROVIDER_COLORS[provider] || 'hsl(var(--primary))'}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1 }}
                activeDot={{ r: 4, strokeWidth: 1 }}
                hide={hiddenProviders.has(provider)}
                name={provider.charAt(0).toUpperCase() + provider.slice(1)}
                animationDuration={300}
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
};
