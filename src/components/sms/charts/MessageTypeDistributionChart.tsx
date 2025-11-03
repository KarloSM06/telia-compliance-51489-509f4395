import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MessageTypeDistributionChartProps {
  data: any[];
  isLoading?: boolean;
}

export const MessageTypeDistributionChart = ({ data, isLoading }: MessageTypeDistributionChartProps) => {
  if (isLoading) {
    return <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><Skeleton className="h-[280px]" /></Card>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
        <h3 className="text-sm font-medium mb-4">Meddelandetyper</h3>
        <div className="h-[280px] flex items-center justify-center text-muted-foreground">
          Ingen data att visa
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
      <h3 className="text-sm font-medium mb-4">Fördelning per Meddelandetyp</h3>
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
          <Bar dataKey="review" fill="hsl(38, 92%, 50%)" name="Review" stackId="a" />
          <Bar dataKey="reminder" fill="hsl(217, 91%, 60%)" name="Påminnelse" stackId="a" />
          <Bar dataKey="booking" fill="hsl(158, 64%, 52%)" name="Bokning" stackId="a" />
          <Bar dataKey="general" fill="hsl(var(--muted))" name="Allmänt" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
