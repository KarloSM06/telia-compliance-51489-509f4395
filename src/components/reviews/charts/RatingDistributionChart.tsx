import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Star } from 'lucide-react';

interface RatingDistributionChartProps {
  data: any[];
  isLoading?: boolean;
}

export function RatingDistributionChart({ data, isLoading }: RatingDistributionChartProps) {
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
          <Star className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold">Betygsdistribution</h3>
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
        <Star className="h-5 w-5 text-amber-600" />
        <h3 className="font-semibold">Betygsdistribution</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }} 
          />
          <Legend />
          <Bar dataKey="rating_1" stackId="a" fill="#ef4444" name="1 ⭐" />
          <Bar dataKey="rating_2" stackId="a" fill="#f97316" name="2 ⭐" />
          <Bar dataKey="rating_3" stackId="a" fill="#eab308" name="3 ⭐" />
          <Bar dataKey="rating_4" stackId="a" fill="#84cc16" name="4 ⭐" />
          <Bar dataKey="rating_5" stackId="a" fill="#22c55e" name="5 ⭐" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
