import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Zap, CreditCard } from "lucide-react";

interface AccountBalanceCardsProps {
  totalCredits?: number;
  totalUsage?: number;
  limitRemaining?: number;
  rateLimitRequests?: number;
  rateLimitInterval?: string;
  todaysCost?: number;
}

export const AccountBalanceCards = ({
  totalCredits = 0,
  totalUsage = 0,
  limitRemaining,
  rateLimitRequests,
  rateLimitInterval,
  todaysCost = 0,
}: AccountBalanceCardsProps) => {
  const remaining = limitRemaining ?? (totalCredits - totalUsage);
  const usagePercent = totalCredits > 0 ? (totalUsage / totalCredits) * 100 : 0;
  
  const getUsageColor = () => {
    if (usagePercent >= 80) return "text-red-500";
    if (usagePercent >= 50) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Kontosaldo
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${remaining.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            av ${totalCredits.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Månadens Användning
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getUsageColor()}`}>
            ${totalUsage.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {usagePercent.toFixed(1)}% använt
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rate Limit
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {rateLimitRequests && rateLimitInterval ? (
            <>
              <div className="text-2xl font-bold">
                {rateLimitRequests}
              </div>
              <p className="text-xs text-muted-foreground">
                req/{rateLimitInterval}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              -
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Dagens Kostnad
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${todaysCost.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            senaste dygnet
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
