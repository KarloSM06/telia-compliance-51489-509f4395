import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ReadRateChartProps {
  data: any[];
  isLoading?: boolean;
}

export const ReadRateChart = ({ data, isLoading }: ReadRateChartProps) => {
  if (isLoading) {
    return <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><Skeleton className="h-[280px]" /></Card>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
        <h3 className="text-sm font-medium mb-4">Läsningsgrad</h3>
        <div className="h-[280px] flex items-center justify-center text-muted-foreground">
          Ingen data att visa
        </div>
      </Card>
    );
  }

  const avgReadRate = data.reduce((sum, d) => sum + d.readRate, 0) / data.length;

  return (
    <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium">Läsningsgrad</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{avgReadRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Genomsnitt</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="readGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(271, 70%, 60%)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(271, 70%, 60%)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="readRate" 
            stroke="hsl(271, 70%, 60%)" 
            fill="url(#readGradient)"
            name="Läsningsgrad (%)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
