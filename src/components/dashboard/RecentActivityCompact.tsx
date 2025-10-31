import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Phone, MessageSquare, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'booking' | 'telephony' | 'message' | 'review';
  title: string;
  description: string;
  timestamp: string;
  targetUrl: string;
  badge: { label: string; variant: 'default' | 'secondary' | 'outline' };
}

interface RecentActivityCompactProps {
  bookings: any[];
  messages: any[];
  telephony: any[];
  reviews: any[];
}

export const RecentActivityCompact = ({ bookings, messages, telephony, reviews }: RecentActivityCompactProps) => {
  const navigate = useNavigate();

  // Merge alla activities och sortera
  const activities: Activity[] = [
    ...(bookings || []).map(b => ({
      id: b.id,
      type: 'booking' as const,
      title: b.title || 'Ny bokning',
      description: `${b.contact_person || 'Kund'} - ${b.start_time ? format(new Date(b.start_time), 'HH:mm', { locale: sv }) : 'Ingen tid'}`,
      timestamp: b.created_at,
      targetUrl: '/dashboard/calendar',
      badge: { label: 'Bokning', variant: 'default' as const }
    })),
    ...(telephony || []).map(t => ({
      id: t.id,
      type: 'telephony' as const,
      title: `${t.direction === 'inbound' ? 'Inkommande' : 'Utgående'} ${t.event_type}`,
      description: `${t.from_number || 'Okänd'} → ${t.to_number || 'Okänd'}`,
      timestamp: t.event_timestamp,
      targetUrl: '/dashboard/telephony',
      badge: { label: 'Telefoni', variant: 'secondary' as const }
    })),
    ...(messages || []).map(m => ({
      id: m.id,
      type: 'message' as const,
      title: `${m.channel?.toUpperCase() || 'MEDDELANDE'} - ${m.status}`,
      description: m.message_body?.slice(0, 50) + '...' || 'Ingen text',
      timestamp: m.created_at,
      targetUrl: m.channel === 'sms' ? '/dashboard/sms' : '/dashboard/email',
      badge: { label: m.channel?.toUpperCase() || 'MSG', variant: 'outline' as const }
    })),
    ...(reviews || []).map(r => ({
      id: r.id,
      type: 'review' as const,
      title: `${r.rating}/5 - ${r.sentiment || 'Neutral'}`,
      description: r.comment?.slice(0, 50) + '...' || 'Ingen kommentar',
      timestamp: r.created_at,
      targetUrl: '/dashboard/reviews',
      badge: { label: 'Recension', variant: 'default' as const }
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
   .slice(0, 10);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4" />;
      case 'telephony': return <Phone className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      default: return null;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Senaste Händelser</h2>
        </div>
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">Inga händelser att visa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Senaste Händelser</h2>
        <p className="text-sm text-muted-foreground">
          Visar {activities.length} senaste
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Händelse</TableHead>
              <TableHead>Beskrivning</TableHead>
              <TableHead>Tidpunkt</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow 
                key={activity.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(activity.targetUrl)}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    {getIcon(activity.type)}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={activity.badge.variant}>
                    {activity.badge.label}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{activity.title}</TableCell>
                <TableCell className="text-muted-foreground max-w-xs truncate">
                  {activity.description}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(activity.timestamp), 'PPp', { locale: sv })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
