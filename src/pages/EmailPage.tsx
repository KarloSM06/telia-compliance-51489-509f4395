import { useState, useMemo } from "react";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Download, Settings, Mail, TrendingUp, MousePointerClick, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { useEmailChartData } from "@/hooks/useEmailChartData";
import { EmailStatsCards } from "@/components/messages/EmailStatsCards";
import { EmailTable } from "@/components/messages/EmailTable";
import { EmailFilters, EmailFilterValues } from "@/components/messages/EmailFilters";
import { EmailDetailDrawer } from "@/components/messages/EmailDetailDrawer";
import { MessageProvidersDialog } from "@/components/messages/MessageProvidersDialog";
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { EmailActivityChart } from '@/components/email/charts/EmailActivityChart';
import { EngagementChart } from '@/components/email/charts/EngagementChart';
import { formatCostInSEK } from '@/lib/telephonyFormatters';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function EmailPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showProvidersDialog, setShowProvidersDialog] = useState(false);
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [filters, setFilters] = useState<EmailFilterValues>({
    search: '',
    status: 'all',
  });

  const { logs, stats, isLoading } = useMessageLogs({
    channel: 'email',
    status: filters.status === 'all' ? undefined : filters.status,
    dateFrom: filters.dateFrom?.toISOString().split('T')[0],
    dateTo: filters.dateTo?.toISOString().split('T')[0],
  });

  const chartData = useEmailChartData(logs);

  const emailStats = {
    total: stats.total,
    sent: stats.sent,
    opened: logs.filter(l => l.opened_at).length,
    clicked: logs.filter(l => l.clicked_at).length,
    failed: stats.failed,
    cost: stats.emailCost,
  };

  const providerStats = useMemo(() => {
    const statsMap = new Map<string, { count: number; cost: number }>();
    logs.forEach((log) => {
      const provider = log.provider || 'unknown';
      const current = statsMap.get(provider) || { count: 0, cost: 0 };
      statsMap.set(provider, {
        count: current.count + 1,
        cost: current.cost + (log.cost || 0),
      });
    });
    return Array.from(statsMap.entries()).map(([provider, data]) => ({ provider, ...data }));
  }, [logs]);

  const filteredMessages = useMemo(() => {
    return logs.filter((message) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          message.recipient?.toLowerCase().includes(searchLower) ||
          message.subject?.toLowerCase().includes(searchLower) ||
          message.message_body?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [logs, filters.search]);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await queryClient.invalidateQueries({ queryKey: ['message-logs', user?.id] });
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Mottagare', 'Ämne', 'Status', 'Skickat', 'Levererat', 'Öppnat', 'Klickat'].join(','),
      ...filteredMessages.map((msg) => [
        msg.recipient || '-',
        msg.subject || '-',
        msg.status || '-',
        msg.sent_at || '-',
        msg.delivered_at || '-',
        msg.opened_at || '-',
        msg.clicked_at || '-'
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  const openRate = emailStats.sent > 0 ? (emailStats.opened / emailStats.sent) * 100 : 0;
  const clickRate = emailStats.sent > 0 ? (emailStats.clicked / emailStats.sent) * 100 : 0;

  return (
    <div className="min-h-screen">
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">Email</h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">Alla dina email-meddelanden i realtid</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline">{filteredMessages.length} av {logs.length} meddelanden</Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Uppdatera</Button>
                <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
                <Button variant="outline" size="sm" onClick={() => setShowProvidersDialog(true)}><Settings className="h-4 w-4 mr-2" />Leverantörer</Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard title="Totalt Email" value={emailStats.total} icon={Mail} color="text-blue-600" subtitle={`${emailStats.sent} skickade`} />
              <PremiumTelephonyStatCard title="Leveransgrad" value={`${((emailStats.sent/Math.max(emailStats.total,1))*100).toFixed(1)}%`} icon={TrendingUp} color="text-green-600" subtitle={`${emailStats.failed} misslyckade`} />
              <PremiumTelephonyStatCard title="Öppningsgrad" value={`${openRate.toFixed(1)}%`} icon={Eye} color="text-purple-600" subtitle={`${emailStats.opened} öppnade`} />
              <PremiumTelephonyStatCard title="Klickgrad" value={`${clickRate.toFixed(1)}%`} icon={MousePointerClick} color="text-orange-600" subtitle={`${emailStats.clicked} klickade`} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 mb-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Statistik & Analys</h2>
                <div className="flex gap-2">
                  <Button variant={dateRangeDays === 7 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(7)}>7 dagar</Button>
                  <Button variant={dateRangeDays === 30 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(30)}>30 dagar</Button>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EmailActivityChart data={chartData.dailyActivity} providers={chartData.providers} isLoading={isLoading} />
              <EngagementChart data={chartData.engagementData} isLoading={isLoading} />
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Email Types</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Provider Performance</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Delivery Success</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Time to Open</div></Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={400}>
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Meddelanden</h2>
                <p className="text-sm text-muted-foreground">Visar {filteredMessages.length} av {logs.length}</p>
              </div>
              <EmailFilters onFilterChange={setFilters} />
              <div className="mt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <EmailTable messages={filteredMessages} onViewDetails={setSelectedMessage} />
                )}
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <EmailDetailDrawer message={selectedMessage} open={!!selectedMessage} onClose={() => setSelectedMessage(null)} />
      <MessageProvidersDialog open={showProvidersDialog} onClose={() => setShowProvidersDialog(false)} providers={providerStats} type="email" />
    </div>
  );
}
