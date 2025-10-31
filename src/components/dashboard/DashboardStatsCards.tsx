import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, Calendar, Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsCardsProps {
  bookings: any[];
  messages: any[];
  telephony: any[];
  reviews: any[];
}

export const DashboardStatsCards = ({ 
  bookings, 
  messages, 
  telephony, 
  reviews 
}: DashboardStatsCardsProps) => {
  const smsCount = messages.filter(m => m.channel === 'sms').length;
  const emailCount = messages.filter(m => m.channel === 'email').length;
  
  const inProgressCalls = telephony.filter(t => 
    !t.normalized?.endedAt && !t.normalized?.endedReason
  ).length;
  
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
    : 0;

  const stats = [
    {
      title: 'Nya Bokningar (7d)',
      value: bookings.length,
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      subtitle: `${(bookings.length / 7).toFixed(1)}/dag`,
    },
    {
      title: 'Aktiva Samtal',
      value: inProgressCalls,
      icon: Phone,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
      subtitle: 'Pågående just nu',
      animate: inProgressCalls > 0,
    },
    {
      title: 'Nya Meddelanden',
      value: messages.length,
      icon: MessageSquare,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
      subtitle: `${smsCount} SMS + ${emailCount} Email`,
    },
    {
      title: 'Reviews (7d)',
      value: reviews.length,
      icon: Star,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      subtitle: avgRating > 0 ? `⌀ ${avgRating.toFixed(1)}/5` : 'Inga reviews än',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                    {stat.animate && (
                      <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                  <Icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
