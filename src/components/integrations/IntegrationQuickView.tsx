import { Link } from "react-router-dom";
import { Plug, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntegrations, ProviderType } from "@/hooks/useIntegrations";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import { PremiumCard } from "@/components/ui/premium-card";

interface IntegrationQuickViewProps {
  filterBy?: ProviderType;
  showCount?: boolean;
  compact?: boolean;
}

export const IntegrationQuickView = ({
  filterBy,
  showCount = true,
  compact = false
}: IntegrationQuickViewProps) => {
  const { integrations, isLoading } = useIntegrations();

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-muted rounded-lg" />;
  }

  const filteredIntegrations = filterBy
    ? integrations.filter(i => i.provider_type === filterBy && i.is_active)
    : integrations.filter(i => i.is_active);

  if (filteredIntegrations.length === 0) {
    return (
      <PremiumCard className="p-6">
        <div className="text-center space-y-4">
          <Plug className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">Inga aktiva integrationer</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Anslut dina tjänster för att komma igång
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/settings?tab=integrationer">
              <Plug className="h-4 w-4 mr-2" />
              Hantera Integrationer
            </Link>
          </Button>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">
            Aktiva Integrationer
            {showCount && ` (${filteredIntegrations.length})`}
          </h3>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/dashboard/settings?tab=integrationer">
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {filteredIntegrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
          >
            <IntegrationStatusBadge
              provider={integration.provider_display_name || integration.provider}
              healthStatus={integration.is_active && integration.is_verified ? 'healthy' : integration.is_active ? 'warning' : 'error'}
              showLabel={true}
            />
            {!compact && (
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/settings?tab=integrationer">
                  Inställningar
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <Button asChild variant="outline" className="w-full">
          <Link to="/dashboard/settings?tab=integrationer">
            <Plug className="h-4 w-4 mr-2" />
            Hantera alla integrationer
          </Link>
        </Button>
      </div>
    </PremiumCard>
  );
};
