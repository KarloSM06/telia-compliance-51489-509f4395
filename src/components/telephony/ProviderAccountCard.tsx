import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Power, Trash2, RefreshCw } from 'lucide-react';
import { getProviderLogo, getProviderDisplayName, formatRelativeTime } from '@/lib/telephonyFormatters';
import { useTelephonyAccounts, TelephonyAccount } from '@/hooks/useTelephonyAccounts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const ProviderAccountCard = ({ account }: { account: TelephonyAccount }) => {
  const { toggleAccount, deleteAccount } = useTelephonyAccounts();

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <img 
            src={getProviderLogo(account.provider)} 
            alt={account.provider}
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
                onClick={() => toggleAccount({ 
                  accountId: account.id, 
                  isActive: !account.is_active 
                })}
              >
                <Power className="h-4 w-4 mr-2" />
                {account.is_active ? 'Inaktivera' : 'Aktivera'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => deleteAccount(account.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Ta bort
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-semibold text-lg mb-1">
          {getProviderDisplayName(account.provider)}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          {account.provider_display_name}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <Badge variant={account.is_active ? 'default' : 'secondary'}>
            {account.is_active ? 'Aktiv' : 'Inaktiv'}
          </Badge>
          {account.is_verified && (
            <Badge variant="outline">✓ Verifierad</Badge>
          )}
        </div>

        {account.last_synced_at && (
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <RefreshCw className="h-3 w-3 mr-1" />
            Synkad {formatRelativeTime(account.last_synced_at)}
          </div>
        )}

        {account.sync_status === 'error' && (
          <p className="text-xs text-destructive mt-2">
            Senaste synkningen misslyckades
          </p>
        )}
      </CardContent>
    </Card>
  );
};
