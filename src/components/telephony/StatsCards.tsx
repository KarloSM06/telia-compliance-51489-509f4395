import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { formatDuration, formatCost } from '@/lib/telephonyFormatters';

interface StatsCardsProps {
  metrics: {
    totalCalls: number;
    totalSMS: number;
    totalDuration: number;
    totalCost: number;
  };
}

export const StatsCards = ({ metrics }: StatsCardsProps) => {
  const avgCallDuration = metrics.totalCalls > 0 
    ? Math.round(metrics.totalDuration / metrics.totalCalls)
    : 0;

  const stats = [
    {
      title: 'Total Samtal',
      value: metrics.totalCalls,
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      subtitle: metrics.totalCalls > 0 ? `⌀ ${formatDuration(avgCallDuration)}` : 'Inga samtal ännu',
    },
    {
      title: 'Total SMS',
      value: metrics.totalSMS,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      subtitle: metrics.totalSMS > 0 ? `${(metrics.totalCost / (metrics.totalCalls + metrics.totalSMS) * metrics.totalSMS).toFixed(2)} SEK total` : 'Inga SMS ännu',
    },
    {
      title: 'Total Tid',
      value: formatDuration(metrics.totalDuration),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      subtitle: metrics.totalCalls > 0 ? `⌀ ${formatDuration(avgCallDuration)} per samtal` : '-',
    },
    {
      title: 'Total Kostnad',
      value: formatCost(metrics.totalCost, 'SEK'),
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      subtitle: metrics.totalCalls + metrics.totalSMS > 0 
        ? `⌀ ${(metrics.totalCost / (metrics.totalCalls + metrics.totalSMS)).toFixed(2)} SEK per event`
        : '-',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-full`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
