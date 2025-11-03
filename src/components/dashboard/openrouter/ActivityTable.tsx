import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ActivityTableProps {
  activities: any[];
  onViewDetails: (activity: any) => void;
}

export const ActivityTable = ({ activities, onViewDetails }: ActivityTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'created_at',
    direction: 'desc',
  });

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal === undefined || bVal === undefined) return 0;
    
    if (sortConfig.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getKeyDisplayName = (activity: any) => {
    return activity.key_name || activity.key_label || activity.api_key?.slice(0, 8) || 'Unknown';
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
    return tokens.toString();
  };

  if (activities.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Ingen aktivitet att visa</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
              <div className="flex items-center gap-2">
                Timestamp
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort('model')}>
              <div className="flex items-center gap-2">
                Model
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>API Key</TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('total_tokens')}>
              <div className="flex items-center justify-end gap-2">
                Tokens
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort('total_cost')}>
              <div className="flex items-center justify-end gap-2">
                Cost
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActivities.map((activity) => (
            <TableRow key={activity.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {format(new Date(activity.created_at), 'PPP', { locale: sv })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), 'HH:mm:ss')}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono">{activity.model}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{getKeyDisplayName(activity)}</span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{formatTokens(activity.total_tokens || 0)}</span>
                  <span className="text-xs text-muted-foreground">
                    {activity.prompt_tokens || 0} / {activity.completion_tokens || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-sm font-medium">
                  ${(activity.total_cost || 0).toFixed(4)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
                  {activity.status || 'unknown'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(activity)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
