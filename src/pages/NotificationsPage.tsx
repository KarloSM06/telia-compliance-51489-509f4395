import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bell, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { useOwnerNotifications } from '@/hooks/useOwnerNotifications';
import { useNotificationChartData } from '@/hooks/useNotificationChartData';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { NotificationsActivityChart } from '@/components/notifications/charts/NotificationsActivityChart';
import { ReadRateChart } from '@/components/notifications/charts/ReadRateChart';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function NotificationsPage() {
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const { notifications, isLoading, unreadCount } = useOwnerNotifications();
  const chartData = useNotificationChartData(notifications);
  const readCount = notifications.filter(n => n.read_at).length;
  const highPriority = notifications.filter(n => n.priority === 'high').length;

  return (
    <div className="min-h-screen">
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Notifikationer</h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">Alla dina systemnotifikationer</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard title="Totalt Notifikationer" value={notifications.length} icon={Bell} color="text-purple-600" subtitle="Alla typer" />
              <PremiumTelephonyStatCard title="Skickade" value={notifications.filter(n => n.status === 'sent').length} icon={TrendingUp} color="text-green-600" subtitle={`${unreadCount} olästa`} />
              <PremiumTelephonyStatCard title="Lästa" value={`${notifications.length > 0 ? ((readCount/notifications.length)*100).toFixed(0) : 0}%`} icon={Eye} color="text-blue-600" subtitle={`${readCount} lästa`} />
              <PremiumTelephonyStatCard title="Hög Prioritet" value={highPriority} icon={AlertCircle} color="text-red-600" subtitle="Viktiga" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Statistik & Analys</h2>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NotificationsActivityChart data={chartData.dailyActivity} isLoading={isLoading} />
              <ReadRateChart data={chartData.readRateData} isLoading={isLoading} />
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Type Distribution</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Priority Distribution</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Channel Distribution</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Response Time</div></Card>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
