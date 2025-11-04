import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, Settings, Download, Phone, Clock, DollarSign, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useTelephonyMetrics } from '@/hooks/useTelephonyMetrics';
import { useTelephonyChartData } from '@/hooks/useTelephonyChartData';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { useDateRangeStore } from '@/stores/useDateRangeStore';
import { EventsTable } from '@/components/telephony/EventsTable';
import { EventFilters, EventFilterValues } from '@/components/telephony/EventFilters';
import { ProviderManagementDialog } from '@/components/telephony/ProviderManagementDialog';
import { EventDetailDrawer } from '@/components/telephony/EventDetailDrawer';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { IntegrationQuickView } from '@/components/integrations/IntegrationQuickView';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { TelephonyActivityChart } from '@/components/telephony/charts/TelephonyActivityChart';
import { SuccessRateChart } from '@/components/telephony/charts/SuccessRateChart';
import { ProviderPerformanceChart } from '@/components/telephony/charts/ProviderPerformanceChart';
import { CallDirectionChart } from '@/components/telephony/charts/CallDirectionChart';
import { AvgDurationTrendChart } from '@/components/telephony/charts/AvgDurationTrendChart';
import { EventTypeDistributionChart } from '@/components/telephony/charts/EventTypeDistributionChart';
import { supabase } from '@/integrations/supabase/client';
import { formatDuration, formatCostInSEK, getProviderDisplayName, getProviderLogo, formatRelativeTime } from '@/lib/telephonyFormatters';
import { cn } from '@/lib/utils';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function TelephonyPage() {
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { dateRange, setPreset } = useDateRangeStore();
  const [filters, setFilters] = useState<EventFilterValues>({
    search: '',
    provider: 'all',
    eventType: 'all',
    direction: 'all',
    status: 'all',
    callStatus: 'all',
  });
  
  // Calculate current preset from global dateRange
  const dateRangeDays = Math.round(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
  );

  const { integrations, getByCapability } = useIntegrations();
  const { metrics, isLoading, refetch } = useTelephonyMetrics();
  const chartData = useTelephonyChartData(metrics.events || []);
  const { syncNumbers, isSyncing } = usePhoneNumbers();

  const telephonyProviders = getByCapability('voice').concat(getByCapability('sms'));

  // Filter events based on filters
  const filteredEvents = useMemo(() => {
    return metrics.events.filter((event) => {
      // Filter out child events (linked to parent)
      if (event.parent_event_id) return false;
      
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          event.id?.toLowerCase().includes(searchLower) ||
          event.from_number?.includes(searchLower) ||
          event.to_number?.includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Provider filter - check both main provider and cost breakdown
      if (filters.provider !== 'all') {
        const hasProvider = event.provider === filters.provider || 
                          (event.cost_breakdown && Object.keys(event.cost_breakdown).includes(filters.provider));
        if (!hasProvider) return false;
      }

      // Event type filter
      if (filters.eventType !== 'all') {
        if (filters.eventType === 'call' && !event.event_type.includes('call')) return false;
        if (filters.eventType === 'sms' && !event.event_type.includes('sms')) return false;
        if (filters.eventType === 'transcript' && !event.event_type.includes('transcript')) return false;
        if (filters.eventType === 'recording' && !event.event_type.includes('recording')) return false;
      }

      // Direction filter
      if (filters.direction !== 'all' && event.direction !== filters.direction) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all') {
        const status = event.status?.toLowerCase() || '';
        if (filters.status === 'completed' && !status.includes('complet') && !status.includes('answer')) {
          return false;
        }
        if (filters.status === 'failed' && !status.includes('fail')) {
          return false;
        }
        if (filters.status === 'pending' && !status.includes('progress') && !status.includes('pending')) {
          return false;
        }
      }

      // Call status filter (in-progress vs completed)
      if (filters.callStatus && filters.callStatus !== 'all') {
        const normalized = event.normalized as any;
        const isInProgress = !normalized?.endedAt && !normalized?.endedReason;
        if (filters.callStatus === 'in-progress' && !isInProgress) return false;
        if (filters.callStatus === 'completed' && isInProgress) return false;
      }

      // Date filters
      if (filters.dateFrom) {
        const eventDate = new Date(event.event_timestamp);
        if (eventDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const eventDate = new Date(event.event_timestamp);
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (eventDate > endOfDay) return false;
      }

      return true;
    });
  }, [metrics.events, filters]);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await refetch();
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Provider', 'Event Type', 'Direction', 'From', 'To', 'Duration', 'Cost', 'Status', 'Timestamp'].join(','),
      ...filteredEvents.map((event) =>
        [
          event.provider,
          event.event_type,
          event.direction || '-',
          event.from_number || '-',
          event.to_number || '-',
          event.duration_seconds || 0,
          event.cost_amount || 0,
          event.status || '-',
          event.event_timestamp,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telephony-events-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  const handleRefreshProvider = async (id: string) => {
    toast.loading('Synkar provider...');
    
    try {
      const response = await fetch(
        `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/trigger-manual-sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({ integration_id: id }),
        }
      );

      if (!response.ok) throw new Error('Synkning misslyckades');
      
      toast.dismiss();
      toast.success('Synkning startad');
      setTimeout(() => refetch(), 2000);
    } catch (error) {
      toast.dismiss();
      toast.error('Kunde inte synka provider');
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('Är du säker på att du vill ta bort denna provider?')) return;

    try {
      const { error } = await supabase.from('integrations').delete().eq('id', id);
      if (error) throw error;

      toast.success('Provider borttagen');
      refetch();
    } catch (error) {
      toast.error('Kunde inte ta bort provider');
    }
  };

  // Calculate metrics for display
  const inProgressCalls = filteredEvents.filter(e => {
    const normalized = e.normalized as any;
    return !normalized?.endedAt && !normalized?.endedReason;
  }).length;
  
  const completedCalls = filteredEvents.filter(e => {
    const normalized = e.normalized as any;
    return normalized?.endedAt || normalized?.endedReason;
  }).length;
  
  const avgCallDuration = metrics.totalCalls > 0 
    ? Math.floor(metrics.totalDuration / metrics.totalCalls) 
    : 0;

  return (
    <div className="min-h-screen">
      {/* Hero Section - COMPACT & MODERN */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* STORA snowflakes - fler för djup */}
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
                Telefoni
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Alla dina samtal och meddelanden i realtid
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
                  {filteredEvents.length} av {metrics.events.length} events
                </Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => syncNumbers()} disabled={isSyncing} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Phone className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Synka nummer
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowProviderDialog(true)} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Settings className="h-4 w-4 mr-2" />
                  Providers
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <PremiumTelephonyStatCard title="Total Samtal" value={metrics.totalCalls} icon={Phone} color="text-blue-600" subtitle={`${completedCalls} avslutade`} />
              <PremiumTelephonyStatCard title="Pågående" value={inProgressCalls} icon={Loader2} color="text-green-600" subtitle="Aktiva samtal" animate={inProgressCalls > 0} />
              <PremiumTelephonyStatCard title="Total Tid" value={formatDuration(metrics.totalDuration)} icon={Clock} color="text-purple-600" subtitle={`⌀ ${formatDuration(avgCallDuration)} per samtal`} />
            </div>
            <div className="mt-6">
              <IntegrationQuickView 
                filterByType="telephony" 
                title="Telefoniintegrationer"
                highlightCategory="telephony"
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
                    onClick={() => setPreset(7)}
                  >
                    7 dagar
                  </Button>
                  <Button 
                    variant={dateRangeDays === 30 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreset(30)}
                  >
                    30 dagar
                  </Button>
                  <Button 
                    variant={dateRangeDays === 90 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreset(90)}
                  >
                    90 dagar
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TelephonyActivityChart 
                data={chartData.dailyActivity}
                providers={chartData.providers}
                isLoading={isLoading}
              />
              <SuccessRateChart 
                data={chartData.successRateData}
                isLoading={isLoading}
              />
              <ProviderPerformanceChart 
                data={chartData.providerPerformance}
                providers={chartData.providers}
                isLoading={isLoading}
              />
              <CallDirectionChart 
                data={chartData.directionAnalysis}
                isLoading={isLoading}
              />
              <AvgDurationTrendChart 
                data={chartData.avgDurationTrend}
                isLoading={isLoading}
              />
              <EventTypeDistributionChart 
                data={chartData.eventTypeDistribution}
                isLoading={isLoading}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Provider Overview - Compact */}
      {Object.keys(metrics.byProvider).length > 0 && (
        <section className="relative py-6 border-y border-border/50">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={400}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Providers</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => {
                    const integration = telephonyProviders.find(p => p.provider === provider);
                    return (
                      <Card key={provider} className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <img src={getProviderLogo(provider)} alt={getProviderDisplayName(provider)} className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm truncate">{getProviderDisplayName(provider)}</h4>
                              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", integration?.is_active ? "bg-green-500" : "bg-gray-400")} />
                            </div>
                            <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Samtal:</span>
                                <span className="font-medium text-foreground">{data.totalCalls}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Kostnad:</span>
                                <span className="font-medium text-foreground">{formatCostInSEK(data.totalCost)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="relative py-8 pb-16">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={500}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">Events</h3>
                  <p className="text-sm text-muted-foreground mt-1">Realtidsövervakning av alla händelser</p>
                </div>
                <div className="flex-shrink-0">
                  <EventFilters onFilterChange={setFilters} providers={telephonyProviders} />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <EventsTable events={filteredEvents} onViewDetails={setSelectedEvent} />
                </Card>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Provider Management Dialog */}
      <ProviderManagementDialog
        open={showProviderDialog}
        onClose={() => setShowProviderDialog(false)}
        providers={telephonyProviders}
        onAddProvider={() => {
          setShowProviderDialog(false);
          window.location.href = '/dashboard/settings?tab=integrationer&category=telephony';
        }}
        onRefreshProvider={handleRefreshProvider}
        onDeleteProvider={handleDeleteProvider}
      />

      {/* Event Detail Drawer */}
      <EventDetailDrawer
        event={selectedEvent}
        open={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
