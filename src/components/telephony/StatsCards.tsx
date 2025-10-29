import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare, Clock, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { formatDuration, formatCost } from '@/lib/telephonyFormatters';
interface StatsCardsProps {
  metrics: {
    totalCalls: number;
    totalSMS: number;
    totalDuration: number;
    totalCost: number;
    events: any[];
  };
}
export const StatsCards = ({
  metrics
}: StatsCardsProps) => {
  // Calculate in-progress calls (only count parent events)
  const inProgressCalls = metrics.events?.filter(event => 
    !event.normalized?.endedAt && 
    !event.normalized?.endedReason && 
    !event.parent_event_id &&
    (event.provider_layer === 'agent' || ['vapi', 'retell'].includes(event.provider))
  ).length || 0;

  // Calculate completed calls for accurate averages
  const completedCalls = metrics.totalCalls - inProgressCalls;
  const avgCallDuration = completedCalls > 0 ? Math.round(metrics.totalDuration / completedCalls) : 0;
  const stats = [{
    title: 'Total Samtal',
    value: metrics.totalCalls,
    icon: Phone,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    subtitle: metrics.totalCalls > 0 ? `${completedCalls} avslutade` : 'Inga samtal ännu'
  }, {
    title: 'Pågående',
    value: inProgressCalls,
    icon: Loader2,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    subtitle: 'Aktiva samtal',
    animate: true
  }, {
    title: 'Total Tid',
    value: formatDuration(metrics.totalDuration),
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    subtitle: completedCalls > 0 ? `⌀ ${formatDuration(avgCallDuration)} per samtal` : '-'
  }, {
    title: 'Total Kostnad',
    value: formatCost(metrics.totalCost, 'SEK'),
    icon: DollarSign,
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
    subtitle: metrics.totalCalls + metrics.totalSMS > 0 ? `⌀ ${(metrics.totalCost / (metrics.totalCalls + metrics.totalSMS)).toFixed(2)} SEK per event` : '-'
  }];
  return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(stat => <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-2xl">{stat.title}</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>)}
    </div>;
};