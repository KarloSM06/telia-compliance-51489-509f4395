import { Card } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RatingVsSentimentChartProps {
  data: any[];
  isLoading?: boolean;
}

export function RatingVsSentimentChart({ data, isLoading }: RatingVsSentimentChartProps) {
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
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Betyg vs AI Sentiment</h3>
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
        <TrendingUp className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold">Betyg vs AI Sentiment</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            type="number" 
            dataKey="rating" 
            name="Betyg" 
            domain={[0, 5]}
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            label={{ value: 'Betyg', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="number" 
            dataKey="sentiment" 
            name="Sentiment" 
            domain={[0, 1]}
            stroke="hsl(var(--muted-foreground))" 
            fontSize={12}
            label={{ value: 'AI Sentiment', angle: -90, position: 'insideLeft' }}
          />
          <ZAxis range={[50, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            formatter={(value: any) => typeof value === 'number' ? value.toFixed(2) : value}
          />
          <Scatter name="Recensioner" data={data} fill="hsl(var(--primary))" fillOpacity={0.6} />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}
