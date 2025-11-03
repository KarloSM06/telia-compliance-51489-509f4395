import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PROVIDER_COLORS: Record<string, string> = {
  sendgrid: 'hsl(189, 94%, 43%)',
  'aws-ses': 'hsl(38, 92%, 50%)',
  mailgun: 'hsl(0, 84%, 60%)',
  unknown: 'hsl(var(--muted-foreground))',
};

interface EmailActivityChartProps {
  data: any[];
  providers: string[];
  isLoading?: boolean;
}

export const EmailActivityChart = ({ data, providers, isLoading }: EmailActivityChartProps) => {
  if (isLoading) {
    return <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><Skeleton className="h-[280px]" /></Card>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
        <h3 className="text-sm font-medium mb-4">Email Aktivitet</h3>
        <div className="h-[280px] flex items-center justify-center text-muted-foreground">
          Ingen data att visa
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300">
      <h3 className="text-sm font-medium mb-4">Email Aktivitet per Provider</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
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
          {providers.map(provider => (
            <Line
              key={provider}
              type="monotone"
              dataKey={provider}
              stroke={PROVIDER_COLORS[provider] || 'hsl(var(--primary))'}
              strokeWidth={2}
              dot={{ r: 4 }}
              name={provider}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
