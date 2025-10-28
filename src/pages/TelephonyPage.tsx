import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, BarChart3, List, Settings, Download, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProviderAccountCard } from '@/components/telephony/ProviderAccountCard';
import { TelephonyDashboard } from '@/components/telephony/TelephonyDashboard';
import { EventTimeline } from '@/components/telephony/EventTimeline';
import { DetailedMetricsTable } from '@/components/telephony/DetailedMetricsTable';
import { CostBreakdownChart } from '@/components/telephony/CostBreakdownChart';
import { WebhookSettings } from '@/components/telephony/WebhookSettings';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useTelephonyMetrics } from '@/hooks/useTelephonyMetrics';

const exportAllData = (events: any[]) => {
  const csv = [
    ['Provider', 'Typ', 'Direction', 'Från', 'Till', 'Längd (s)', 'Kostnad', 'Status', 'Datum'],
    ...events.map(e => [
      e.provider,
      e.event_type,
      e.direction,
      e.from_number,
      e.to_number,
      e.duration_seconds,
      e.cost_amount,
      e.status,
      e.event_timestamp
    ])
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `telephony-export-${new Date().toISOString()}.csv`;
  a.click();
};

export default function TelephonyPage() {
  const { integrations, isLoading: integrationsLoading, getByCapability } = useIntegrations();
  const telephonyIntegrations = getByCapability('voice').concat(getByCapability('sms'));
  const { metrics, isLoading: metricsLoading } = useTelephonyMetrics();

  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Phone className="h-8 w-8" />
            Telefoni Översikt
          </h1>
          <p className="text-muted-foreground mt-1">
            Centraliserad hantering av alla dina telefonileverantörer
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportAllData(metrics.events)}>
            <Download className="h-4 w-4 mr-2" />
            Exportera data
          </Button>
          <Button onClick={() => window.location.href = '/dashboard/integrations'}>
            Hantera Integrationer
          </Button>
        </div>
      </div>

      {/* Provider Accounts Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Anslutna leverantörer</CardTitle>
        </CardHeader>
        <CardContent>
          {integrationsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Laddar...</p>
            </div>
          ) : telephonyIntegrations.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg mb-4">Inga telefoni-leverantörer anslutna än</p>
              <p className="text-sm text-muted-foreground mb-4">
                Gå till Integrationer för att lägga till en telefoni-leverantör
              </p>
              <Button onClick={() => window.location.href = '/dashboard/integrations'}>
                Gå till Integrationer
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {telephonyIntegrations.map(integration => (
                <ProviderAccountCard key={integration.id} integration={integration} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      {telephonyIntegrations.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Översikt
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <List className="h-4 w-4 mr-2" />
              Händelselogg
            </TabsTrigger>
            <TabsTrigger value="details">
              <Settings className="h-4 w-4 mr-2" />
              Detaljerad vy
            </TabsTrigger>
            <TabsTrigger value="costs">
              💰 Kostnader
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Key className="h-4 w-4 mr-2" />
              Webhooks & API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <TelephonyDashboard metrics={metrics} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <EventTimeline events={metrics.events} />
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <DetailedMetricsTable events={metrics.events} />
          </TabsContent>

          <TabsContent value="costs" className="space-y-4">
            <CostBreakdownChart metrics={metrics} />
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <WebhookSettings />
          </TabsContent>
        </Tabs>
      )}

    </div>
  );
}
