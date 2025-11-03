import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Bell, Clock, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useOwnerNotifications } from '@/hooks/useOwnerNotifications';
import { useNotificationChartData } from '@/hooks/useNotificationChartData';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { NotificationsActivityChart } from '@/components/notifications/charts/NotificationsActivityChart';
import { ReadRateChart } from '@/components/notifications/charts/ReadRateChart';
import { NotificationTypeDistributionChart } from '@/components/notifications/charts/NotificationTypeDistributionChart';
import { PriorityDistributionChart } from '@/components/notifications/charts/PriorityDistributionChart';
import { ChannelDistributionChart } from '@/components/notifications/charts/ChannelDistributionChart';
import { NotificationResponseTimeTrendChart } from '@/components/notifications/charts/NotificationResponseTimeTrendChart';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';
import { useQueryClient } from '@tanstack/react-query';

export default function NotificationAnalytics() {
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const { notifications, isLoading } = useOwnerNotifications();
  const chartData = useNotificationChartData(notifications);
  const queryClient = useQueryClient();

  // Calculate stats
  const stats = useMemo(() => {
    const totalNotifications = notifications.length;
    const sent = notifications.filter(n => n.status === 'sent').length;
    const read = notifications.filter(n => n.read_at).length;
    const readRate = sent > 0 ? (read / sent) * 100 : 0;
    
    // Avg read time (from sent_at to read_at in minutes)
    const readTimes = notifications
      .filter(n => n.sent_at && n.read_at)
      .map(n => {
        const sentTime = new Date(n.sent_at!).getTime();
        const readTime = new Date(n.read_at!).getTime();
        return (readTime - sentTime) / 1000 / 60; // minutes
      });
    const avgReadTime = readTimes.length > 0 
      ? readTimes.reduce((a, b) => a + b, 0) / readTimes.length 
      : 0;
    
    // Most common channel
    const channelCounts: Record<string, number> = {};
    notifications.forEach(n => {
      n.channel.forEach(ch => {
        channelCounts[ch] = (channelCounts[ch] || 0) + 1;
      });
    });
    const topChannel = Object.entries(channelCounts)
      .sort((a, b) => b[1] - a[1])[0];
    
    return {
      total: totalNotifications,
      sent,
      read,
      readRate,
      avgReadTime,
      topChannel: topChannel ? topChannel[0] : 'email',
    };
  }, [notifications]);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await queryClient.invalidateQueries({ queryKey: ['owner-notifications'] });
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Typ', 'Prioritet', 'Status', 'Kanaler', 'Skickat', 'Läst', 'Skapad'].join(','),
      ...notifications.map((n) =>
        [
          n.notification_type,
          n.priority,
          n.status,
          n.channel.join(';'),
          n.sent_at || '-',
          n.read_at || '-',
          n.created_at,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notifications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_35s_linear_infinite]" />
        </div>
        <div className="absolute top-1/3 left-1/3 w-[180px] h-[180px] opacity-[0.025] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Notifikationer
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Alla dina notifikationer och påminnelser i realtid
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
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
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard 
                title="Total Notifikationer" 
                value={stats.total} 
                icon={Bell} 
                color="text-blue-600" 
                subtitle={`${stats.sent} skickade`} 
              />
              <PremiumTelephonyStatCard 
                title="Läsfrekvens" 
                value={`${stats.readRate.toFixed(0)}%`} 
                icon={CheckCircle} 
                color="text-green-600" 
                subtitle={`${stats.read} av ${stats.sent} lästa`} 
              />
              <PremiumTelephonyStatCard 
                title="Genomsnittlig läsningstid" 
                value={stats.avgReadTime > 60 ? `${(stats.avgReadTime / 60).toFixed(0)}h` : `${stats.avgReadTime.toFixed(0)}min`} 
                icon={Clock} 
                color="text-purple-600" 
                subtitle="från skickad till läst" 
              />
              <PremiumTelephonyStatCard 
                title="Vanligaste kanalen" 
                value={stats.topChannel.toUpperCase()} 
                icon={Mail} 
                color="text-orange-600" 
                subtitle="mest använd" 
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Charts Section */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Statistik & Analys
                  </h2>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full" />
                </div>
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
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NotificationsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
              <ReadRateChart data={chartData.readRateData} isLoading={isLoading} />
              <NotificationTypeDistributionChart data={chartData.typeDistribution} isLoading={isLoading} />
              <PriorityDistributionChart data={chartData.priorityDistribution} isLoading={isLoading} />
              <ChannelDistributionChart data={chartData.channelDistribution} isLoading={isLoading} />
              <NotificationResponseTimeTrendChart data={chartData.responseTimeTrend} isLoading={isLoading} />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
