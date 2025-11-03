import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDollarCompact, getDailyUsageColor } from "@/lib/format";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
        <CardTitle className="flex items-center gap-2 text-base">
          <Key className="h-4 w-4" />
          API-nycklar Översikt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mb-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Totalt Antal</p>
            <p className="text-lg font-bold">{apiKeys.length}</p>
            <p className="text-[10px] text-muted-foreground">
              {totals.active} aktiva
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Användning</p>
            <p className="text-lg font-bold">{formatDollarCompact(totals.usage)}</p>
            <p className="text-[10px] text-muted-foreground">all-time</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Idag</p>
            <p className="text-lg font-bold">{formatDollarCompact(totals.usageDaily)}</p>
            <p className="text-[10px] text-muted-foreground">daily spend</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Denna Månad</p>
            <p className="text-lg font-bold">{formatDollarCompact(totals.usageMonthly)}</p>
            <p className="text-[10px] text-muted-foreground">monthly spend</p>
          </div>
        </div>

        {apiKeys.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <AlertCircle className="h-4 w-4" />
            <span>Inga API-nycklar hittades</span>
          </div>
        ) : (
          <div className="mt-3 border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Namn</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Total</TableHead>
                  <TableHead className="text-xs text-right">Idag</TableHead>
                  <TableHead className="text-xs text-right">Vecka</TableHead>
                  <TableHead className="text-xs text-right">Månad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => {
                  const displayName = (key.name?.trim() || '') || 'Namnlös';
                  const dailyUsage = key.usage_daily || 0;
                  const dailyColorClass = getDailyUsageColor(dailyUsage);
                  
                  return (
                    <TableRow key={key.hash}>
                      <TableCell className="font-medium text-xs">{displayName}</TableCell>
                      <TableCell>
                        <Badge variant={key.disabled ? "secondary" : "default"} className="text-[10px] px-1.5 py-0">
                          {key.disabled ? "Inaktiv" : "Aktiv"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right">{formatDollarCompact(key.usage)}</TableCell>
                      <TableCell className={`text-xs text-right font-medium ${dailyColorClass}`}>
                        {formatDollarCompact(dailyUsage)}
                      </TableCell>
                      <TableCell className="text-xs text-right">{formatDollarCompact(key.usage_weekly)}</TableCell>
                      <TableCell className="text-xs text-right">{formatDollarCompact(key.usage_monthly)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
