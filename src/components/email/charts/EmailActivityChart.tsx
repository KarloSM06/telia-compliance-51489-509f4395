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
    return <Card className="p-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm"><Skeleton className="h-[280px]" /></Card>;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300">
        <h3 className="text-sm font-medium mb-4 text-primary">Email Aktivitet</h3>
        <div className="h-[280px] flex items-center justify-center text-primary/80">
          Ingen data att visa
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-sm font-medium mb-4 text-primary">Email Aktivitet per Provider</h3>
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
