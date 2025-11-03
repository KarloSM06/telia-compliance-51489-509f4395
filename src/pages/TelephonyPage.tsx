import { Phone, MessageSquare, Clock, DollarSign, Users, Settings, RefreshCw, Download } from "lucide-react";
import { PremiumHero } from "@/components/communications/premium/PremiumHero";
import { PremiumStatCard } from "@/components/communications/premium/PremiumStatCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useTelephonyMetrics } from "@/hooks/useTelephonyMetrics";
import { formatDollar } from "@/lib/format";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { AdvancedFilters } from "@/components/communications/premium/AdvancedFilters";
import { ProviderManagementDialog } from '@/components/telephony/ProviderManagementDialog';
import { AddIntegrationModal } from '@/components/integrations/AddIntegrationModal';
import { useIntegrations } from '@/hooks/useIntegrations';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function TelephonyPage() {
  const [filters, setFilters] = useState<any>({});
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { metrics, isLoading, refetch } = useTelephonyMetrics(filters.dateRange);
  const { integrations, getByCapability } = useIntegrations();
  
  const telephonyProviders = getByCapability('voice').concat(getByCapability('sms'));

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const providers = Object.keys(metrics.byProvider);
  const totalProviderCost = Object.values(metrics.byProvider).reduce((sum: number, p: any) => sum + p.cost, 0);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await refetch();
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const events = metrics.events || [];
    const csvContent = [
      ['Provider', 'Event Type', 'Direction', 'From', 'To', 'Duration', 'Cost', 'Status', 'Timestamp'].join(','),
      ...events.map((event) =>
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

  return (
    <div className="min-h-screen bg-background">
      <PremiumHero
        title="Telefoni & AI-agenter"
        subtitle="Hantera och analysera all din telefonikommunikation på ett ställe"
        icon={<Phone className="h-8 w-8 text-primary" />}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-8">
        {/* Header Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowProviderDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Providers
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Grid */}
        <AnimatedSection delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <AnimatedSection delay={0}>
              <PremiumStatCard
                title="Totalt antal samtal"
                value={metrics.totalCalls}
                subtitle="Alla samtal"
                icon={Phone}
                color="primary"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <PremiumStatCard
                title="SMS via telefoni"
                value={metrics.totalSMS}
                subtitle="Telefonirelaterade SMS"
                icon={MessageSquare}
                color="violet"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <PremiumStatCard
                title="Total samtalstid"
                value={formatDuration(metrics.totalDuration)}
                subtitle={`Ø ${metrics.totalCalls > 0 ? formatDuration(Math.round(metrics.totalDuration / metrics.totalCalls)) : '0s'} per samtal`}
                icon={Clock}
                color="success"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <PremiumStatCard
                title="Aktiva agenter"
                value={metrics.agents.length}
                subtitle="AI-agenter"
                icon={Users}
                color="secondary"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <PremiumStatCard
                title="Total kostnad"
                value={formatDollar(metrics.totalCost)}
                subtitle="SEK (inkl. alla lager)"
                icon={DollarSign}
                color="warning"
                isLoading={isLoading}
              />
            </AnimatedSection>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={500}>
          <AdvancedFilters
            onFilterChange={setFilters}
            providers={providers}
            showProviderFilter={true}
            showStatusFilter={false}
            showDirectionFilter={false}
          />
        </AnimatedSection>

        {/* Provider Overview */}
        <AnimatedSection delay={600}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((providerName, index) => {
              const provider = metrics.byProvider[providerName];
              const costPercentage = totalProviderCost > 0 ? (provider.cost / totalProviderCost) * 100 : 0;
              
              return (
                <AnimatedSection key={providerName} delay={index * 100}>
                  <Card className="hover:shadow-elegant transition-all duration-300">
                    <CardHeader className="border-b bg-gradient-to-br from-card/80 to-card/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="capitalize">{providerName}</CardTitle>
                        <Badge variant="outline">{provider.agents.length} agenter</Badge>
                      </div>
                      <CardDescription>
                        {provider.calls} samtal • {provider.sms} SMS
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Samtalstid</span>
                          <span className="font-medium">{formatDuration(provider.duration)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Kostnad</span>
                          <span className="font-medium">{formatDollar(provider.cost)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Andel av total kostnad</span>
                          <span>{costPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={costPercentage} className="h-2" />
                      </div>

                      {provider.agents.length > 0 && (
                        <div className="pt-4 border-t space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Agenter</p>
                          <div className="flex flex-wrap gap-2">
                            {provider.agents.slice(0, 3).map((agent: any) => (
                              <Badge key={agent.id} variant="secondary" className="text-xs">
                                {agent.name}
                              </Badge>
                            ))}
                            {provider.agents.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{provider.agents.length - 3} till
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </AnimatedSection>

        {/* Agent Performance */}
        {Object.keys(metrics.byAgent).length > 0 && (
          <AnimatedSection delay={700}>
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Prestanda per AI-agent</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(metrics.byAgent).map(([agentId, data]: [string, any], index) => (
                    <AnimatedSection key={agentId} delay={index * 50}>
                      <div className="p-4 rounded-lg border bg-gradient-to-br from-card/80 to-card/50 hover:shadow-card transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{data.agent.name}</h4>
                          <Badge variant="outline">{data.agent.provider}</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Samtal</span>
                            <span className="font-medium">{data.calls}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Samtalstid</span>
                            <span className="font-medium">{formatDuration(data.duration)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kostnad</span>
                            <span className="font-medium">{formatDollar(data.cost)}</span>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}

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

        {/* Add Integration Modal */}
        <AddIntegrationModal open={showAddModal} onOpenChange={setShowAddModal} />
      </div>
    </div>
  );
}
