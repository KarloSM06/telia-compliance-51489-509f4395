import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Key, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface APIKey {
  hash: string;
  name?: string;
  limit?: number;
  usage?: number;
  limit_remaining?: number;
  disabled?: boolean;
}

interface APIKeysOverviewProps {
  keys?: { data?: APIKey[] };
  isLoading?: boolean;
}

export const APIKeysOverview = ({ keys, isLoading }: APIKeysOverviewProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API-nycklar Översikt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const apiKeys = keys?.data || [];
  
  const totals = apiKeys.reduce(
    (acc, key) => ({
      limit: acc.limit + (key.limit || 0),
      usage: acc.usage + (key.usage || 0),
      remaining: acc.remaining + (key.limit_remaining || 0),
      active: acc.active + (key.disabled ? 0 : 1),
    }),
    { limit: 0, usage: 0, remaining: 0, active: 0 }
  );

  const usagePercentage = totals.limit > 0 ? (totals.usage / totals.limit) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          API-nycklar Översikt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4 mb-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Totalt Antal</p>
            <p className="text-2xl font-bold">{apiKeys.length}</p>
            <p className="text-xs text-muted-foreground">
              {totals.active} aktiva
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Limit</p>
            <p className="text-2xl font-bold">${totals.limit.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Användning</p>
            <p className="text-2xl font-bold">${totals.usage.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {usagePercentage.toFixed(1)}% använt
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Återstående</p>
            <p className="text-2xl font-bold">${totals.remaining.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
        </div>

        {totals.limit > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Användning</span>
              <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        )}

        {apiKeys.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <AlertCircle className="h-4 w-4" />
            <span>Inga API-nycklar hittades</span>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {apiKeys.map((key) => {
            const keyUsagePercentage = key.limit && key.usage 
              ? (key.usage / key.limit) * 100 
              : 0;
            
            return (
              <div
                key={key.hash}
                className="border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {key.name || 'Unnamed Key'}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      {key.hash.substring(0, 8)}...{key.hash.substring(key.hash.length - 4)}
                    </p>
                  </div>
                  <Badge variant={key.disabled ? "secondary" : "default"} className="ml-2">
                    {key.disabled ? "Inaktiv" : "Aktiv"}
                  </Badge>
                </div>
                
                {key.limit && (
                  <>
                    <Progress value={keyUsagePercentage} className="h-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${(key.usage || 0).toFixed(2)} använt</span>
                      <span>${(key.limit_remaining || 0).toFixed(2)} kvar</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
