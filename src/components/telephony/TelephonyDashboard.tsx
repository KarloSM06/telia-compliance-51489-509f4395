import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, MessageSquare, Clock, DollarSign } from 'lucide-react';
import { formatDuration, formatCost } from '@/lib/telephonyFormatters';

export const TelephonyDashboard = ({ metrics }: { metrics: any }) => {
  const statCards = [
    {
      title: 'Totalt antal samtal',
      value: metrics.totalCalls,
      icon: Phone,
      color: 'text-blue-600',
    },
    {
      title: 'Totalt antal SMS',
      value: metrics.totalSMS,
      icon: MessageSquare,
      color: 'text-green-600',
    },
    {
      title: 'Total samtalstid',
      value: formatDuration(metrics.totalDuration),
      icon: Clock,
      color: 'text-purple-600',
    },
    {
      title: 'Total kostnad',
      value: formatCost(metrics.totalCost, 'SEK'),
      icon: DollarSign,
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Per-provider breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Per leverantör</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => (
              <div key={provider} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold capitalize">{provider}</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.calls} samtal • {data.sms} SMS
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCost(data.cost, 'SEK')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(data.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
