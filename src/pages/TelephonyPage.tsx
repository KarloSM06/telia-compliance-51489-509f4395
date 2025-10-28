import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, BarChart3, List, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProviderAccountCard } from '@/components/telephony/ProviderAccountCard';
import { AddProviderModal } from '@/components/telephony/AddProviderModal';
import { TelephonyDashboard } from '@/components/telephony/TelephonyDashboard';
import { EventTimeline } from '@/components/telephony/EventTimeline';
import { DetailedMetricsTable } from '@/components/telephony/DetailedMetricsTable';
import { CostBreakdownChart } from '@/components/telephony/CostBreakdownChart';
import { useTelephonyAccounts } from '@/hooks/useTelephonyAccounts';
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
  const { accounts, isLoading: accountsLoading } = useTelephonyAccounts();
  const { metrics, isLoading: metricsLoading } = useTelephonyMetrics();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
          <Button onClick={() => setIsAddModalOpen(true)}>
            Lägg till provider
          </Button>
        </div>
      </div>

      {/* Provider Accounts Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Anslutna leverantörer</CardTitle>
        </CardHeader>
        <CardContent>
          {accountsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Laddar...</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg mb-4">Inga leverantörer anslutna än</p>
              <Button onClick={() => setIsAddModalOpen(true)}>
                Lägg till din första leverantör
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {accounts.map(account => (
                <ProviderAccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      {accounts.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
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
        </Tabs>
      )}

      <AddProviderModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
