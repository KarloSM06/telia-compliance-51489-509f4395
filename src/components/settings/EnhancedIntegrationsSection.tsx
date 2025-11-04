import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Plug, Plus, Activity, Phone, Calendar as CalendarIcon, Brain, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useUnifiedIntegrations } from "@/hooks/useUnifiedIntegrations";
import { AddIntegrationModal } from "@/components/integrations/AddIntegrationModal";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { IntegrationHealthDashboard } from "@/components/integrations/IntegrationHealthDashboard";
import { PremiumCard } from "@/components/ui/premium-card";
import { IntegrationTester } from "@/components/integrations/IntegrationTester";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SyncStatusDashboard } from "@/components/integrations/SyncStatusDashboard";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";

export const EnhancedIntegrationsSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    integrations,
    isLoading,
    telephonyIntegrations,
    messagingIntegrations,
    calendarIntegrations,
    aiIntegrations,
    handleDelete,
    handleToggle,
  } = useUnifiedIntegrations();
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [aiSetupModalOpen, setAiSetupModalOpen] = useState(false);
  const [testerModalOpen, setTesterModalOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [syncDashboardOpen, setSyncDashboardOpen] = useState(false);

  // Get category from URL params
  const activeCategory = searchParams.get('category') || 'all';

  // Set active tab based on URL param
  useEffect(() => {
    if (activeCategory && ['telephony', 'calendar', 'ai', 'messaging'].includes(activeCategory)) {
      // URL will control the active tab
    }
  }, [activeCategory]);

  const handleTabChange = (value: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === 'all') {
        newParams.delete('category');
      } else {
        newParams.set('category', value);
      }
      return newParams;
    });
  };

  const handleTest = (integration: any) => {
    setSelectedIntegration(integration);
    setTesterModalOpen(true);
  };

  const handleEdit = (integration: any) => {
    console.log("Edit integration:", integration);
  };

  const handleDeleteClick = async (integration: any) => {
    if (confirm("Är du säker på att du vill ta bort denna integration?")) {
      await handleDelete(integration);
    }
  };

  const handleToggleClick = async (integration: any) => {
    await handleToggle(integration, !integration.isActive);
  };

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-muted rounded-lg" />;
  }

  const IntegrationSection = ({ integrations: items, emptyMessage }: { integrations: any[], emptyMessage: string }) => (
    items.length > 0 ? (
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={{
              ...integration.metadata,
              provider_display_name: integration.name,
              is_active: integration.isActive,
              is_verified: integration.isVerified,
              health_status: integration.healthStatus,
              last_synced_at: integration.lastSync,
              error_message: integration.errorMessage,
            }}
            onTest={() => handleTest(integration)}
            onEdit={() => handleEdit(integration)}
            onDelete={() => handleDeleteClick(integration)}
            onToggle={() => handleToggleClick(integration)}
          />
        ))}
      </div>
    ) : (
      <PremiumCard className="p-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">{emptyMessage}</p>
          <Button onClick={() => setAddModalOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Lägg till integration
          </Button>
        </div>
      </PremiumCard>
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Integrationer
          </h2>
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
        <Tabs value={activeCategory} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="gap-2">
              <Plug className="h-4 w-4" />
              Alla
              <Badge variant="secondary" className="ml-1">{integrations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="telephony" className="gap-2">
              <Phone className="h-4 w-4" />
              Telefoni
              <Badge variant="secondary" className="ml-1">{telephonyIntegrations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Kalender
              <Badge variant="secondary" className="ml-1">{calendarIntegrations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="messaging" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Meddelanden
              <Badge variant="secondary" className="ml-1">{messagingIntegrations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Brain className="h-4 w-4" />
              AI
              <Badge variant="secondary" className="ml-1">{aiIntegrations.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-6">
            {telephonyIntegrations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Telefoni
                </h3>
                <IntegrationSection 
                  integrations={telephonyIntegrations}
                  emptyMessage="Inga telefoniintegrationer"
                />
              </div>
            )}

            {calendarIntegrations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Kalender & Bokning
                </h3>
                <IntegrationSection 
                  integrations={calendarIntegrations}
                  emptyMessage="Inga kalenderintegrationer"
                />
              </div>
            )}

            {messagingIntegrations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Meddelanden
                </h3>
                <IntegrationSection 
                  integrations={messagingIntegrations}
                  emptyMessage="Inga meddelandeintegrationer"
                />
              </div>
            )}

            {aiIntegrations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-modeller
                </h3>
                <div className="grid gap-4">
                  {aiIntegrations.map((integration) => (
                    <PremiumCard key={integration.id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-full bg-primary/10">
                            <Brain className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {integration.isVerified 
                                ? 'API & Provisioning nycklar konfigurerade' 
                                : integration.isActive
                                  ? 'Endast API nyckel konfigurerad'
                                  : 'Inte konfigurerad'}
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => setAiSetupModalOpen(true)} variant="outline">
                          Konfigurera
                        </Button>
                      </div>
                    </PremiumCard>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="telephony" className="mt-6">
            <IntegrationSection 
              integrations={telephonyIntegrations}
              emptyMessage="Inga telefoniintegrationer. Lägg till Twilio, Telnyx, Vapi eller Retell för att komma igång."
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <IntegrationSection 
              integrations={calendarIntegrations}
              emptyMessage="Inga kalenderintegrationer. Lägg till SimplyBook, Google Calendar eller andra bokningssystem."
            />
          </TabsContent>

          <TabsContent value="messaging" className="mt-6">
            <IntegrationSection 
              integrations={messagingIntegrations}
              emptyMessage="Inga meddelandeintegrationer. Lägg till Twilio eller Telnyx för SMS/MMS."
            />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            {aiIntegrations.length > 0 ? (
              <div className="grid gap-4">
                {aiIntegrations.map((integration) => (
                  <PremiumCard key={integration.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Brain className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{integration.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {integration.isVerified 
                              ? 'API & Provisioning nycklar konfigurerade' 
                              : integration.isActive
                                ? 'Endast API nyckel konfigurerad'
                                : 'Inte konfigurerad'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {integration.capabilities?.map(cap => (
                              <Badge key={cap} variant="outline" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => setAiSetupModalOpen(true)} variant="outline">
                        Konfigurera
                      </Button>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            ) : (
              <PremiumCard className="p-8">
                <div className="text-center space-y-4">
                  <Brain className="h-16 w-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-xl font-semibold">Lägg till AI-integration</h3>
                    <p className="text-muted-foreground mt-2">
                      Konfigurera OpenRouter för att använda AI-modeller i ditt system
                    </p>
                  </div>
                  <Button onClick={() => setAiSetupModalOpen(true)} size="lg">
                    <Brain className="h-5 w-5 mr-2" />
                    Konfigurera OpenRouter
                  </Button>
                </div>
              </PremiumCard>
            )}
          </TabsContent>
        </Tabs>
      )}

      <AddIntegrationModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      
      <OpenRouterSetupModal open={aiSetupModalOpen} onOpenChange={setAiSetupModalOpen} />

      {selectedIntegration && (
        <IntegrationTester
          open={testerModalOpen}
          onOpenChange={setTesterModalOpen}
          integration={selectedIntegration.metadata || selectedIntegration}
        />
      )}

      <Dialog open={syncDashboardOpen} onOpenChange={setSyncDashboardOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sync Status Dashboard</DialogTitle>
          </DialogHeader>
          <SyncStatusDashboard />
        </DialogContent>
      </Dialog>
    </div>
  );
};
