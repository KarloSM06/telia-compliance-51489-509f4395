import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Bell } from 'lucide-react';

interface NotificationTypeDistributionChartProps {
  data: any[];
  isLoading?: boolean;
}

export function NotificationTypeDistributionChart({ data, isLoading }: NotificationTypeDistributionChartProps) {
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
          <Bell className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Notifikationstyper</h3>
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
        <Bell className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold">Notifikationstyper</h3>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
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
          <Area type="monotone" dataKey="booking" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Bokning" />
          <Area type="monotone" dataKey="review" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Recension" />
          <Area type="monotone" dataKey="message_failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Fel" />
          <Area type="monotone" dataKey="system" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="System" />
          <Area type="monotone" dataKey="other" stackId="1" stroke="#6b7280" fill="#6b7280" fillOpacity={0.6} name="Övrigt" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
