import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { AlertTriangle, Calendar, Clock, MapPin, User, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConflictResolverProps {
  open: boolean;
  onClose: () => void;
  event: CalendarEvent;
  conflictingEvents: CalendarEvent[];
  onResolve: (keepEventId: string, discardEventIds: string[]) => Promise<void>;
}

export const ConflictResolver = ({
  open,
  onClose,
  event,
  conflictingEvents,
  onResolve,
}: ConflictResolverProps) => {
  const handleKeepEvent = async (keepId: string) => {
    const discardIds = [event.id, ...conflictingEvents.map(e => e.id)].filter(id => id !== keepId);
    await onResolve(keepId, discardIds);
    onClose();
  };

  const EventCard = ({ evt, isMain = false }: { evt: CalendarEvent; isMain?: boolean }) => {
    const startTime = parseISO(evt.start_time);
    const endTime = parseISO(evt.end_time);

    return (
      <Card className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-base">{evt.title}</h4>
            {evt.description && (
              <p className="text-sm text-muted-foreground mt-1">{evt.description}</p>
            )}
          </div>
          {isMain && (
            <Badge variant="secondary" className="ml-2">Ny händelse</Badge>
          )}
          {evt.source && evt.source !== 'internal' && (
            <Badge variant="outline" className="ml-2 capitalize">{evt.source}</Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(startTime, 'EEEE, d MMMM yyyy', { locale: sv })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(startTime, 'HH:mm', { locale: sv })} - {format(endTime, 'HH:mm', { locale: sv })}
            </span>
          </div>

          {evt.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{evt.address}</span>
            </div>
          )}

          {evt.contact_person && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{evt.contact_person}</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t">
          <Button
            onClick={() => handleKeepEvent(evt.id)}
            variant="default"
            className="w-full"
          >
            Behåll denna händelse
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Konflikt upptäckt
          </DialogTitle>
          <DialogDescription>
            Den här händelsen överlappar med {conflictingEvents.length} {conflictingEvents.length === 1 ? 'annan händelse' : 'andra händelser'}. 
            Välj vilken händelse du vill behålla. De andra kommer att tas bort.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Main event */}
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Ny händelse (orsakar konflikt)
              </h3>
              <EventCard evt={event} isMain />
            </div>

            {/* Arrow indicator */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-px w-full bg-border" />
                <ArrowRight className="h-4 w-4 flex-shrink-0" />
                <div className="h-px w-full bg-border" />
              </div>
            </div>

            {/* Conflicting events */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Befintliga händelser ({conflictingEvents.length})
              </h3>
              <div className="space-y-3">
                {conflictingEvents.map((conflictEvent) => (
                  <EventCard key={conflictEvent.id} evt={conflictEvent} />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
