import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Settings, Bell, TrendingUp, AlertCircle, Eye } from 'lucide-react';
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

export default function NotificationsPage() {
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const { notifications, isLoading, unreadCount, markAllAsRead, markAsRead, deleteNotification } = useOwnerNotifications();
  const chartData = useNotificationChartData(notifications);
  const readCount = notifications.filter(n => n.read_at).length;
  const highPriority = notifications.filter(n => n.priority === 'high').length;

  const handleRefresh = () => {
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Typ', 'Titel', 'Prioritet', 'Status', 'Kanaler', 'Skickat', 'Läst'].join(','),
      ...notifications.map((n) => [
        n.notification_type || '-',
        `"${n.title?.replace(/"/g, '""') || '-'}"`,
        n.priority || '-',
        n.status || '-',
        n.channel?.join(';') || '-',
        n.sent_at || '-',
        n.read_at || '-',
      ].join(','))
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
      {/* Hero Section - COMPACT & MODERN */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradient overlays */}
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
        {/* Extra små snowflakes för depth */}
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_35s_linear_infinite]" />
        </div>
        <div className="absolute top-1/3 left-1/3 w-[180px] h-[180px] opacity-[0.025] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* UPPERCASE label med accent line */}
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Notifikationer
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Alla dina systemnotifikationer i realtid
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions - Dekorativa accenter */}
      <section className="relative py-8 border-y border-primary/10">
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline" className="text-sm font-medium">
                  {notifications.length} notifikationer
                </Badge>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-sm font-medium">
                    {unreadCount} olästa
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => markAllAsRead()} 
                  disabled={unreadCount === 0}
                  className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Markera alla lästa
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview - Egen section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard 
                title="Totalt Notifikationer" 
                value={notifications.length} 
                icon={Bell} 
                color="text-purple-600" 
                subtitle="Alla typer" 
              />
              <PremiumTelephonyStatCard 
                title="Skickade" 
                value={notifications.filter(n => n.status === 'sent').length} 
                icon={TrendingUp} 
                color="text-green-600" 
                subtitle={`${unreadCount} olästa`} 
              />
              <PremiumTelephonyStatCard 
                title="Läsningsgrad" 
                value={`${notifications.length > 0 ? ((readCount/notifications.length)*100).toFixed(0) : 0}%`} 
                icon={Eye} 
                color="text-blue-600" 
                subtitle={`${readCount} lästa`} 
              />
              <PremiumTelephonyStatCard 
                title="Hög Prioritet" 
                value={highPriority} 
                icon={AlertCircle} 
                color="text-red-600" 
                subtitle="Viktiga" 
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

      {/* Settings Overview */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={400}>
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Notifikationsinställningar</h2>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Hantera
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-purple-600" />
                    Email
                  </h3>
                  <p className="text-sm text-muted-foreground">Aktiverade typer: Bokningar, Reviews, Betalningar</p>
                </Card>
                <Card className="p-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-green-600" />
                    SMS
                  </h3>
                  <p className="text-sm text-muted-foreground">Aktiverade typer: Kritiska händelser, Hög prioritet</p>
                </Card>
                <Card className="p-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    Push
                  </h3>
                  <p className="text-sm text-muted-foreground">Aktiverade typer: Alla notifikationer</p>
                </Card>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Notifications List */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={500}>
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Senaste Notifikationer</h2>
                <p className="text-sm text-muted-foreground">
                  Visar {notifications.length} notifikationer
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Inga notifikationer ännu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 10).map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`p-4 transition-all hover:shadow-md ${!notification.read_at ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {notification.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.notification_type}
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-1">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Kanaler: {notification.channel?.join(', ')}</span>
                            {notification.sent_at && <span>Skickat: {new Date(notification.sent_at).toLocaleString('sv-SE')}</span>}
                          </div>
                        </div>
                        {!notification.read_at && (
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
