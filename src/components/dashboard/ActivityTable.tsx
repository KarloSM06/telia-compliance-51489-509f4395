import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';
import type { Activity } from '@/hooks/useAllActivities';

interface ActivityTableProps {
  activities: Activity[];
  onViewDetails: (activity: Activity) => void;
}

type SortKey = 'timestamp' | 'type' | 'status';
type SortDirection = 'asc' | 'desc';

export const ActivityTable = ({ activities, onViewDetails }: ActivityTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'timestamp',
    direction: 'desc',
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const sortedActivities = [...activities].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aVal, bVal;

    switch (key) {
      case 'timestamp':
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
        break;
      case 'type':
        aVal = a.typeLabel;
        bVal = b.typeLabel;
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  if (sortedActivities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border bg-card">
        <p className="text-muted-foreground">Inga händelser att visa</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead 
              className="w-[120px] cursor-pointer"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center gap-1">
                Typ
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[250px]">Titel</TableHead>
            <TableHead className="min-w-[200px]">Beskrivning</TableHead>
            <TableHead 
              className="w-[140px] cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('timestamp')}
            >
              <div className="flex items-center gap-1">
                Tidpunkt
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <TableRow 
                key={activity.id} 
                className="hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onViewDetails(activity)}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {activity.typeLabel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{activity.title}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground truncate block max-w-[300px]">
                    {activity.description}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={activity.badge.variant}>
                    {activity.badge.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true,
                        locale: sv 
                      })}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString('sv-SE', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(activity);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
