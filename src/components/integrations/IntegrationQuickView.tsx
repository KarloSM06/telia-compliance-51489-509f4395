import { Link } from "react-router-dom";
import { Plug, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUnifiedIntegrations, UnifiedIntegrationType } from "@/hooks/useUnifiedIntegrations";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";
import { PremiumCard } from "@/components/ui/premium-card";

interface IntegrationQuickViewProps {
  filterByType?: UnifiedIntegrationType | 'all';
  showCount?: boolean;
  compact?: boolean;
  title?: string;
  highlightCategory?: string;
}

export const IntegrationQuickView = ({
  filterByType = 'all',
  showCount = true,
  compact = false,
  title = "Aktiva Integrationer",
  highlightCategory,
}: IntegrationQuickViewProps) => {
  const { integrations, isLoading, activeIntegrations } = useUnifiedIntegrations();

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-muted rounded-lg" />;
  }

  // Filter integrations based on type
  const filteredIntegrations = filterByType === 'all'
    ? activeIntegrations
    : integrations.filter(i => i.type === filterByType && i.isActive);

  const settingsUrl = highlightCategory 
    ? `/dashboard/settings?tab=integrationer&category=${highlightCategory}`
    : '/dashboard/settings?tab=integrationer';

  if (filteredIntegrations.length === 0) {
    return (
      <PremiumCard className="p-6">
        <div className="text-center space-y-4">
          <Plug className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">
              {filterByType !== 'all' ? `Inga ${filterByType} integrationer` : 'Inga aktiva integrationer'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Anslut dina tjänster för att komma igång
            </p>
          </div>
          <Button asChild>
            <Link to={settingsUrl}>
              <Plug className="h-4 w-4 mr-2" />
              Lägg till integration
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
            {title}
            {showCount && ` (${filteredIntegrations.length})`}
          </h3>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to={settingsUrl}>
            <Settings className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {compact ? (
          <div className="flex flex-wrap gap-2">
            {filteredIntegrations.map((integration) => (
              <IntegrationStatusBadge
                key={integration.id}
                provider={integration.name}
                healthStatus={integration.healthStatus}
                isActive={integration.isActive}
              />
            ))}
          </div>
        ) : (
          filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-2">
                <IntegrationStatusBadge
                  provider={integration.name}
                  healthStatus={integration.healthStatus}
                  isActive={integration.isActive}
                  showLabel={true}
                />
                <Badge variant="outline" className="text-xs capitalize">
                  {integration.type}
                </Badge>
              </div>
              {integration.lastSync && (
                <span className="text-xs text-muted-foreground">
                  {new Date(integration.lastSync).toLocaleString('sv-SE', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <Button asChild variant="outline" className="w-full gap-2">
          <Link to={settingsUrl}>
            <ExternalLink className="h-4 w-4" />
            Hantera alla integrationer
          </Link>
        </Button>
      </div>
    </PremiumCard>
  );
};
