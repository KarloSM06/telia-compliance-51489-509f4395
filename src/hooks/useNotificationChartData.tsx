import { useMemo } from 'react';

interface Notification {
  id: string;
  created_at: string;
  notification_type: string;
  priority: string;
  status: string;
  channel: string[];
  sent_at?: string;
  read_at?: string;
}

interface DailyData {
  date: string;
  [key: string]: any;
}

export const useNotificationChartData = (notifications: Notification[]) => {
  return useMemo(() => {
    if (!notifications || notifications.length === 0) {
      return {
        dailyActivity: [],
        readRateData: [],
        typeDistribution: [],
        priorityDistribution: [],
        channelDistribution: [],
        responseTimeTrend: [],
      };
    }

    // Group by date
    const groupedByDate = notifications.reduce((acc, notif) => {
      const date = new Date(notif.created_at).toLocaleDateString('sv-SE');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(notif);
      return acc;
    }, {} as Record<string, Notification[]>);

    // Daily Activity
    const dailyActivity = Object.entries(groupedByDate)
      .map(([date, dayNotifs]) => ({
        date,
        totalNotifications: dayNotifs.length,
        sent: dayNotifs.filter(n => n.status === 'sent').length,
        read: dayNotifs.filter(n => n.read_at).length,
        pending: dayNotifs.filter(n => n.status === 'pending').length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Read Rate Data
    const readRateData = Object.entries(groupedByDate)
      .map(([date, dayNotifs]) => {
        const sent = dayNotifs.filter(n => n.status === 'sent').length;
        const read = dayNotifs.filter(n => n.read_at).length;
        return {
          date,
          readRate: sent > 0 ? (read / sent) * 100 : 0,
          totalSent: sent,
          totalRead: read,
          unread: sent - read,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Notification Type Distribution
    const typeDistribution = Object.entries(groupedByDate)
      .map(([date, dayNotifs]) => {
        const types = ['booking', 'review', 'message_failed', 'system', 'other'];
        const dataPoint: DailyData = { date };
        types.forEach(type => {
          dataPoint[type] = dayNotifs.filter(n => n.notification_type === type).length;
        });
        return dataPoint;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Priority Distribution over time
    const priorityDistribution = Object.entries(groupedByDate)
      .map(([date, dayNotifs]) => ({
        date,
        high: dayNotifs.filter(n => n.priority === 'high').length,
        medium: dayNotifs.filter(n => n.priority === 'medium').length,
        low: dayNotifs.filter(n => n.priority === 'low').length,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Channel Distribution
    const channelDistribution = Object.entries(groupedByDate)
      .map(([date, dayNotifs]) => {
        // Count how many notifications use each channel
        let emailCount = 0;
        let smsCount = 0;
        let pushCount = 0;

        dayNotifs.forEach(n => {
          if (n.channel.includes('email')) emailCount++;
          if (n.channel.includes('sms')) smsCount++;
          if (n.channel.includes('push')) pushCount++;
        });

        return {
          date,
          email: emailCount,
          sms: smsCount,
          push: pushCount,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Response Time Trend (time from sent to read)
    const responseTimeTrend = Object.entries(groupedByDate)
      .map(([date, dayNotifs]) => {
        const notifsWithReadTime = dayNotifs.filter(n => n.sent_at && n.read_at);
        const times = notifsWithReadTime.map(n => {
          const sent = new Date(n.sent_at!).getTime();
          const read = new Date(n.read_at!).getTime();
          return (read - sent) / 1000 / 60; // minutes
        });

        return {
          date,
          avgResponseTime: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
          minResponseTime: times.length > 0 ? Math.min(...times) : 0,
          maxResponseTime: times.length > 0 ? Math.max(...times) : 0,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      dailyActivity,
      readRateData,
      typeDistribution,
      priorityDistribution,
      channelDistribution,
      responseTimeTrend,
    };
  }, [notifications]);
};
