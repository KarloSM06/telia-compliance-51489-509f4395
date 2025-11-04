import { useState } from 'react';
import { PremiumCard, PremiumCardContent, PremiumCardDescription, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Phone, MessageSquare, Calendar, Brain, Activity, Loader2 } from 'lucide-react';
import { useIntegrations } from '@/hooks/useIntegrations';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';
import { IntegrationTester } from '@/components/integrations/IntegrationTester';
import { SyncStatusDashboard } from '@/components/integrations/SyncStatusDashboard';
import { toast } from 'sonner';

export function IntegrationsSection() {
  const {
    integrations,
    isLoading,
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
  const calendarIntegrations = integrations.filter(i => i.provider_type === 'calendar');
  const activeIntegrations = integrations.filter(i => i.is_active);

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Integration Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <PremiumTelephonyStatCard
          title="Telefoni"
          value={telephonyIntegrations.length}
          icon={Phone}
          color="text-blue-600"
          subtitle="Röstintegrationer"
        />
        <PremiumTelephonyStatCard
          title="Meddelanden"
          value={messagingIntegrations.length}
          icon={MessageSquare}
          color="text-green-600"
          subtitle="SMS & Chat"
        />
        <PremiumTelephonyStatCard
          title="Kalender"
          value={calendarIntegrations.length}
          icon={Calendar}
          color="text-purple-600"
          subtitle="Bokningssystem"
        />
        <PremiumTelephonyStatCard
          title="Aktiva"
          value={activeIntegrations.length}
          icon={Activity}
          color="text-orange-600"
          subtitle="Av {integrations.length} totalt"
        />
      </div>

      {/* Action Buttons */}
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

      {integrations.length === 0 ? (
        <PremiumCard>
          <PremiumCardHeader>
            <PremiumCardTitle>Inga integrationer än</PremiumCardTitle>
            <PremiumCardDescription>
              Kom igång genom att lägga till din första integration
            </PremiumCardDescription>
          </PremiumCardHeader>
          <PremiumCardContent>
            <Button onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till integration
            </Button>
          </PremiumCardContent>
        </PremiumCard>
      ) : (
        <div className="space-y-6">
          {/* Telephony Integrations */}
          {telephonyIntegrations.length > 0 && (
            <PremiumCard className="hover-scale transition-all">
              <PremiumCardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <PremiumCardTitle>Telefoni & Röst</PremiumCardTitle>
                    <PremiumCardDescription>
                      {telephonyIntegrations.length} {telephonyIntegrations.length === 1 ? "integration" : "integrationer"}
                    </PremiumCardDescription>
                  </div>
                </div>
              </PremiumCardHeader>
              <PremiumCardContent className="space-y-4">
                {telephonyIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))}
              </PremiumCardContent>
            </PremiumCard>
          )}

          {/* Messaging Integrations */}
          {messagingIntegrations.length > 0 && (
            <PremiumCard className="hover-scale transition-all">
              <PremiumCardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <PremiumCardTitle>Meddelanden</PremiumCardTitle>
                    <PremiumCardDescription>
                      {messagingIntegrations.length} {messagingIntegrations.length === 1 ? "integration" : "integrationer"}
                    </PremiumCardDescription>
                  </div>
                </div>
              </PremiumCardHeader>
              <PremiumCardContent className="space-y-4">
                {messagingIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))}
              </PremiumCardContent>
            </PremiumCard>
          )}

          {/* Calendar Integrations */}
          {calendarIntegrations.length > 0 && (
            <PremiumCard className="hover-scale transition-all">
              <PremiumCardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <PremiumCardTitle>Kalender & Bokningar</PremiumCardTitle>
                    <PremiumCardDescription>
                      {calendarIntegrations.length} {calendarIntegrations.length === 1 ? "integration" : "integrationer"}
                    </PremiumCardDescription>
                  </div>
                </div>
              </PremiumCardHeader>
              <PremiumCardContent className="space-y-4">
                {calendarIntegrations.map(integration => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onTest={handleTest}
                    onToggle={handleToggle}
                  />
                ))}
              </PremiumCardContent>
            </PremiumCard>
          )}
        </div>
      )}

      {/* Modals */}
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
