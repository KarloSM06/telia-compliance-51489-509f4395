import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Power, Trash2, RefreshCw } from 'lucide-react';
import { getProviderLogo, getProviderDisplayName, formatRelativeTime } from '@/lib/telephonyFormatters';
import { useIntegrations, Integration } from '@/hooks/useIntegrations';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const ProviderAccountCard = ({ integration }: { integration: Integration }) => {
  const { toggleActive, deleteIntegration } = useIntegrations();

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <img 
            src={getProviderLogo(integration.provider)} 
            alt={integration.provider}
            className="h-10 w-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23e5e7eb"/%3E%3C/svg%3E';
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => toggleActive({ 
                  integrationId: integration.id, 
                  isActive: !integration.is_active 
                })}
              >
                <Power className="h-4 w-4 mr-2" />
                {integration.is_active ? 'Inaktivera' : 'Aktivera'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteIntegration(integration.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Ta bort
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-lg mb-1">
          {getProviderDisplayName(integration.provider)}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {integration.provider_display_name}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant={integration.is_active ? 'default' : 'secondary'}>
            {integration.is_active ? 'Aktiv' : 'Inaktiv'}
          </Badge>
          {integration.is_verified && (
            <Badge variant="outline">✓ Verifierad</Badge>
          )}
        </div>

        {integration.last_synced_at && (
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Synkad {formatRelativeTime(integration.last_synced_at)}
          </div>
        )}

        {integration.sync_status === 'error' && (
          <p className="text-xs text-destructive mt-2">
            Senaste synkningen misslyckades
          </p>
        )}
      </CardContent>
    </Card>
  );
};
