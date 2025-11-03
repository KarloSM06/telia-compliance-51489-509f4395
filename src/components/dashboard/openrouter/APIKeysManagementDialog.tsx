import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, DollarSign, TrendingUp, Calendar } from "lucide-react";

interface APIKeysManagementDialogProps {
  open: boolean;
  onClose: () => void;
  keys?: {
    data: Array<{
      hash: string;
      name?: string;
      label?: string;
      is_free_tier: boolean;
      usage: number;
      limit: number | null;
      usage_daily?: number;
      usage_weekly?: number;
      usage_monthly?: number;
      limit_remaining: number | null;
    }>;
  };
  isLoading?: boolean;
}

export const APIKeysManagementDialog = ({
  open,
  onClose,
  keys,
  isLoading,
}: APIKeysManagementDialogProps) => {
  const apiKeys = keys?.data || [];

  // Calculate totals
  const totalUsage = apiKeys.reduce((sum, key) => sum + (key.usage || 0), 0);
  const totalDaily = apiKeys.reduce((sum, key) => sum + (key.usage_daily || 0), 0);
  const totalMonthly = apiKeys.reduce((sum, key) => sum + (key.usage_monthly || 0), 0);

  const getKeyDisplayName = (key: any) => {
    return key.name || key.label || `Key ${key.hash.slice(0, 8)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys Management
          </DialogTitle>
          <DialogDescription>
            Översikt över alla dina OpenRouter API-nycklar och deras användning
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Användning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalUsage.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Idag
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalDaily.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Månad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalMonthly.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Keys Table */}
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : apiKeys.length === 0 ? (
            <Alert>
              <AlertDescription>
                Inga API-nycklar hittades. Konfigurera dina nycklar i inställningarna.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Idag</TableHead>
                    <TableHead className="text-right">Vecka</TableHead>
                    <TableHead className="text-right">Månad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.hash}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{getKeyDisplayName(key)}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {key.hash.slice(0, 12)}...
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.is_free_tier ? "secondary" : "default"}>
                          {key.is_free_tier ? "Free" : "Paid"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${(key.usage || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${(key.usage_daily || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${(key.usage_weekly || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${(key.usage_monthly || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
