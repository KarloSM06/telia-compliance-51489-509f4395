import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Bell, Mail, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useOwnerNotifications } from '@/hooks/useOwnerNotifications';
import { useNotificationChartData } from '@/hooks/useNotificationChartData';
import { NotificationsActivityChart } from '@/components/notifications/charts/NotificationsActivityChart';
import { ReadRateChart } from '@/components/notifications/charts/ReadRateChart';
import { NotificationTypeDistributionChart } from '@/components/notifications/charts/NotificationTypeDistributionChart';
import { PriorityDistributionChart } from '@/components/notifications/charts/PriorityDistributionChart';
import { ChannelDistributionChart } from '@/components/notifications/charts/ChannelDistributionChart';
import { NotificationResponseTimeTrendChart } from '@/components/notifications/charts/NotificationResponseTimeTrendChart';
import { PremiumStatCard } from '@/components/ui/premium-stat-card';
import { Badge } from '@/components/ui/badge';

export default function NotificationAnalytics() {
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const { notifications, isLoading, markAsRead } = useOwnerNotifications();
  const chartData = useNotificationChartData(notifications);

  // Calculate stats
  const stats = useMemo(() => {
    const total = notifications.length;
    const sent = notifications.filter(n => n.status === 'sent').length;
    const read = notifications.filter(n => n.read_at).length;
    const readRate = sent > 0 ? (read / sent) * 100 : 0;

    // Calculate average read time
    const notifsWithReadTime = notifications.filter(n => n.sent_at && n.read_at);
    const avgReadTimeMinutes = notifsWithReadTime.length > 0
      ? notifsWithReadTime.reduce((sum, n) => {
          const sent = new Date(n.sent_at!).getTime();
          const read = new Date(n.read_at!).getTime();
          return sum + (read - sent) / 1000 / 60;
        }, 0) / notifsWithReadTime.length
      : 0;

    // Most used channel
    const channelCounts: Record<string, number> = {};
    notifications.forEach(n => {
      n.channel.forEach(ch => {
        channelCounts[ch] = (channelCounts[ch] || 0) + 1;
      });
    });
    const topChannel = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      total,
      sent,
      read,
      readRate,
      avgReadTimeMinutes,
      topChannel: topChannel ? topChannel[0] : 'N/A',
    };
  }, [notifications]);

  const handleRefresh = () => {
    toast.success('Data uppdaterad');
    window.location.reload();
  };

  const handleExport = () => {
    const headers = ['Datum', 'Typ', 'Prioritet', 'Status', 'Kanaler', 'Skickat', 'Läst'];
    const rows = notifications.map(n => [
      n.created_at,
      n.notification_type,
      n.priority,
      n.status,
      n.channel.join(', '),
      n.sent_at || 'N/A',
      n.read_at || 'N/A',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Notifikationsanalys</h1>
          <p className="text-lg opacity-90">
            AI-driven analys av notifikationer och användarengagemang
          </p>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
      </div>

      {/* Quick Actions Bar */}
      <section className="relative py-4 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="bg-green-500">Live</Badge>
            <Badge variant="outline">{notifications.length} notifikationer</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Uppdatera
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </section>

      {/* AI Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <PremiumStatCard
          title="Total Notifikationer"
          value={stats.total}
          icon={<Bell className="h-6 w-6" />}
        />
        <PremiumStatCard
          title="Läsfrekvens"
          value={`${stats.readRate.toFixed(1)}%`}
          icon={<Mail className="h-6 w-6" />}
        />
        <PremiumStatCard
          title="Genomsnittlig läsningstid"
          value={`${stats.avgReadTimeMinutes.toFixed(0)} min`}
          icon={<Clock className="h-6 w-6" />}
        />
        <PremiumStatCard
          title="Vanligaste kanalen"
          value={stats.topChannel}
          icon={<MessageSquare className="h-6 w-6" />}
        />
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Statistik & Trender
        </h2>
        <div className="flex gap-2">
          <Button
            variant={dateRangeDays === 7 ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRangeDays(7)}
          >
            7 dagar
          </Button>
          <Button
            variant={dateRangeDays === 30 ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRangeDays(30)}
          >
            30 dagar
          </Button>
          <Button
            variant={dateRangeDays === 90 ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRangeDays(90)}
          >
            90 dagar
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <NotificationsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
        <ReadRateChart data={chartData.readRateData} isLoading={isLoading} />
        <NotificationTypeDistributionChart data={chartData.typeDistribution} isLoading={isLoading} />
        <PriorityDistributionChart data={chartData.priorityDistribution} isLoading={isLoading} />
        <ChannelDistributionChart data={chartData.channelDistribution} isLoading={isLoading} />
        <NotificationResponseTimeTrendChart data={chartData.responseTimeTrend} isLoading={isLoading} />
      </div>
    </div>
  );
}
