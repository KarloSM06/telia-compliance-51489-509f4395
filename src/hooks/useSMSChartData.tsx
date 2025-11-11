import { useMemo } from 'react';

interface SMSLog {
  id: string;
  sent_at: string;
  status: string;
  provider: string;
  direction?: string;
  cost?: number;
  message_type?: string;
  delivered_at?: string;
}

interface DailyData {
  date: string;
  [key: string]: any;
}

export const useSMSChartData = (logs: SMSLog[]) => {
  return useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        dailyActivity: [],
        deliveryRateData: [],
        providerPerformance: [],
        directionAnalysis: [],
        messageTypeDistribution: [],
        responseTimeTrend: [],
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
    }, {} as Record<string, SMSLog[]>);

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

    // Delivery Rate Data
    const deliveryRateData = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const delivered = dayLogs.filter(l => l.status === 'delivered').length;
        const failed = dayLogs.filter(l => l.status === 'failed').length;
        const total = dayLogs.length;
        return {
          date,
          deliveryRate: total > 0 ? (delivered / total) * 100 : 0,
          totalSMS: total,
          delivered,
          failed,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Provider Performance
    const providerPerformance = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => {
        const dataPoint: DailyData = { date };
        providers.forEach(provider => {
          const providerLogs = dayLogs.filter(l => (l.provider || 'unknown') === provider);
          dataPoint[`${provider}_count`] = providerLogs.length;
          dataPoint[`${provider}_cost`] = providerLogs.reduce((sum, l) => sum + (l.cost || 0), 0);
          dataPoint[`${provider}_avg_cost`] = providerLogs.length > 0
            ? providerLogs.reduce((sum, l) => sum + (l.cost || 0), 0) / providerLogs.length
            : 0;
        });
        return dataPoint;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Direction Analysis
    const directionAnalysis = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => ({
        date,
        inbound: dayLogs.filter(l => l.direction === 'inbound').length,
        outbound: dayLogs.filter(l => l.direction === 'outbound').length,
        inboundCost: dayLogs.filter(l => l.direction === 'inbound').reduce((sum, l) => sum + (l.cost || 0), 0),
        outboundCost: dayLogs.filter(l => l.direction === 'outbound').reduce((sum, l) => sum + (l.cost || 0), 0),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Message Type Distribution
    const messageTypeDistribution = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => ({
        date,
        review: dayLogs.filter(l => l.message_type === 'review').length,
        reminder: dayLogs.filter(l => l.message_type === 'reminder').length,
        booking: dayLogs.filter(l => l.message_type === 'booking').length,
        general: dayLogs.filter(l => !l.message_type || l.message_type === 'general').length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Response Time Trend (mock data for now - would need conversation threading)
    const responseTimeTrend = Object.entries(groupedByDate)
      .map(([date, dayLogs]) => ({
        date,
        avgResponseTime: 0, // Would need actual conversation data
        minResponseTime: 0,
        maxResponseTime: 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      dailyActivity,
      deliveryRateData,
      providerPerformance,
      directionAnalysis,
      messageTypeDistribution,
      responseTimeTrend,
      providers,
    };
  }, [logs]);
};
