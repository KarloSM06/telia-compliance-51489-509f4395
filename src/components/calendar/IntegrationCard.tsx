import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, RefreshCw, Pause, Play, ExternalLink } from 'lucide-react';
import { SyncHealthIndicator } from './SyncHealthIndicator';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Integration {
  id: string;
  provider: string;
  is_active: boolean;
  last_sync?: string;
  sync_stats?: {
    success: number;
    failed: number;
    total: number;
  };
}

interface IntegrationCardProps {
  integration: Integration;
  onSync: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onSettings: (id: string) => void;
  onViewLogs: (id: string) => void;
}

export const IntegrationCard = ({
  integration,
  onSync,
  onToggleActive,
  onSettings,
  onViewLogs,
}: IntegrationCardProps) => {
  const providerLabels: Record<string, string> = {
    simplybook: 'SimplyBook.me',
    google_calendar: 'Google Calendar',
    bookeo: 'Bookeo',
    microsoft_outlook: 'Microsoft Outlook',
  };

  const providerName = providerLabels[integration.provider] || integration.provider;

  const successRate = integration.sync_stats
    ? Math.round((integration.sync_stats.success / integration.sync_stats.total) * 100) || 0
    : 100;

  const pendingCount = 0; // Would come from props in real implementation
  const failedCount = integration.sync_stats?.failed || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base">{providerName}</CardTitle>
              {integration.is_active ? (
                <Badge variant="default" className="h-5 text-xs bg-success">Aktiv</Badge>
              ) : (
                <Badge variant="secondary" className="h-5 text-xs">Pausad</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              {integration.last_sync
                ? `Senast synkad: ${format(new Date(integration.last_sync), 'PPp', { locale: sv })}`
                : 'Inte synkad ännu'}
            </CardDescription>
          </div>
          <SyncHealthIndicator
            successRate={successRate}
            pendingCount={pendingCount}
            failedCount={failedCount}
            className="ml-2"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Stats */}
        {integration.sync_stats && integration.sync_stats.total > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div className="p-2 bg-muted rounded">
              <div className="text-lg font-semibold">{integration.sync_stats.total}</div>
              <div className="text-xs text-muted-foreground">Totalt</div>
            </div>
            <div className="p-2 bg-success/10 rounded">
              <div className="text-lg font-semibold text-success">{integration.sync_stats.success}</div>
              <div className="text-xs text-muted-foreground">Lyckade</div>
            </div>
            <div className="p-2 bg-destructive/10 rounded">
              <div className="text-lg font-semibold text-destructive">{integration.sync_stats.failed}</div>
              <div className="text-xs text-muted-foreground">Misslyckade</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onSync(integration.id)}
            disabled={!integration.is_active}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Synka
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleActive(integration.id, !integration.is_active)}
          >
            {integration.is_active ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSettings(integration.id)}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewLogs(integration.id)}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
