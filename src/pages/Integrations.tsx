import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Loader2, Activity } from 'lucide-react';
import { useIntegrations } from '@/hooks/useIntegrations';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';
import { IntegrationTester } from '@/components/integrations/IntegrationTester';
import { SyncStatusDashboard } from '@/components/integrations/SyncStatusDashboard';
import { AIIntegrationsTab } from '@/components/integrations/AIIntegrationsTab';
import { toast } from 'sonner';

export default function Integrations() {
  const {
    integrations,
    isLoading,
    getByType,
    deleteIntegration,
    toggleActive,
  } = useIntegrations();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [testerModalOpen, setTesterModalOpen] = useState(false);
  const [syncDashboardOpen, setSyncDashboardOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);

  const telephonyIntegrations = integrations.filter(i => 
    i.provider_type === 'telephony' || 
    i.provider_type === 'multi' ||
    i.capabilities.includes('voice')
  );
  const messagingIntegrations = integrations.filter(i => 
    i.capabilities.includes('sms') || i.provider_type === 'messaging'
  );
  const calendarIntegrations = getByType('calendar');

  const handleEdit = (integration: any) => {
    toast.info('Redigering kommer snart');
  };

  const handleTest = (integration: any) => {
    setSelectedIntegration(integration);
    setTesterModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Är du säker på att du vill ta bort denna integration?')) {
      deleteIntegration(id);
    }
  };

  const handleToggle = (id: string, isActive: boolean) => {
    toggleActive({ integrationId: id, isActive });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Integrationer</h1>
            <p className="text-muted-foreground mt-1">
              Hantera alla dina externa tjänster och API-anslutningar på ett ställe
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSyncDashboardOpen(true)}>
              <Activity className="h-4 w-4 mr-2" />
              Sync-status
            </Button>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till integration
            </Button>
          </div>
        </div>

        {integrations.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Inga integrationer än</CardTitle>
              <CardDescription>
                Kom igång genom att lägga till din första integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Lägg till integration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                Alla ({integrations.length})
              </TabsTrigger>
              <TabsTrigger value="telephony">
                Telefoni & Röst ({telephonyIntegrations.length})
              </TabsTrigger>
              <TabsTrigger value="messaging">
                Meddelanden ({messagingIntegrations.length})
              </TabsTrigger>
              <TabsTrigger value="calendar">
                Kalender ({calendarIntegrations.length})
              </TabsTrigger>
              <TabsTrigger value="ai">
                AI & Modeller
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {integrations.map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTest={handleTest}
                  onToggle={handleToggle}
                />
              ))}
            </TabsContent>

            <TabsContent value="telephony" className="space-y-4">
              {telephonyIntegrations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Inga telefoni-integrationer ännu
                  </CardContent>
                </Card>
              ) : (
                telephonyIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="messaging" className="space-y-4">
              {messagingIntegrations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Inga meddelande-integrationer ännu
                  </CardContent>
                </Card>
              ) : (
                messagingIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              {calendarIntegrations.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    Inga kalender-integrationer ännu
                  </CardContent>
                </Card>
              ) : (
                calendarIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="ai">
              <AIIntegrationsTab />
            </TabsContent>
          </Tabs>
        )}

        <AddIntegrationModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
        />

        <IntegrationTester
          integration={selectedIntegration}
          open={testerModalOpen}
          onOpenChange={setTesterModalOpen}
        />

        <Dialog open={syncDashboardOpen} onOpenChange={setSyncDashboardOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Sync-status Dashboard</DialogTitle>
            </DialogHeader>
            <SyncStatusDashboard />
          </DialogContent>
        </Dialog>
    </div>
  );
}
