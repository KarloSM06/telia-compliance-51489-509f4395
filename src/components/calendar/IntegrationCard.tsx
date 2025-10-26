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
      <CardHeader className="pb-2 pt-3 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CardTitle className="text-sm truncate">{providerName}</CardTitle>
              {integration.is_active ? (
                <Badge variant="default" className="h-4 text-[9px] px-1.5 bg-success">Aktiv</Badge>
              ) : (
                <Badge variant="secondary" className="h-4 text-[9px] px-1.5">Pausad</Badge>
              )}
            </div>
            <CardDescription className="text-[10px] truncate">
              {integration.last_sync
                ? `Senast: ${format(new Date(integration.last_sync), 'PPp', { locale: sv })}`
                : 'Inte synkad ännu'}
            </CardDescription>
          </div>
          <SyncHealthIndicator
            successRate={successRate}
            pendingCount={pendingCount}
            failedCount={failedCount}
            className="flex-shrink-0"
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-3 pb-3">
        {/* Kompakt Inline Stats */}
        {integration.sync_stats && integration.sync_stats.total > 0 && (
          <div className="flex items-center justify-between text-[10px] mb-2 px-1">
            <div className="text-center">
              <div className="font-semibold">{integration.sync_stats.total}</div>
              <div className="text-muted-foreground">Tot</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-success">{integration.sync_stats.success}</div>
              <div className="text-muted-foreground">OK</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-destructive">{integration.sync_stats.failed}</div>
              <div className="text-muted-foreground">Fel</div>
            </div>
          </div>
        )}

        {/* Kompakta Actions */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px] px-2"
            onClick={() => onSync(integration.id)}
            disabled={!integration.is_active}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Synka
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => onToggleActive(integration.id, !integration.is_active)}
          >
            {integration.is_active ? (
              <Pause className="h-3 w-3" />
            ) : (
              <Play className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2"
            onClick={() => onSettings(integration.id)}
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => onViewLogs(integration.id)}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
