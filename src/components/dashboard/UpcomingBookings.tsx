import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { useState } from "react";
import { EventModal } from "@/components/calendar/EventModal";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const UpcomingBookings = () => {
  const { events, loading } = useCalendarEvents();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Filter upcoming events (status = scheduled, future dates)
  const upcomingEvents = events
    .filter((event) => {
      if (event.status !== 'scheduled') return false;
      const eventDate = parseISO(event.start_time);
      return eventDate > new Date();
    })
    .sort((a, b) => parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kommande bokningar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Kommande bokningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Inga kommande bokningar
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const startDate = parseISO(event.start_time);
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {format(startDate, 'MMM', { locale: sv }).toUpperCase()}
                        </span>
                        <span className="text-lg font-bold">
                          {format(startDate, 'd')}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{event.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(startDate, 'HH:mm')}
                        </div>
                        {event.contact_person && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {event.contact_person}
                          </div>
                        )}
                        {event.address && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                            <MapPin className="h-3 w-3" />
                            {event.address}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={async () => {}}
        />
      )}
    </>
  );
};
