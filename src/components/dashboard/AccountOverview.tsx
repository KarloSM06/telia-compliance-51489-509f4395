import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Key, CreditCard, Zap, AlertCircle, ExternalLink } from "lucide-react";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AccountOverview = () => {
  const { data: keysStatus } = useOpenRouterKeys();
  const { data: credits, isLoading: creditsLoading, refetch: refetchCredits } = useOpenRouterCredits();
  const { data: keyInfo, isLoading: keyInfoLoading, refetch: refetchKeyInfo } = useOpenRouterKeyInfo();
  const { data: keysList, isLoading: keysListLoading, refetch: refetchKeysList } = useOpenRouterKeysList();

  const hasApiKey = keysStatus?.api_key_exists;
  const hasProvisioningKey = keysStatus?.provisioning_key_exists;

  const handleRefresh = () => {
    if (hasApiKey) {
      refetchCredits();
      refetchKeyInfo();
    }
    if (hasProvisioningKey) {
      refetchKeysList();
    }
  };

  // Don't show if no keys are configured
  if (!hasApiKey && !hasProvisioningKey) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Konfigurera OpenRouter API-nycklar för att se account overview.{' '}
          <Link to="/dashboard/integrations" className="text-primary hover:underline inline-flex items-center gap-1">
            Gå till Integrationer <ExternalLink className="h-3 w-3" />
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  const totalCredits = credits?.data?.total_credits || 0;
  const totalUsage = credits?.data?.total_usage || 0;
  const remainingCredits = totalCredits - totalUsage;
  const percentageUsed = totalCredits > 0 ? (totalUsage / totalCredits) * 100 : 0;

  const getStatusColor = (percentage: number) => {
    if (percentage < 20) return "text-destructive";
    if (percentage < 50) return "text-warning";
    return "text-success";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">OpenRouter Account Overview</h2>
          <p className="text-muted-foreground">
            Översikt över ditt OpenRouter-konto och API-nycklar
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Uppdatera
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Credits Card */}
        {hasApiKey && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Konto-saldo
              </h3>
              {creditsLoading && <Skeleton className="h-4 w-20" />}
            </div>
            {creditsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-2 w-full mt-4" />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-3xl font-bold">${totalCredits.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">
                  Använt: ${totalUsage.toFixed(2)}
                </div>
                <div className="text-sm font-medium">
                  Kvar:{' '}
                  <span className={getStatusColor((remainingCredits / totalCredits) * 100)}>
                    ${remainingCredits.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Förbrukning</span>
                    <span>{percentageUsed.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        percentageUsed > 80 ? 'bg-destructive' : 
                        percentageUsed > 50 ? 'bg-warning' : 
                        'bg-success'
                      }`}
                      style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Rate Limits Card */}
        {hasApiKey && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Rate Limits
              </h3>
              {keyInfoLoading && <Skeleton className="h-4 w-20" />}
            </div>
            {keyInfoLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : keyInfo?.data ? (
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold">
                    {keyInfo.data.rate_limit?.requests || 'Unlimited'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    requests per {keyInfo.data.rate_limit?.interval || 'minute'}
                  </div>
                </div>
                {keyInfo.data.limit && (
                  <div className="pt-3 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Limit: </span>
                      <span className="font-medium">${keyInfo.data.limit}</span>
                    </div>
                    {keyInfo.data.limit_remaining !== undefined && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Remaining: </span>
                        <span className="font-medium">${keyInfo.data.limit_remaining}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Ingen data tillgänglig</div>
            )}
          </Card>
        )}

        {/* API Keys Summary Card */}
        {hasProvisioningKey && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Key className="h-5 w-5" />
                API-nycklar
              </h3>
              {keysListLoading && <Skeleton className="h-4 w-20" />}
            </div>
            {keysListLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : keysList && keysList.length > 0 ? (
              <div className="space-y-3">
                <div className="text-3xl font-bold">{keysList.length}</div>
                <div className="text-sm text-muted-foreground">Totalt antal nycklar</div>
                <div className="pt-3 border-t space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aktiva:</span>
                    <span className="font-medium">
                      {keysList.filter(k => !k.disabled).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Inaktiva:</span>
                    <span className="font-medium">
                      {keysList.filter(k => k.disabled).length}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Inga nycklar hittades</div>
            )}
          </Card>
        )}
      </div>

      {/* API Keys Table */}
      {hasProvisioningKey && keysList && keysList.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Key className="h-5 w-5" />
            API-nycklar Detaljer
          </h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead className="text-right">Usage</TableHead>
                  <TableHead className="text-right">Remaining</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keysList.map((key) => (
                  <TableRow key={key.hash}>
                    <TableCell className="font-medium">{key.name || 'Unnamed'}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {key.hash.substring(0, 16)}...
                    </TableCell>
                    <TableCell className="text-right">
                      {key.limit ? `$${key.limit}` : 'Unlimited'}
                    </TableCell>
                    <TableCell className="text-right">${key.usage.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {key.limit_remaining !== null ? `$${key.limit_remaining.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.disabled ? "destructive" : "default"}>
                        {key.disabled ? 'Inaktiv' : 'Aktiv'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};
