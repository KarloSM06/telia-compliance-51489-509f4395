import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RefreshCw, Settings, Download, MessageSquare, TrendingUp, DollarSign, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { useSMSChartData } from "@/hooks/useSMSChartData";
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { SMSTable } from "@/components/messages/SMSTable";
import { SMSFilters, SMSFilterValues } from "@/components/messages/SMSFilters";
import { SMSDetailDrawer } from "@/components/messages/SMSDetailDrawer";
import { MessageProvidersDialog } from "@/components/messages/MessageProvidersDialog";
import { SMSActivityChart } from '@/components/sms/charts/SMSActivityChart';
import { DeliveryRateChart } from '@/components/sms/charts/DeliveryRateChart';
import { MessageTypeDistributionChart } from '@/components/sms/charts/MessageTypeDistributionChart';
import { formatCostInSEK } from '@/lib/telephonyFormatters';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function SMSPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showProvidersDialog, setShowProvidersDialog] = useState(false);
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [filters, setFilters] = useState<SMSFilterValues>({
    search: '',
    status: 'all',
    direction: 'all',
  });

  const { logs, stats, isLoading } = useMessageLogs({
    channel: 'sms',
    status: filters.status === 'all' ? undefined : filters.status,
    dateFrom: filters.dateFrom?.toISOString().split('T')[0],
    dateTo: filters.dateTo?.toISOString().split('T')[0],
  });

  const chartData = useSMSChartData(logs);

  // Calculate provider statistics
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
    return Array.from(statsMap.entries()).map(([provider, data]) => ({
      provider,
      ...data,
    }));
  }, [logs]);

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    return logs.filter((message) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          message.recipient?.includes(searchLower) ||
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
      ['Telefonnummer', 'Status', 'Meddelande', 'Skickat', 'Levererat', 'Kostnad'].join(','),
      ...filteredMessages.map((msg) =>
        [
          msg.recipient || '-',
          msg.status || '-',
          `"${msg.message_body?.replace(/"/g, '""') || '-'}"`,
          msg.sent_at || '-',
          msg.delivered_at || '-',
          msg.cost || 0,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sms-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  const deliveryRate = stats.total > 0 ? (stats.sent / stats.total) * 100 : 0;

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

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                SMS
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Alla dina SMS-meddelanden i realtid
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
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline" className="text-sm font-medium">
                  {filteredMessages.length} av {logs.length} meddelanden
                </Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowProvidersDialog(true)} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Settings className="h-4 w-4 mr-2" />
                  Leverantörer
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
                title="Totalt SMS" 
                value={stats.total} 
                icon={MessageSquare} 
                color="text-green-600" 
                subtitle={`${stats.inbound} inkommande`} 
              />
              <PremiumTelephonyStatCard 
                title="Leveransgrad" 
                value={`${deliveryRate.toFixed(1)}%`} 
                icon={TrendingUp} 
                color="text-blue-600" 
                subtitle={`${stats.sent} levererade`} 
              />
              <PremiumTelephonyStatCard 
                title="Utgående SMS" 
                value={stats.outbound} 
                icon={Send} 
                color="text-purple-600" 
                subtitle={`${stats.reviews} recensioner`} 
              />
              <PremiumTelephonyStatCard 
                title="Total Kostnad" 
                value={formatCostInSEK(stats.smsCost)} 
                icon={DollarSign} 
                color="text-orange-600" 
                subtitle={`≈ $${stats.smsCost.toFixed(4)} USD`} 
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
                  <Button variant={dateRangeDays === 7 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(7)}>7 dagar</Button>
                  <Button variant={dateRangeDays === 30 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(30)}>30 dagar</Button>
                  <Button variant={dateRangeDays === 90 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(90)}>90 dagar</Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SMSActivityChart data={chartData.dailyActivity} providers={chartData.providers} isLoading={isLoading} />
              <DeliveryRateChart data={chartData.deliveryRateData} isLoading={isLoading} />
              <MessageTypeDistributionChart data={chartData.messageTypeDistribution} isLoading={isLoading} />
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Riktningsanalys</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Provider Performance</div></Card>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg"><div className="h-[280px] flex items-center justify-center text-muted-foreground">Svarstider</div></Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Provider Overview */}
      {providerStats.length > 0 && (
        <section className="relative py-12">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={400}>
              <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
                <h2 className="text-xl font-semibold mb-4">Leverantörsöversikt</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {providerStats.map((provider) => (
                    <Card key={provider.provider} className="p-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <h3 className="font-semibold mb-2">{provider.provider}</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>SMS:</span><span className="font-medium">{provider.count}</span></div>
                        <div className="flex justify-between"><span>Kostnad:</span><span className="font-medium">{formatCostInSEK(provider.cost)}</span></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Messages Table */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={500}>
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Meddelanden</h2>
                <p className="text-sm text-muted-foreground">Visar {filteredMessages.length} av {logs.length} meddelanden</p>
              </div>
              <SMSFilters onFilterChange={setFilters} />
              <div className="mt-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <SMSTable messages={filteredMessages} onViewDetails={setSelectedMessage} />
                )}
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {/* Drawers & Dialogs */}
      <SMSDetailDrawer message={selectedMessage} open={!!selectedMessage} onClose={() => setSelectedMessage(null)} />
      <MessageProvidersDialog open={showProvidersDialog} onClose={() => setShowProvidersDialog(false)} providers={providerStats} type="sms" />
    </div>
  );
}
