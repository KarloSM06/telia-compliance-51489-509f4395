import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2 } from 'lucide-react';
import { useIntegrations } from '@/hooks/useIntegrations';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';
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
    toast.info('Test-funktion kommer snart');
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
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Integrationer</h1>
            <p className="text-muted-foreground mt-1">
              Hantera alla dina externa tjänster och API-anslutningar på ett ställe
            </p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Lägg till integration
          </Button>
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
          </Tabs>
        )}

        <AddIntegrationModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
        />
      </div>
    </DashboardLayout>
  );
}
