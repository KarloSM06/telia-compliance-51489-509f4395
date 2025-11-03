import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RefreshCw, Settings, Download, Phone, Clock, DollarSign, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useTelephonyMetrics } from '@/hooks/useTelephonyMetrics';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { EventsTable } from '@/components/telephony/EventsTable';
import { EventFilters, EventFilterValues } from '@/components/telephony/EventFilters';
import { ProviderManagementDialog } from '@/components/telephony/ProviderManagementDialog';
import { EventDetailDrawer } from '@/components/telephony/EventDetailDrawer';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { supabase } from '@/integrations/supabase/client';
import { formatDuration, formatCostInSEK, getProviderDisplayName, getProviderLogo, formatRelativeTime } from '@/lib/telephonyFormatters';
import { cn } from '@/lib/utils';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

export default function TelephonyPage() {
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [filters, setFilters] = useState<EventFilterValues>({
    search: '',
    provider: 'all',
    eventType: 'all',
    direction: 'all',
    status: 'all',
    callStatus: 'all',
  });

  const { integrations, getByCapability } = useIntegrations();
  const { metrics, isLoading, refetch } = useTelephonyMetrics();
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
      {/* Hero Section - FULL PREMIUM UPGRADE */}
      <section className="relative py-32 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* 3 STORA snowflakes */}
        <div className="absolute -top-32 -right-32 w-[800px] h-[800px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* UPPERCASE label med accent line */}
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Telefoni
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Alla dina samtal och meddelanden i realtid
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions - Egen section */}
      <section className="relative py-8 border-y border-primary/10">
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard title="Total Samtal" value={metrics.totalCalls} icon={Phone} color="text-blue-600" subtitle={`${completedCalls} avslutade`} />
              <PremiumTelephonyStatCard title="Pågående" value={inProgressCalls} icon={Loader2} color="text-green-600" subtitle="Aktiva samtal" animate={inProgressCalls > 0} />
              <PremiumTelephonyStatCard title="Total Tid" value={formatDuration(metrics.totalDuration)} icon={Clock} color="text-purple-600" subtitle={`⌀ ${formatDuration(avgCallDuration)} per samtal`} />
              <PremiumTelephonyStatCard title="Total Kostnad" value={formatCostInSEK(metrics.totalCost)} icon={DollarSign} color="text-orange-600" subtitle={`≈ $${metrics.totalCost.toFixed(4)} USD`} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Provider Overview - ExpertiseCard Style */}
      {Object.keys(metrics.byProvider).length > 0 && (
        <section className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--primary)/0.12),transparent_50%)]" />
          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <AnimatedSection delay={300}>
              <div className="text-center mb-16">
                <div className="inline-block">
                  <span className="text-sm font-semibold tracking-wider text-primary uppercase">Dina Providers</span>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mt-4">
                  Provider Översikt
                </h2>
                <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                  Detaljerad status och statistik för varje integrerad telefoni-provider
                </p>
              </div>
            </AnimatedSection>
            <div className="space-y-12">
              {Object.entries(metrics.byProvider).map(([provider, data]: [string, any], index) => {
                const integration = telephonyProviders.find(p => p.provider === provider);
                const isLeft = index % 2 === 0;
                return (
                  <AnimatedSection key={provider} delay={400 + index * 100}>
                    <Card className="group h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
                      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} h-full`}>
                        <div className="relative md:w-[40%] aspect-square md:aspect-auto overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent z-10" />
                          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-12">
                            <img src={getProviderLogo(provider)} alt={getProviderDisplayName(provider)} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110 filter drop-shadow-2xl" />
                          </div>
                          <div className="absolute top-4 right-4 z-20">
                            <div className={cn("px-4 py-2 rounded-full backdrop-blur-md border-2 font-semibold text-sm uppercase tracking-wide shadow-lg", integration?.is_active ? "bg-green-500/20 border-green-500 text-green-600" : "bg-gray-500/20 border-gray-400 text-gray-600")}>
                              {integration?.is_active ? "Aktiv" : "Inaktiv"}
                            </div>
                          </div>
                        </div>
                        <div className="md:w-[60%] flex flex-col bg-gradient-to-br from-card/5 to-transparent">
                          <CardHeader className="pb-4">
                            <CardTitle className="text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                              {getProviderDisplayName(provider)}
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                              Synkad: {integration?.last_synced_at ? formatRelativeTime(integration.last_synced_at) : "Aldrig"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1 space-y-6">
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">Statistik & Prestanda</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 group/item">
                                  <Phone className="flex-shrink-0 h-5 w-5 text-blue-600 group-hover/item:scale-110 transition-transform" />
                                  <div><p className="font-semibold text-sm">Samtal</p><p className="text-2xl font-bold">{data.totalCalls}</p></div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 group/item">
                                  <MessageSquare className="flex-shrink-0 h-5 w-5 text-green-600 group-hover/item:scale-110 transition-transform" />
                                  <div><p className="font-semibold text-sm">SMS</p><p className="text-2xl font-bold">{data.totalSMS}</p></div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 group/item">
                                  <Clock className="flex-shrink-0 h-5 w-5 text-purple-600 group-hover/item:scale-110 transition-transform" />
                                  <div><p className="font-semibold text-sm">Total Tid</p><p className="text-xl font-bold">{formatDuration(data.totalDuration)}</p></div>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 group/item">
                                  <DollarSign className="flex-shrink-0 h-5 w-5 text-orange-600 group-hover/item:scale-110 transition-transform" />
                                  <div><p className="font-semibold text-sm">Kostnad</p><p className="text-xl font-bold">{formatCostInSEK(data.totalCost)}</p></div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t border-primary/10">
                              <Button variant="outline" size="sm" onClick={() => handleRefreshProvider(integration?.id)} className="hover:bg-primary/5 transition-all duration-300">
                                <RefreshCw className="h-4 w-4 mr-2" />Synka
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setShowProviderDialog(true)} className="hover:bg-primary/5 transition-all duration-300">
                                <Settings className="h-4 w-4 mr-2" />Inställningar
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={600}>
            <EventFilters onFilterChange={setFilters} providers={telephonyProviders} />
          </AnimatedSection>
        </div>
      </section>

      {/* Events Table */}
      <section className="relative py-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={700}>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-block mb-2">
                    <span className="text-sm font-semibold tracking-wider text-primary uppercase">Event Historik</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Alla Events
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Senaste först</span>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md overflow-hidden">
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
          setShowAddModal(true);
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

      {/* Add Integration Modal */}
      <AddIntegrationModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
