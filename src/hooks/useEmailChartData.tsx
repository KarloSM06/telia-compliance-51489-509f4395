import { useMemo } from 'react';

interface EmailLog {
  id: string;
  sent_at: string;
  status: string;
  provider: string;
  cost?: number;
  message_type?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
}

interface DailyData {
  date: string;
  [key: string]: any;
}

export const useEmailChartData = (logs: EmailLog[]) => {
  return useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        dailyActivity: [],
        deliverySuccessData: [],
        engagementData: [],
        providerPerformance: [],
        emailTypeDistribution: [],
        timeToOpenTrend: [],
        providers: [],
      };
    }

    // Group by date
    const groupedByDate = logs.reduce((acc, log) => {
      const date = new Date(log.sent_at).toLocaleDateString('sv-SE');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(log);
      return acc;
    }, {} as Record<string, EmailLog[]>);

    // Get unique providers
    const providers = [...new Set(logs.map(log => log.provider || 'unknown'))];

    // Daily Activity by Provider
    const dailyActivity = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const dataPoint: DailyData = { date };
        providers.forEach(provider => {
          const providerLogs = dayLogs.filter(l => (l.provider || 'unknown') === provider);
          dataPoint[provider] = providerLogs.length;
          dataPoint[`${provider}_cost`] = providerLogs.reduce((sum, l) => sum + (l.cost || 0), 0);
        });
        return dataPoint;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Delivery Success Data
    const deliverySuccessData = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const delivered = dayLogs.filter(l => l.status === 'delivered').length;
        const bounced = dayLogs.filter(l => l.status === 'bounced' || l.status === 'failed').length;
        const total = dayLogs.length;
        return {
          date,
          deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
          totalEmails: total,
          delivered,
          bounced,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Engagement Data (Opens & Clicks)
    const engagementData = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const delivered = dayLogs.filter(l => l.status === 'delivered').length;
        const opened = dayLogs.filter(l => l.opened_at).length;
        const clicked = dayLogs.filter(l => l.clicked_at).length;
        return {
          date,
          openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
          clickRate: delivered > 0 ? (clicked / delivered) * 100 : 0,
          opened,
          clicked,
          delivered,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Provider Performance
    const providerPerformance = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const dataPoint: DailyData = { date };
        providers.forEach(provider => {
          const providerLogs = dayLogs.filter(l => (l.provider || 'unknown') === provider);
          const delivered = providerLogs.filter(l => l.status === 'delivered').length;
          const opened = providerLogs.filter(l => l.opened_at).length;
          
          dataPoint[`${provider}_count`] = providerLogs.length;
          dataPoint[`${provider}_deliveryRate`] = providerLogs.length > 0
            ? (delivered / providerLogs.length) * 100
            : 0;
          dataPoint[`${provider}_openRate`] = delivered > 0
            ? (opened / delivered) * 100
            : 0;
        });
        return dataPoint;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Email Type Distribution
    const emailTypeDistribution = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => ({
        date,
        booking_confirmation: dayLogs.filter(l => l.message_type === 'booking_confirmation').length,
        reminder: dayLogs.filter(l => l.message_type === 'reminder').length,
        cancellation: dayLogs.filter(l => l.message_type === 'cancellation').length,
        general: dayLogs.filter(l => !l.message_type || l.message_type === 'general').length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Time to Open Trend
    const timeToOpenTrend = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const emailsWithOpen = dayLogs.filter(l => l.opened_at && l.sent_at);
        const times = emailsWithOpen.map(l => {
          const sent = new Date(l.sent_at).getTime();
          const opened = new Date(l.opened_at!).getTime();
          return (opened - sent) / 1000 / 60; // minutes
        });
        
        return {
          date,
          avgTimeToOpen: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
          minTimeToOpen: times.length > 0 ? Math.min(...times) : 0,
          maxTimeToOpen: times.length > 0 ? Math.max(...times) : 0,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      dailyActivity,
      deliverySuccessData,
      engagementData,
      providerPerformance,
      emailTypeDistribution,
      timeToOpenTrend,
      providers,
    };
  }, [logs]);
};
