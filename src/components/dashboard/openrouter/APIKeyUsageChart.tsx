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

export const APIKeyUsageChart = ({ activityData, keysList, isLoading }: APIKeyUsageChartProps) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('cost');
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  // Helper to get display name, prioritizing 'label' over 'name' (label contains user-set display name)
  const getDisplayName = (k: APIKey) => (k?.label || k?.name || 'Unnamed Key');

  // Debug: Check if keysList is available
  if (!keysList || keysList.length === 0) {
    console.warn('⚠️ APIKeyUsageChart: keysList is empty or undefined');
  } else {
    console.log('📋 Available keys:', keysList.map(k => ({ 
      hash: (k.hash || '').substring(0, 20) + '...', 
      name: k.name,
      label: k.label
    })));
  }

  const getEndpointId = (item: ActivityItem): string => {
    // Try multiple possible fields
    const id = item.endpoint_id || item.api_key || item.key_hash || item.key_id;
    return id || 'Unknown';
  };

  // Build lookup maps for efficient key name resolution
  const { nameByExact, nameByMasked, nameByPrefix } = useMemo(() => {
    const exact = new Map<string, string>();
    const masked = new Map<string, string>();
    const prefix = new Map<string, string>();

    if (!keysList) return { nameByExact: exact, nameByMasked: masked, nameByPrefix: prefix };

    keysList.forEach(k => {
      const display = getDisplayName(k);
      const h = k.hash || '';
      
      if (!h) return;

      // Exact hash mapping
      exact.set(h, display);

      // Direct label mapping (k.label is the masked string from API)
      if (k.label) {
        masked.set(k.label, display);
      }

      // Generate common masked formats
      // Format 1: sk-or-v1-xxx...yyy (3 chars each side)
      if (h.includes('sk-or-v1-')) {
        const afterPrefix = h.split('sk-or-v1-')[1];
        if (afterPrefix && afterPrefix.length >= 6) {
          const masked3 = `sk-or-v1-${afterPrefix.slice(0, 3)}...${h.slice(-3)}`;
          masked.set(masked3, display);
          
          // Also try 4 chars at the end
          const masked4 = `sk-or-v1-${afterPrefix.slice(0, 3)}...${h.slice(-4)}`;
          masked.set(masked4, display);
        }
      }

      // Generic masked format
      if (h.length >= 6) {
        masked.set(`${h.slice(0, 3)}...${h.slice(-3)}`, display);
        masked.set(`${h.slice(0, 3)}...${h.slice(-4)}`, display);
      }

      // Prefix mapping for partial matches (first 12 chars)
      if (h.length >= 12) {
        const prefixKey = h.slice(0, 12);
        prefix.set(prefixKey, display);
      }
    });

    return { nameByExact: exact, nameByMasked: masked, nameByPrefix: prefix };
  }, [keysList]);

  // Resolve endpoint_id to display name with multiple matching strategies
  const resolveKeyName = useMemo(() => {
    const cache = new Map<string, string>();
    
    return (endpointId: string): string => {
      if (!endpointId || endpointId === 'Unknown') return 'Unknown';
      
      // Check cache first
      if (cache.has(endpointId)) {
        return cache.get(endpointId)!;
      }

      console.log('🔍 Resolving endpoint_id:', endpointId);

      let result: string | undefined;

      // 1) Try masked format lookup
      result = nameByMasked.get(endpointId);
      if (result) {
        console.log('🔗 Masked match:', result);
        cache.set(endpointId, result);
        return result;
      }

      // 2) Try exact match
      result = nameByExact.get(endpointId);
      if (result) {
        console.log('✅ Exact match:', result);
        cache.set(endpointId, result);
        return result;
      }

      // 3) Try prefix match (first 12 chars)
      if (endpointId.length >= 12) {
        const prefixKey = endpointId.slice(0, 12);
        result = nameByPrefix.get(prefixKey);
        if (result) {
          console.log('🔗 Prefix match:', result);
          cache.set(endpointId, result);
          return result;
        }
      }

      // 4) Try manual masked matching (prefix...suffix)
      if (endpointId.includes('...')) {
        const [p, s] = endpointId.split('...');
        if (p && s && keysList) {
          const match = keysList.find(k => 
            k.hash && k.hash.startsWith(p) && k.hash.endsWith(s)
          );
          if (match) {
            result = getDisplayName(match);
            console.log('🧩 Manual masked match:', result);
            cache.set(endpointId, result);
            return result;
          }
        }
      }

      // 5) Try partial matching (longer prefix/suffix)
      if (keysList && endpointId.length >= 8) {
        const match = keysList.find(k => {
          const h = k.hash || '';
          if (!h) return false;
          
          const prefixLen = Math.min(10, endpointId.length, h.length);
          const suffixLen = Math.min(8, endpointId.length, h.length);
          
          return (
            h.startsWith(endpointId.slice(0, prefixLen)) ||
            h.endsWith(endpointId.slice(-suffixLen))
          );
        });

        if (match) {
          result = getDisplayName(match);
          console.log('🧩 Partial match:', result);
          cache.set(endpointId, result);
          return result;
        }
      }

      console.warn('❌ No match for endpoint_id:', endpointId);
      console.warn('   First 3 available keys:', keysList?.slice(0, 3).map(k => ({
        hash: k.hash?.substring(0, 20) + '...',
        name: k.name,
        label: k.label
      })));
      
      const fallback = `Key ${endpointId.substring(0, 8)}...`;
      cache.set(endpointId, fallback);
      return fallback;
    };
  }, [nameByExact, nameByMasked, nameByPrefix, keysList]);

  const { chartData, uniqueKeys } = useMemo(() => {
    if (!activityData || activityData.length === 0) {
      return { chartData: [], uniqueKeys: [] };
    }

    const keyDataByDate = activityData.reduce((acc, item) => {
      const date = item.date.split(' ')[0];
      const endpointId = getEndpointId(item);
      const keyName = resolveKeyName(endpointId);
      
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
      return resolveKeyName(endpointId);
    })));

    return { chartData: data, uniqueKeys: keys };
  }, [activityData, resolveKeyName, selectedMetric]);

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
      <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
        <Skeleton className="h-[450px] animate-pulse" />
      </Card>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
        <div className="flex items-center gap-2 mb-4">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">API-nycklar användning över tid</h3>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <LineChartIcon className="h-12 w-12 mb-3 opacity-50" />
          <p>Ingen data tillgänglig för vald period</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-background to-muted/20 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">API-nycklar användning över tid</h3>
        </div>
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
          <TabsList>
            <TabsTrigger value="cost" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Kostnad
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2">
              <Zap className="h-4 w-4" />
              Requests
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-muted" 
            strokeOpacity={0.3}
            vertical={false}
          />
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), 'dd MMM', { locale: sv })}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={(value) => 
              selectedMetric === 'cost' 
                ? `$${value.toFixed(2)}` 
                : value.toLocaleString()
            }
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            tickMargin={10}
          />
          <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
          <Legend 
            onClick={(e) => handleToggleKey(e.value)}
            wrapperStyle={{ 
              cursor: 'pointer',
              paddingTop: '20px'
            }}
            iconType="circle"
          />
          {uniqueKeys.map((key, index) => (
            <Line
              key={key}
              type="natural"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              hide={hiddenKeys.has(key)}
              name={key}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center mt-2">
        💡 Klicka på en nyckel i legenden för att visa/dölja
      </p>
    </Card>
  );
};
