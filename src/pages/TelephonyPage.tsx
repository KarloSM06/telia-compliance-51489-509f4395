import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, BarChart3, List, DollarSign, Download, RefreshCw, Bot, Activity, Webhook, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProviderAccountCard } from '@/components/telephony/ProviderAccountCard';
import { TelephonyDashboard } from '@/components/telephony/TelephonyDashboard';
import { EventTimeline } from '@/components/telephony/EventTimeline';
import { DetailedMetricsTable } from '@/components/telephony/DetailedMetricsTable';
import { CostBreakdownChart } from '@/components/telephony/CostBreakdownChart';
import { WebhookSettings } from '@/components/telephony/WebhookSettings';
import { SyncStatusDashboard } from '@/components/integrations/SyncStatusDashboard';
import { AgentManager } from '@/components/telephony/AgentManager';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useTelephonyMetrics } from '@/hooks/useTelephonyMetrics';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';

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
  const telephonyIntegrations = getByCapability('voice').concat(getByCapability('sms'));
  const { metrics, isLoading: metricsLoading, refetch } = useTelephonyMetrics();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Phone className="h-8 w-8" />
            Telefoni Översikt
          </h1>
          <p className="text-muted-foreground mt-1">
            Hantera samtal, meddelanden och AI-agents från alla dina providers
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={metricsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${metricsLoading ? 'animate-spin' : ''}`} />
            Uppdatera
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportAllData(metrics.events)}
            disabled={metrics.events.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportera CSV
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            Lägg till Integration
          </Button>
        </div>
      </div>

      {/* Connected Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Anslutna Providers
          </CardTitle>
          <CardDescription>
            {telephonyIntegrations.length} aktiva telefoni-integrationer
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
              {telephonyIntegrations.map((integration) => (
                <ProviderAccountCard
                  key={integration.id}
                  integration={integration}
                />
              ))}
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
