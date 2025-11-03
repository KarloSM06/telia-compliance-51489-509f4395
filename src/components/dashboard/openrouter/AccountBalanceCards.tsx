import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AccountBalanceCardsProps {
  totalCredits?: number;
  totalUsage?: number;
  limitRemaining?: number;
  rateLimitRequests?: number;
  rateLimitInterval?: string;
}

export const AccountBalanceCards = ({
  totalCredits = 0,
  totalUsage = 0,
  limitRemaining,
  rateLimitRequests,
  rateLimitInterval,
}: AccountBalanceCardsProps) => {
  const remaining = limitRemaining ?? (totalCredits - totalUsage);
  const usagePercent = totalCredits > 0 ? (totalUsage / totalCredits) * 100 : 0;
  
  const getUsageColor = () => {
    if (usagePercent >= 80) return "text-red-500";
    if (usagePercent >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium">Kontosaldo</CardTitle>
          <DollarSign className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg font-bold">${remaining.toFixed(2)}</div>
          <p className="text-[10px] text-muted-foreground">
            av ${totalCredits.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium">Månadens Användning</CardTitle>
          <TrendingUp className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className={`text-lg font-bold ${getUsageColor()}`}>
            ${totalUsage.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {usagePercent.toFixed(1)}% använt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium">Rate Limit</CardTitle>
          <Zap className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg font-bold">
            {rateLimitRequests ?? "N/A"}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {rateLimitInterval ? `per ${rateLimitInterval}` : 'Ingen data'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-xs font-medium">Kvarvarande Limit</CardTitle>
          <DollarSign className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg font-bold">
            ${limitRemaining !== undefined ? limitRemaining.toFixed(2) : remaining.toFixed(2)}
          </div>
          <p className="text-[10px] text-muted-foreground">
            limit remaining
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
