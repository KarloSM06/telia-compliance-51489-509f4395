import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Clock } from 'lucide-react';

interface ResponseTimeTrendChartProps {
  data: any[];
  isLoading?: boolean;
}

export function ResponseTimeTrendChart({ data, isLoading }: ResponseTimeTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
        <div className="h-[280px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Responstid Trend</h3>
        </div>
        <div className="h-[280px] flex items-center justify-center text-muted-foreground">
          Ingen data tillgänglig
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold">Responstid Trend</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Minuter', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: any) => `${value} min`}
          />
          <Legend />
          <Line type="monotone" dataKey="avgResponseTime" stroke="#22c55e" strokeWidth={2} name="Genomsnitt" dot={{ r: 4 }} />
          <Line type="monotone" dataKey="minResponseTime" stroke="#60a5fa" strokeWidth={1.5} name="Min" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="maxResponseTime" stroke="#f87171" strokeWidth={1.5} name="Max" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
