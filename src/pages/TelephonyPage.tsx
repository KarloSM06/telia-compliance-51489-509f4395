import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Settings, Download, Phone, Clock, DollarSign, Loader2 } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
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
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <section className="relative -mx-6 -mt-6 px-6 pt-8 pb-12 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradient backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Animated Snowflakes */}
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-5 pointer-events-none">
          <img 
            src={hiemsLogoSnowflake} 
            alt="" 
            className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
          />
        </div>
        <div className="absolute -top-10 -left-10 w-[300px] h-[300px] opacity-[0.03] pointer-events-none">
          <img 
            src={hiemsLogoSnowflake} 
            alt="" 
            className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]"
          />
        </div>
        
        <AnimatedSection>
          <div className="relative">
            {/* Accent line */}
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                Realtidsövervakning
              </span>
              <div className="w-24 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent rounded-full shadow-lg shadow-primary/50 mt-1" />
            </div>
            
            {/* Gradient Title */}
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Telefoni
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              Alla dina samtal och meddelanden i realtid
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Quick Actions Bar */}
      <AnimatedSection delay={100}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-600">Live</span>
            </div>
            
            {/* Events count */}
            <Badge variant="outline" className="text-sm">
              {filteredEvents.length} av {metrics.events.length} events
            </Badge>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => syncNumbers()}
              disabled={isSyncing}
              className="hover:bg-primary/5 transition-colors"
            >
              <Phone className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Synka nummer
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="hover:bg-primary/5 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Uppdatera
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="hover:bg-primary/5 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowProviderDialog(true)}
              className="hover:bg-primary/5 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Providers
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Premium Stats Cards */}
      <AnimatedSection delay={200}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PremiumTelephonyStatCard
            title="Total Samtal"
            value={metrics.totalCalls}
            icon={Phone}
            color="text-blue-600"
            subtitle={`${completedCalls} avslutade`}
          />
          <PremiumTelephonyStatCard
            title="Pågående"
            value={inProgressCalls}
            icon={Loader2}
            color="text-green-600"
            subtitle="Aktiva samtal"
            animate={inProgressCalls > 0}
          />
          <PremiumTelephonyStatCard
            title="Total Tid"
            value={formatDuration(metrics.totalDuration)}
            icon={Clock}
            color="text-purple-600"
            subtitle={`⌀ ${formatDuration(avgCallDuration)} per samtal`}
          />
          <PremiumTelephonyStatCard
            title="Total Kostnad"
            value={formatCostInSEK(metrics.totalCost)}
            icon={DollarSign}
            color="text-orange-600"
            subtitle={`≈ $${metrics.totalCost.toFixed(4)} USD`}
          />
        </div>
      </AnimatedSection>

      {/* Provider Overview */}
      {Object.keys(metrics.byProvider).length > 0 && (
        <AnimatedSection delay={300}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Provider Översikt</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowProviderDialog(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Hantera
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => {
                const integration = telephonyProviders.find(p => p.provider === provider);
                
                return (
                  <Card 
                    key={provider}
                    className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    {/* Status indicator */}
                    <div className="absolute top-3 right-3">
                      <div className={`w-2 h-2 rounded-full ${
                        integration?.is_active ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`} />
                    </div>
                    
                    <CardContent className="pt-6">
                      {/* Provider logo & name */}
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={getProviderLogo(provider)} 
                          alt={getProviderDisplayName(provider)}
                          className="h-8 w-auto"
                        />
                        <h3 className="font-semibold text-lg">
                          {getProviderDisplayName(provider)}
                        </h3>
                      </div>
                      
                      {/* Metrics grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Samtal</p>
                          <p className="text-xl font-bold">{data.totalCalls}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">SMS</p>
                          <p className="text-xl font-bold">{data.totalSMS}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Kostnad</p>
                          <p className="text-lg font-bold">{formatCostInSEK(data.totalCost)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Längd</p>
                          <p className="text-lg font-bold">{formatDuration(data.totalDuration)}</p>
                        </div>
                      </div>
                      
                      {/* Sync status */}
                      {integration?.last_synced_at && (
                        <div className="mt-3 pt-3 border-t border-primary/10">
                          <p className="text-xs text-muted-foreground">
                            Synkad: {formatRelativeTime(integration.last_synced_at)}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Filters */}
      <AnimatedSection delay={400}>
        <EventFilters onFilterChange={setFilters} providers={telephonyProviders} />
      </AnimatedSection>

      {/* Events Table */}
      <AnimatedSection delay={500}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Events Timeline</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Senaste först</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <EventsTable events={filteredEvents} onViewDetails={setSelectedEvent} />
          )}
        </div>
      </AnimatedSection>

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
