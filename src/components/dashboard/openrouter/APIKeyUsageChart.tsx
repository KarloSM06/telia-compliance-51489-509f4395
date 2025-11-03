import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Key, DollarSign, Zap, LineChartIcon } from "lucide-react";


interface ActivityItem {
  date: string;
  usage: number;
  endpoint_id?: string;
  api_key?: string;
  key_hash?: string;
  key_id?: string;
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

type MetricType = 'cost' | 'requests';

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
              ? `${payload.reduce((sum: number, p: any) => sum + p.value, 0).toFixed(2)} SEK`
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

  // Build resolver that maps activity endpoint IDs to user-set key names only (fallback: 'Namnlös')
  const resolveNameFromEndpoint = useMemo(() => {
    const keys = keysList || [];

    const exactMap = new Map<string, APIKey>();
    const maskedMap = new Map<string, APIKey>();

    keys.forEach((k) => {
      if (k.hash) exactMap.set(k.hash, k);
      if (k.label) maskedMap.set(k.label, k);
      if (k.hash && k.hash.length >= 6) {
        maskedMap.set(`${k.hash.slice(0, 3)}...${k.hash.slice(-3)}`, k);
        maskedMap.set(`${k.hash.slice(0, 3)}...${k.hash.slice(-4)}`, k);
        maskedMap.set(`${k.hash.slice(0, 8)}...${k.hash.slice(-4)}`, k);
      }
    });

    return (endpointId: string | undefined | null): string => {
      if (!endpointId) return 'Namnlös';

      if (maskedMap.has(endpointId)) {
        const k = maskedMap.get(endpointId)!;
        return k.name?.trim() || 'Namnlös';
      }

      if (exactMap.has(endpointId)) {
        const k = exactMap.get(endpointId)!;
        return k.name?.trim() || 'Namnlös';
      }

      if (endpointId.includes('...')) {
        const [prefix, suffix] = endpointId.split('...');
        const match = keys.find(k =>
          k.hash &&
          k.hash.startsWith(prefix) &&
          k.hash.endsWith(suffix)
        );
        if (match) return match.name?.trim() || 'Namnlös';
      }

      if (endpointId.length >= 8) {
        const prefixLen = Math.min(12, endpointId.length);
        const suffixLen = Math.min(8, endpointId.length);
        const match = keys.find(k =>
          k.hash && (
            k.hash.startsWith(endpointId.slice(0, prefixLen)) ||
            k.hash.endsWith(endpointId.slice(-suffixLen))
          )
        );
        if (match) return match.name?.trim() || 'Namnlös';
      }

      return 'Namnlös';
    };
  }, [keysList]);

  // Debug: Check if keysList is available
  if (!keysList || keysList.length === 0) {
    console.log('⚠️ APIKeyUsageChart: No keysList available');
  } else {
    console.log('✅ APIKeyUsageChart: keysList loaded', keysList.length, 'keys');
    keysList.slice(0, 3).forEach((k: any) => {
      console.log('  Key:', {
        name: k.name,
        label: k.label,
        hash: k.hash?.substring(0, 12) + '...'
      });
    });
  }

  const getEndpointId = (item: ActivityItem): string => {
    return item.endpoint_id || item.api_key || item.key_hash || item.key_id || 'unknown';
  };

  const { chartData, uniqueKeys } = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { chartData: [], uniqueKeys: [] };
    }

    const keyDataByDate = activityData.reduce((acc, item) => {
      const date = item.date.split(' ')[0];
      const endpointId = getEndpointId(item);
      const keyName = resolveNameFromEndpoint(endpointId);
      
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
      const endpointId = getEndpointId(item);
      return resolveNameFromEndpoint(endpointId);
    })));

    return { chartData: data, uniqueKeys: keys };
  }, [activityData, resolveNameFromEndpoint, selectedMetric]);

  const uniqueLegendNames = uniqueKeys;

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
      <Card className="p-4">
        <Skeleton className="h-[350px] animate-pulse" />
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">API-nycklar</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <LineChartIcon className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">Ingen data tillgänglig</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">API-nycklar</h3>
        </div>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList className="h-7">
            <TabsTrigger value="cost" className="gap-1 text-xs px-2 py-1">
              <DollarSign className="h-3 w-3" />
              kr
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-1 text-xs px-2 py-1">
              <Zap className="h-3 w-3" />
              R
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
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
                : value > 1000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString()
            }
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            tickMargin={5}
            width={40}
          />
          <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
          <Legend 
            onClick={(e) => handleToggleKey(e.value)}
            wrapperStyle={{ 
              cursor: 'pointer',
              paddingTop: '10px',
              fontSize: '10px'
            }}
            iconType="circle"
            iconSize={8}
          />
          {uniqueKeys.map((key, index) => (
            <Line
              key={key}
              type="natural"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={1.5}
              dot={{ r: 2, strokeWidth: 1 }}
              activeDot={{ r: 3, strokeWidth: 1 }}
              hide={hiddenKeys.has(key)}
              name={uniqueLegendNames[index]}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
