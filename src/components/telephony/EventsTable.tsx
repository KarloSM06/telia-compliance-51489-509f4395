import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye, ArrowDown, ArrowUp, Loader2, CheckCircle2 } from 'lucide-react';
import { formatDuration, formatCost, formatRelativeTime, formatFullTimestamp, getProviderDisplayName, formatCostInSEK, getProviderLogo } from '@/lib/telephonyFormatters';

interface EventsTableProps {
  events: any[];
  onViewDetails: (event: any) => void;
}

type SortKey = 'event_timestamp' | 'duration_seconds' | 'cost_amount' | 'provider';
type SortDirection = 'asc' | 'desc';

export const EventsTable = ({ events, onViewDetails }: EventsTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'event_timestamp',
    direction: 'desc',
  });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  // Filter to only show parent events (agent layer)
  const parentEvents = events.filter(e => 
    !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
  );

  const sortedEvents = [...parentEvents].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aVal, bVal;

    switch (key) {
      case 'event_timestamp':
        aVal = new Date(a.event_timestamp).getTime();
        bVal = new Date(b.event_timestamp).getTime();
        break;
      case 'duration_seconds':
        aVal = a.duration_seconds || 0;
        bVal = b.duration_seconds || 0;
        break;
      case 'cost_amount':
        aVal = a.cost_amount || 0;
        bVal = b.cost_amount || 0;
        break;
      case 'provider':
        aVal = a.provider || '';
        bVal = b.provider || '';
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getEventTypeColor = (type: string) => {
    if (type.includes('call')) return 'default';
    if (type.includes('sms')) return 'secondary';
    if (type.includes('transcript')) return 'outline';
    return 'secondary';
  };

  const getStatusColor = (event: any) => {
    const status = event.status?.toLowerCase() || '';
    if (status.includes('complet') || status.includes('answer')) return 'default';
    if (status.includes('fail') || status.includes('error')) return 'destructive';
    return 'secondary';
  };

  const getProviderColor = (provider: string) => {
    const colors: Record<string, string> = {
      vapi: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      twilio: 'bg-red-500/10 text-red-700 dark:text-red-300',
      retell: 'bg-green-500/10 text-green-700 dark:text-green-300',
      telnyx: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
    };
    return colors[provider.toLowerCase()] || 'bg-gray-500/10 text-gray-700 dark:text-gray-300';
  };

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Inga samtal att visa</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Provider</TableHead>
            <TableHead className="w-[150px]">Event Type</TableHead>
            <TableHead className="w-[100px]">Riktning</TableHead>
            <TableHead className="w-[160px]">Från</TableHead>
            <TableHead className="w-[120px]">Samtalsstatus</TableHead>
            <TableHead 
              className="w-[100px] cursor-pointer"
              onClick={() => handleSort('duration_seconds')}
            >
              <div className="flex items-center gap-1">
                Längd
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead 
              className="w-[100px] cursor-pointer"
              onClick={() => handleSort('cost_amount')}
            >
              <div className="flex items-center gap-1">
                Kostnad
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead 
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort('event_timestamp')}
            >
              <div className="flex items-center gap-1">
                Tidstämpel
                <ArrowUpDown className="h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => {
            const isInProgress = !event.normalized?.endedAt && !event.normalized?.endedReason;
            
            return (
              <TableRow key={event.id} className="hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img 
                      src={getProviderLogo(event.provider)} 
                      alt={getProviderDisplayName(event.provider)}
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getEventTypeColor(event.event_type)}>
                    {event.event_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {event.direction === 'inbound' ? (
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <ArrowDown className="h-4 w-4" />
                      <span className="text-xs">In</span>
                    </div>
                  ) : event.direction === 'outbound' ? (
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <ArrowUp className="h-4 w-4" />
                      <span className="text-xs">Ut</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-mono truncate">
                    {event.from_number || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  {isInProgress ? (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Pågående
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Klar
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {isInProgress ? '-' : formatDuration(event.duration_seconds)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {isInProgress ? '-' : formatCostInSEK(event.aggregate_cost_amount || event.cost_amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(event)}>
                    {event.status || 'Okänd'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">{formatRelativeTime(event.event_timestamp)}</span>
                    <span className="text-muted-foreground" title={formatFullTimestamp(event.event_timestamp)}>
                      {new Date(event.event_timestamp).toLocaleTimeString('sv-SE')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(event)}
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
