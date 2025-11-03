import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface APIKey {
  hash: string;
  name: string;
  limit?: number;
  usage?: number;
  limit_remaining?: number;
  disabled?: boolean;
  created_at?: string;
}

interface APIKeysTableProps {
  keys?: { data?: APIKey[] };
  isLoading: boolean;
  hasProvisioningKey: boolean;
  onSetupClick: () => void;
  onViewDetails?: (keyHash: string) => void;
}

export const APIKeysTable = ({
  keys,
  isLoading,
  hasProvisioningKey,
  onSetupClick,
  onViewDetails,
}: APIKeysTableProps) => {
  if (!hasProvisioningKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Nycklar</CardTitle>
          <CardDescription>
            Hantera och övervaka dina OpenRouter API-nycklar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Lägg till en Provisioning Key för att se dina API-nycklar</span>
              <Button size="sm" onClick={onSetupClick}>
                Lägg till
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const apiKeys = keys?.data || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Nycklar</CardTitle>
            <CardDescription>
              {apiKeys.length} {apiKeys.length === 1 ? 'nyckel' : 'nycklar'} konfigurerade
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Laddar...</div>
        ) : apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Inga API-nycklar hittades
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Namn</TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead className="text-right">Använt</TableHead>
                  <TableHead className="text-right">Kvar</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Åtgärder</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => {
                  const limit = key.limit || 0;
                  const usage = key.usage || 0;
                  const remaining = key.limit_remaining ?? (limit - usage);
                  const usagePercent = limit > 0 ? (usage / limit) * 100 : 0;

                  return (
                    <TableRow key={key.hash}>
                      <TableCell className="font-medium">{key.name || 'Unnamed'}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {key.hash.substring(0, 8)}...{key.hash.substring(key.hash.length - 6)}
                      </TableCell>
                      <TableCell className="text-right">${limit.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${usage.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${remaining.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.disabled ? "destructive" : usagePercent > 80 ? "secondary" : "default"}>
                          {key.disabled ? 'Disabled' : usagePercent > 80 ? 'Low' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {onViewDetails && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewDetails(key.hash)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
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
