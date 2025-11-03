import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tag } from 'lucide-react';

interface TopicsDistributionChartProps {
  data: any[];
  isLoading?: boolean;
}

export function TopicsDistributionChart({ data, isLoading }: TopicsDistributionChartProps) {
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
          <Tag className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Top Topics</h3>
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
        <Tag className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold">Top Topics (AI-Analys)</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis dataKey="topic" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} 
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
