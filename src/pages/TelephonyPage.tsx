import { useState } from 'react';
import { Phone, RefreshCw, Plus, Download, AlertTriangle, BarChart3, List, DollarSign, Bot, Activity, Webhook, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useTelephonyMetrics } from '@/hooks/useTelephonyMetrics';
import { useSyncStatus } from '@/hooks/useSyncStatus';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { TelephonyDashboard } from '@/components/telephony/TelephonyDashboard';
import { AgentManager } from '@/components/telephony/AgentManager';
import { EventTimeline } from '@/components/telephony/EventTimeline';
import { DetailedMetricsTable } from '@/components/telephony/DetailedMetricsTable';
import { CostBreakdownChart } from '@/components/telephony/CostBreakdownChart';
import { WebhookSettings } from '@/components/telephony/WebhookSettings';
import { SyncStatusDashboard } from '@/components/integrations/SyncStatusDashboard';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';
import { SyncConfidenceIndicator } from '@/components/telephony/SyncConfidenceIndicator';
import { toast } from 'sonner';

const exportAllData = (events: any[]) => {
  const csv = [
    ['Provider', 'Agent', 'Typ', 'Riktning', 'Från', 'Till', 'Längd (s)', 'Kostnad', 'Status', 'Datum'],
    ...events.map(e => [
      e.provider,
      e.agent_id || 'N/A',
      e.event_type,
      e.direction,
      e.from_number,
      e.to_number,
      e.duration_seconds || 0,
      e.cost_amount || 0,
      e.status,
      e.event_timestamp
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `telephony-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function TelephonyPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { integrations, isLoading: integrationsLoading, getByCapability } = useIntegrations();
  const { metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useTelephonyMetrics();
  const { data: syncStatuses } = useSyncStatus();
  const queryClient = useQueryClient();

  const telephonyIntegrations = getByCapability('voice').concat(getByCapability('sms'));

  // Beräkna overall sync confidence
  const overallConfidence = syncStatuses?.length 
    ? Math.round(syncStatuses.reduce((sum, s) => sum + s.sync_confidence_percentage, 0) / syncStatuses.length)
    : 0;

  const overallHealth = 
    overallConfidence >= 90 ? 'healthy' :
    overallConfidence >= 60 ? 'warning' : 'error';

  const handleRefresh = () => {
    refetchMetrics();
    queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    toast.success('📊 Uppdaterade telefoni-data');
  };

  const manualSync = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    toast.loading(`🔄 Startar synkronisering för ${integration?.provider}...`, { id: 'sync' });
    
    try {
      const { error } = await supabase.functions.invoke('telephony-account-sync', {
        body: { integration_id: integrationId }
      });
      
      if (error) throw error;
      
      toast.success('✅ Synkronisering klar!', { id: 'sync' });
      queryClient.invalidateQueries({ queryKey: ['telephony-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('❌ Synkronisering misslyckades', { id: 'sync' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header med Overall Sync Status */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Phone className="h-8 w-8" />
            Telefoni Översikt
          </h1>
          <p className="text-muted-foreground mt-1">
            Realtidsövervakning av alla dina telefoni-providers med 100% synk-säkerhet
          </p>
        </div>
        
        {/* Overall Sync Confidence Card */}
        {syncStatuses && syncStatuses.length > 0 && (
          <Card className="w-96 border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Total Synk-Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SyncConfidenceIndicator 
                confidence={overallConfidence}
                overallHealth={overallHealth}
                webhookHealth={syncStatuses[0]?.webhook_health_status || 'unknown'}
                pollingHealth={syncStatuses[0]?.polling_health_status || 'unknown'}
                lastWebhookReceived={syncStatuses[0]?.last_webhook_received_at}
                lastPollAt={syncStatuses[0]?.last_poll_at}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleRefresh} variant="outline" disabled={metricsLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
          Uppdatera
        </Button>
        <Button onClick={() => exportAllData(metrics.events)} variant="outline" disabled={metrics.events.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportera
        </Button>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Lägg till provider
        </Button>
      </div>

      {/* Provider Cards med individuell Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Anslutna Providers
          </CardTitle>
          <CardDescription>
            {telephonyIntegrations.length} aktiva telefoni-integrationer med realtids synk-övervakning
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integrationsLoading ? (
            <div className="text-center py-4 text-muted-foreground">Laddar...</div>
          ) : telephonyIntegrations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Inga telefoni-integrationer anslutna</p>
              <Button onClick={() => setShowAddModal(true)}>
                Lägg till din första provider
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {telephonyIntegrations.map((integration) => {
                const syncStatus = syncStatuses?.find(s => s.integration_id === integration.id);
                
                return (
                  <Card key={integration.id} className="relative border-2 hover:border-primary/50 transition-colors">
                    {syncStatus && (
                      <div className="absolute top-4 right-4">
                        <Badge variant={
                          syncStatus.overall_health === 'healthy' ? 'default' :
                          syncStatus.overall_health === 'warning' ? 'outline' : 'destructive'
                        }>
                          {syncStatus.sync_confidence_percentage}%
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {integration.provider_display_name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {integration.provider}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {syncStatus ? (
                        <SyncConfidenceIndicator 
                          confidence={syncStatus.sync_confidence_percentage}
                          overallHealth={syncStatus.overall_health}
                          webhookHealth={syncStatus.webhook_health_status}
                          pollingHealth={syncStatus.polling_health_status}
                          lastWebhookReceived={syncStatus.last_webhook_received_at}
                          lastPollAt={syncStatus.last_poll_at}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Ingen synk-status tillgänglig än
                        </div>
                      )}
                      
                      {/* Manual Sync Button */}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => manualSync(integration.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Synka Nu
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Översikt
          </TabsTrigger>
          <TabsTrigger value="agents">
            <Bot className="h-4 w-4 mr-2" />
            Agents
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Activity className="h-4 w-4 mr-2" />
            Tidslinje
          </TabsTrigger>
          <TabsTrigger value="details">
            <List className="h-4 w-4 mr-2" />
            Detaljer
          </TabsTrigger>
          <TabsTrigger value="costs">
            <DollarSign className="h-4 w-4 mr-2" />
            Kostnader
          </TabsTrigger>
          <TabsTrigger value="sync">
            <RefreshCw className="h-4 w-4 mr-2" />
            Synk
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <TelephonyDashboard metrics={metrics} />
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <AgentManager />
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Händelsetidslinje
              </CardTitle>
              <CardDescription>
                Kronologisk vy av alla telefoni-händelser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventTimeline events={metrics.events} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Detaljerad Rapport
              </CardTitle>
              <CardDescription>
                Fullständig tabell över alla händelser med filtreringsmöjligheter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DetailedMetricsTable events={metrics.events} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Kostnadsanalys
              </CardTitle>
              <CardDescription>
                Uppdelning av kostnader per provider och händelsetyp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CostBreakdownChart metrics={metrics} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Status Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Synkroniseringsstatus
              </CardTitle>
              <CardDescription>
                Övervakning av datasynkronisering från alla providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SyncStatusDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook-inställningar
              </CardTitle>
              <CardDescription>
                Konfigurera webhooks för realtidsuppdateringar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebhookSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Integration Modal */}
      <AddIntegrationModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
