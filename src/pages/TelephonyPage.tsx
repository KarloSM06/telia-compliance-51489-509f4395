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
      {/* Hero Section - Minimalist */}
      <section className="relative py-16 bg-gradient-to-b from-background to-background/95 overflow-hidden">
        {/* Single subtle snowflake */}
        <div className="absolute -top-10 -right-10 w-[300px] h-[300px] opacity-[0.015] pointer-events-none">
          <img 
            src={hiemsLogoSnowflake} 
            alt="" 
            className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Telefoni
              </h1>
              <p className="text-base text-muted-foreground">
                Realtidsövervakning av samtal och meddelanden
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview with Action Bar */}
      <section className="relative py-8">
        <div className="container mx-auto px-6 lg:px-8">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-xs font-medium text-green-600">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </div>
              <span className="text-sm text-muted-foreground">
                {filteredEvents.length} events
              </span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowProviderDialog(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Providers
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <AnimatedSection delay={100}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard
                title="Totalt Samtal"
                value={metrics.totalCalls}
                icon={Phone}
                subtitle="Alla samtal"
                color="text-blue-600"
              />
              <PremiumTelephonyStatCard
                title="Pågående"
                value={inProgressCalls}
                icon={Loader2}
                subtitle="Aktiva nu"
                color="text-green-600"
                animate={inProgressCalls > 0}
              />
              <PremiumTelephonyStatCard
                title="Total Tid"
                value={formatDuration(metrics.totalDuration)}
                icon={Clock}
                subtitle="Samtalsvolym"
                color="text-purple-600"
              />
              <PremiumTelephonyStatCard
                title="Total Kostnad"
                value={formatCostInSEK(metrics.totalCost)}
                icon={DollarSign}
                subtitle="Totala utgifter"
                color="text-orange-600"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Provider Summary - Compact */}
      {Object.keys(metrics.byProvider).length > 0 && (
        <section className="relative py-6 border-y border-border/50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Providers
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowProviderDialog(true)}
                className="text-xs"
              >
                Visa alla
              </Button>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => {
                const integration = telephonyProviders.find(p => p.provider === provider);
                
                return (
                  <div 
                    key={provider}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-border transition-colors"
                  >
                    <img 
                      src={getProviderLogo(provider)} 
                      alt={getProviderDisplayName(provider)}
                      className="h-8 w-8 object-contain"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {getProviderDisplayName(provider)}
                        </p>
                        {integration?.is_active && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.totalCalls} samtal • {formatCostInSEK(data.totalCost)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="relative py-6 pb-16">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="space-y-4">
            {/* Simple header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Events</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>Senaste först</span>
              </div>
            </div>
            
            {/* Filters inline */}
            <EventFilters onFilterChange={setFilters} providers={telephonyProviders} />
            
            {/* Events table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Card className="border border-border/50">
                <EventsTable 
                  events={filteredEvents}
                  onViewDetails={setSelectedEvent}
                />
              </Card>
            )}
          </div>
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
