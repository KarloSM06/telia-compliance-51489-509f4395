import { Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useIntegrations } from "@/hooks/useIntegrations";
import { PremiumCard } from "@/components/ui/premium-card";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export const IntegrationHealthDashboard = () => {
  const { integrations, isLoading } = useIntegrations();

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-muted rounded-lg" />;
  }

  // Since health_status might not exist yet, we'll use a placeholder approach
  const healthyCount = integrations.filter(i => i.is_active && i.is_verified).length;
  const warningCount = integrations.filter(i => i.is_active && !i.is_verified).length;
  const errorCount = integrations.filter(i => !i.is_active).length;
  const totalCount = integrations.length;

  const healthPercentage = totalCount > 0 ? Math.round((healthyCount / totalCount) * 100) : 0;

  return (
    <PremiumCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Integration Hälsa</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
          <div className="text-3xl font-bold text-primary">{totalCount}</div>
          <div className="text-sm text-muted-foreground mt-1">Totalt</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600">{healthyCount}</div>
          <div className="text-sm text-green-700 dark:text-green-400 mt-1">Hälsosamma</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
          <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
          <div className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">Varningar</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
          <div className="text-3xl font-bold text-red-600">{errorCount}</div>
          <div className="text-sm text-red-700 dark:text-red-400 mt-1">Fel</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Systemhälsa</span>
          <span className="font-semibold text-primary">{healthPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-primary transition-all duration-500"
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
      </div>

      {integrations.filter(i => !i.is_active || !i.is_verified).length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground">Kräver uppmärksamhet:</h4>
          {integrations
            .filter(i => !i.is_active || !i.is_verified)
            .map((integration) => (
              <div
                key={integration.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card/30"
              >
                {!integration.is_active ? (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{integration.provider_display_name || integration.provider}</div>
                  {integration.error_message && (
                    <div className="text-sm text-muted-foreground truncate">
                      {integration.error_message}
                    </div>
                  )}
                  {integration.last_synced_at && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Senast synkad: {format(new Date(integration.last_synced_at), 'PPp', { locale: sv })}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {integrations.filter(i => i.is_active && i.is_verified).length === integrations.length && totalCount > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Alla integrationer fungerar som de ska!
          </span>
        </div>
      )}
    </PremiumCard>
  );
};
