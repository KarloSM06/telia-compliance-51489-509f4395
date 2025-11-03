import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Key, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDollarCompact, getDailyUsageColor } from "@/lib/format";
import { getKeyDisplayName, getKeyMaskedLabel } from "@/lib/openrouterKeys";

interface APIKey {
  hash: string;
  name?: string;
  label?: string;
  limit?: number;
  usage?: number;
  usage_daily?: number;
  usage_weekly?: number;
  usage_monthly?: number;
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
      usageDaily: acc.usageDaily + (key.usage_daily || 0),
      usageWeekly: acc.usageWeekly + (key.usage_weekly || 0),
      usageMonthly: acc.usageMonthly + (key.usage_monthly || 0),
      remaining: acc.remaining + (key.limit_remaining || 0),
      active: acc.active + (key.disabled ? 0 : 1),
    }),
    { limit: 0, usage: 0, usageDaily: 0, usageWeekly: 0, usageMonthly: 0, remaining: 0, active: 0 }
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
            <p className="text-sm text-muted-foreground">Total Användning</p>
            <p className="text-2xl font-bold">{formatDollarCompact(totals.usage)}</p>
            <p className="text-xs text-muted-foreground">all-time</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Idag</p>
            <p className="text-2xl font-bold">{formatDollarCompact(totals.usageDaily)}</p>
            <p className="text-xs text-muted-foreground">daily spend</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Denna Månad</p>
            <p className="text-2xl font-bold">{formatDollarCompact(totals.usageMonthly)}</p>
            <p className="text-xs text-muted-foreground">monthly spend</p>
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
            const displayName = (key.name?.trim() || '') || 'Namnlös';
            const dailyUsage = key.usage_daily || 0;
            const dailyColorClass = getDailyUsageColor(dailyUsage);
            
            return (
              <div
                key={key.hash}
                className="border rounded-lg p-3 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {displayName}
                    </p>
                  </div>
                  <Badge variant={key.disabled ? "secondary" : "default"} className="ml-2">
                    {key.disabled ? "Inaktiv" : "Aktiv"}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{formatDollarCompact(key.usage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Idag:</span>
                    <span className={`font-medium ${dailyColorClass}`}>
                      {formatDollarCompact(dailyUsage)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vecka:</span>
                    <span className="font-medium">{formatDollarCompact(key.usage_weekly)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Månad:</span>
                    <span className="font-medium">{formatDollarCompact(key.usage_monthly)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
