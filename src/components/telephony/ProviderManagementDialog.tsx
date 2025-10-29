import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, RefreshCw, Trash2, Plus } from 'lucide-react';
import { getProviderDisplayName } from '@/lib/telephonyFormatters';

interface ProviderManagementDialogProps {
  open: boolean;
  onClose: () => void;
  providers: any[];
  onAddProvider: () => void;
  onRefreshProvider: (id: string) => void;
  onDeleteProvider: (id: string) => void;
}

export const ProviderManagementDialog = ({
  open,
  onClose,
  providers,
  onAddProvider,
  onRefreshProvider,
  onDeleteProvider,
}: ProviderManagementDialogProps) => {
  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚙️ Hantera Providers
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={onAddProvider} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Lägg till provider
          </Button>

          {providers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Inga providers anslutna ännu</p>
            </div>
          ) : (
            <div className="space-y-3">
              {providers.map((provider) => {
                const syncHealth = provider.sync_health || 100;
                const isWebhook = provider.webhook_enabled;
                const isPolling = provider.polling_enabled;

                return (
                  <Card key={provider.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${provider.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <h3 className="font-semibold">
                              {getProviderDisplayName(provider.provider)}
                            </h3>
                          </div>

                          <div className="text-sm text-muted-foreground space-y-1">
                            {provider.provider_display_name && (
                              <p>Namn: {provider.provider_display_name}</p>
                            )}
                            {provider.config?.assistant_name && (
                              <p>Assistant: {provider.config.assistant_name}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Synk:</span>
                            <Progress value={syncHealth} className="h-2 flex-1 max-w-[120px]" />
                            <span className={`text-xs font-medium ${getHealthColor(syncHealth)}`}>
                              {syncHealth}%
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {isWebhook && (
                              <Badge variant="outline" className="text-xs">
                                Webhook aktiv
                              </Badge>
                            )}
                            {isPolling && (
                              <Badge variant="outline" className="text-xs">
                                Polling aktiv
                              </Badge>
                            )}
                          </div>

                          {provider.last_synced_at && (
                            <p className="text-xs text-muted-foreground">
                              Senast synkad: {new Date(provider.last_synced_at).toLocaleString('sv-SE')}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRefreshProvider(provider.id)}
                            title="Synka nu"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteProvider(provider.id)}
                            title="Ta bort"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
