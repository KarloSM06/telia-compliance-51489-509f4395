import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface EngagementChartProps {
  data: any[];
  isLoading?: boolean;
}

export const EngagementChart = ({ data, isLoading }: EngagementChartProps) => {
  if (isLoading) {
    return <Card className="p-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm"><Skeleton className="h-[280px]" /></Card>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300">
        <h3 className="text-sm font-medium mb-4 text-primary">Engagement (Öppnings & Klickgrad)</h3>
        <div className="h-[280px] flex items-center justify-center text-primary/80">
          Ingen data att visa
        </div>
      </Card>
    );
  }

  const avgOpenRate = data.reduce((sum, d) => sum + d.openRate, 0) / data.length;
  const avgClickRate = data.reduce((sum, d) => sum + d.clickRate, 0) / data.length;

  return (
    <Card className="p-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-primary">Engagement</h3>
        <div className="text-right space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-sm text-primary/80">Öppningsgrad:</div>
            <div className="text-lg font-bold text-blue-600">{avgOpenRate.toFixed(1)}%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-primary/80">Klickgrad:</div>
            <div className="text-lg font-bold text-purple-600">{avgClickRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
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
          <Legend />
          <Line 
            type="monotone" 
            dataKey="openRate" 
            stroke="hsl(217, 91%, 60%)" 
            strokeWidth={2}
            name="Öppningsgrad (%)"
          />
          <Line 
            type="monotone" 
            dataKey="clickRate" 
            stroke="hsl(271, 70%, 60%)" 
            strokeWidth={2}
            name="Klickgrad (%)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};
