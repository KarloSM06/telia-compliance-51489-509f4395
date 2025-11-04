import { useState } from "react";
import { Plug, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntegrations, ProviderType } from "@/hooks/useIntegrations";
import { AddIntegrationModal } from "@/components/integrations/AddIntegrationModal";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationHealthDashboard } from "@/components/integrations/IntegrationHealthDashboard";
import { PremiumCard } from "@/components/ui/premium-card";
import { IntegrationTester } from "@/components/integrations/IntegrationTester";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SyncStatusDashboard } from "@/components/integrations/SyncStatusDashboard";

export const EnhancedIntegrationsSection = () => {
  const { integrations, isLoading, deleteIntegration, toggleActive } = useIntegrations();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [testerModalOpen, setTesterModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [syncDashboardOpen, setSyncDashboardOpen] = useState(false);

  const telephonyIntegrations = integrations.filter(
    (i) => i.provider_type === 'telephony' || i.provider_type === 'multi'
  );
  const messagingIntegrations = integrations.filter(
    (i) => i.provider_type === 'messaging' || i.provider_type === 'multi'
  );
  const calendarIntegrations = integrations.filter(
    (i) => i.provider_type === 'calendar'
  );

  const handleTest = (integration: any) => {
    setSelectedIntegration(integration);
    setTesterModalOpen(true);
  };

  const handleEdit = (integration: any) => {
    console.log("Edit integration:", integration);
  };

  const handleDelete = (integrationId: string) => {
    if (confirm("Är du säker på att du vill ta bort denna integration?")) {
      deleteIntegration(integrationId);
    }
  };

  const handleToggle = (integrationId: string, currentState: boolean) => {
    toggleActive({ integrationId, isActive: !currentState });
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Integrationer</h2>
          <p className="text-muted-foreground mt-1">
            Hantera alla dina tjänstintegrationer från ett centralt ställe
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSyncDashboardOpen(true)}>
            <Activity className="h-4 w-4 mr-2" />
            Sync-status
          </Button>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Lägg till Integration
          </Button>
        </div>
      </div>

      <IntegrationHealthDashboard />

      {integrations.length === 0 ? (
        <PremiumCard className="p-12">
          <div className="text-center space-y-4">
            <Plug className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-xl font-semibold">Inga integrationer ännu</h3>
              <p className="text-muted-foreground mt-2">
                Anslut dina tjänster för att komma igång med automatisering
              </p>
            </div>
            <Button onClick={() => setAddModalOpen(true)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Lägg till din första integration
            </Button>
          </div>
        </PremiumCard>
      ) : (
        <div className="space-y-8">
          {telephonyIntegrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📞 Telefoni & Röst
                <span className="text-sm text-muted-foreground font-normal">
                  ({telephonyIntegrations.length})
                </span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {telephonyIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {messagingIntegrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                💬 Meddelanden & SMS
                <span className="text-sm text-muted-foreground font-normal">
                  ({messagingIntegrations.length})
                </span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {messagingIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {calendarIntegrations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                📅 Kalender & Bokningar
                <span className="text-sm text-muted-foreground font-normal">
                  ({calendarIntegrations.length})
                </span>
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {calendarIntegrations.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <AddIntegrationModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      
      <IntegrationTester
        open={testerModalOpen}
        onOpenChange={setTesterModalOpen}
        integration={selectedIntegration}
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
};
