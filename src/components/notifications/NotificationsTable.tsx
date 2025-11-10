import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Notification {
  id: string;
  created_at: string;
  notification_type: string;
  title?: string;
  message?: string;
  priority: string;
  status: string;
  channel: string[];
  sent_at?: string;
  read_at?: string;
}

interface NotificationsTableProps {
  notifications: Notification[];
  onViewDetails: (notification: Notification) => void;
}

type SortConfig = {
  key: keyof Notification | null;
  direction: 'asc' | 'desc';
};

export function NotificationsTable({ notifications, onViewDetails }: NotificationsTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: keyof Notification) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedNotifications = useMemo(() => {
    if (!sortConfig.key) return notifications;

    return [...notifications].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [notifications, sortConfig]);

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      booking: { label: 'Bokning', className: 'bg-blue-500/20 text-blue-700 border-blue-500/30' },
      review: { label: 'Recension', className: 'bg-purple-500/20 text-purple-700 border-purple-500/30' },
      message_failed: { label: 'Fel', className: 'bg-red-500/20 text-red-700 border-red-500/30' },
      system: { label: 'System', className: 'bg-green-500/20 text-green-700 border-green-500/30' },
      other: { label: 'Övrigt', className: 'bg-gray-500/20 text-gray-700 border-gray-500/30' },
    };
    const badge = badges[type] || badges.other;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      high: { label: 'Hög', className: 'bg-red-500/20 text-red-700 border-red-500/30' },
      medium: { label: 'Medel', className: 'bg-orange-500/20 text-orange-700 border-orange-500/30' },
      low: { label: 'Låg', className: 'bg-green-500/20 text-green-700 border-green-500/30' },
    };
    const badge = badges[priority] || badges.medium;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      pending: { label: 'Väntande', className: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' },
      sent: { label: 'Skickad', className: 'bg-green-500/20 text-green-700 border-green-500/30' },
      failed: { label: 'Misslyckad', className: 'bg-red-500/20 text-red-700 border-red-500/30' },
    };
    const badge = badges[status] || badges.pending;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Bell className="h-12 w-12 mb-4 opacity-50" />
        <p>Inga notifikationer hittades</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-primary/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">Status</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => handleSort('created_at')} className="h-8 px-2">
                Tidpunkt <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Titel</TableHead>
            <TableHead>Prioritet</TableHead>
            <TableHead>Kanaler</TableHead>
            <TableHead>Skickad</TableHead>
            <TableHead>Läst</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNotifications.map((notification) => (
            <TableRow 
              key={notification.id} 
              className={`hover:bg-muted/30 transition-colors cursor-pointer ${!notification.read_at ? 'border-l-4 border-l-blue-500' : ''}`}
              onClick={() => onViewDetails(notification)}
            >
              <TableCell>
                {!notification.read_at && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {format(new Date(notification.created_at), 'PPp', { locale: sv })}
              </TableCell>
              <TableCell>{getTypeBadge(notification.notification_type)}</TableCell>
              <TableCell>
                <p className="text-sm font-medium line-clamp-1">
                  {notification.title || notification.message || '-'}
                </p>
              </TableCell>
              <TableCell>{getPriorityBadge(notification.priority)}</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {notification.channel && notification.channel.length > 0 ? (
                    notification.channel.map((ch, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs capitalize">
                        {ch}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {notification.sent_at ? (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(notification.sent_at), 'PPp', { locale: sv })}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                {notification.read_at ? (
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(notification.read_at), 'PPp', { locale: sv })}
                  </span>
                ) : (
                  <Badge variant="outline" className="text-xs">Oläst</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewDetails(notification); }}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Bell({ className }: { className: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
