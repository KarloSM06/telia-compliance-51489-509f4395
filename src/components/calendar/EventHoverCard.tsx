import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Clock, MapPin, User, Mail, Phone, Calendar, AlertTriangle } from 'lucide-react';
import { ReactNode } from 'react';

interface EventHoverCardProps {
  event: CalendarEvent;
  children: ReactNode;
}

export const EventHoverCard = ({ event, children }: EventHoverCardProps) => {
  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);
  const duration = differenceInMinutes(endTime, startTime);

  const getSourceBadge = (source?: string) => {
    if (!source || source === 'internal') return null;
    
    const sourceLabels: Record<string, string> = {
      simplybook: 'SimplyBook',
      google_calendar: 'Google Calendar',
      bookeo: 'Bookeo',
    };
    
    return (
      <Badge variant="outline" className="text-xs">
        {sourceLabels[source] || source}
      </Badge>
    );
  };

  const getSyncStateBadge = (syncState?: string) => {
    // Sync state kommer senare - ta bort tills vidare
    return null;
  };

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="right" align="start">
        <div className="space-y-3">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-base leading-tight">{event.title}</h4>
              <div className="flex gap-1 flex-shrink-0">
                {getSourceBadge(event.source)}
              </div>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            )}
          </div>

          {/* Time & Duration */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {format(startTime, 'HH:mm', { locale: sv })} - {format(endTime, 'HH:mm', { locale: sv })}
            </span>
            <span className="text-muted-foreground">
              ({duration} min)
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(startTime, 'EEEE, d MMMM yyyy', { locale: sv })}</span>
          </div>

          {/* Address */}
          {event.address && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{event.address}</span>
            </div>
          )}

          {/* Contact Information */}
          {(event.contact_person || event.contact_email || event.contact_phone) && (
            <div className="border-t pt-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">Kontaktinformation</p>
              {event.contact_person && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{event.contact_person}</span>
                </div>
              )}
              {event.contact_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{event.contact_email}</span>
                </div>
              )}
              {event.contact_phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{event.contact_phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Event Type */}
          <div className="border-t pt-2">
            <Badge variant="secondary" className="text-xs capitalize">
              {event.event_type}
            </Badge>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
