import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Download, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDollar, getDailyUsageColor } from "@/lib/format";

interface APIKey {
  hash: string;
  name?: string;
  label?: string;
  usage?: number;
  usage_daily?: number;
  usage_weekly?: number;
  usage_monthly?: number;
  disabled?: boolean;
}

interface APIKeyUsageBreakdownProps {
  keys?: { data?: APIKey[] };
  isLoading?: boolean;
}

type SortField = 'name' | 'usage' | 'usage_daily' | 'usage_weekly' | 'usage_monthly';
type SortDirection = 'asc' | 'desc';

export const APIKeyUsageBreakdown = ({ keys, isLoading }: APIKeyUsageBreakdownProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortField, setSortField] = useState<SortField>('usage_monthly');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dollar-användning per API-nyckel</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48" />
        </CardContent>
      </Card>
    );
  }

  const apiKeys = keys?.data || [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedKeys = [...apiKeys].sort((a, b) => {
    let aValue: number | string = 0;
    let bValue: number | string = 0;

    if (sortField === 'name') {
      aValue = a.label || a.name || '';
      bValue = b.label || b.name || '';
    } else {
      aValue = a[sortField] || 0;
      bValue = b[sortField] || 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const exportToCSV = () => {
    const headers = ['Namn', 'Hash', 'Total ($)', 'Idag ($)', 'Vecka ($)', 'Månad ($)', 'Status'];
    const rows = apiKeys.map(key => [
      key.label || key.name || 'Unnamed',
      key.hash,
      key.usage || 0,
      key.usage_daily || 0,
      key.usage_weekly || 0,
      key.usage_monthly || 0,
      key.disabled ? 'Inaktiv' : 'Aktiv'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openrouter-api-keys-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 hover:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Dollar-användning per API-nyckel
            <Badge variant="secondary">{apiKeys.length} nycklar</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              disabled={apiKeys.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportera CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Dölj detaljer
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Visa detaljer
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortButton field="name">Namn</SortButton>
                  </TableHead>
                  <TableHead>Hash</TableHead>
                  <TableHead className="text-right">
                    <SortButton field="usage">Total</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="usage_daily">Idag</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="usage_weekly">Vecka</SortButton>
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton field="usage_monthly">Månad</SortButton>
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKeys.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Inga API-nycklar hittades
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedKeys.map((key) => {
                    const displayName = key.label || key.name || 'Unnamed Key';
                    const dailyUsage = key.usage_daily || 0;
                    const dailyColorClass = getDailyUsageColor(dailyUsage);

                    return (
                      <TableRow key={key.hash}>
                        <TableCell className="font-medium">{displayName}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {key.hash.substring(0, 8)}...{key.hash.substring(key.hash.length - 4)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatDollar(key.usage)}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${dailyColorClass}`}>
                          {formatDollar(dailyUsage)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatDollar(key.usage_weekly)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatDollar(key.usage_monthly)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.disabled ? "secondary" : "default"}>
                            {key.disabled ? "Inaktiv" : "Aktiv"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
