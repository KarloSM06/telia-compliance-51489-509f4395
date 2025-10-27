import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Calendar, Phone, Video, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getCurrentTimeInZone } from "@/lib/timezoneUtils";

interface UpcomingEventsListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  maxEvents?: number;
  timezone?: string;
}

const getEventTypeIcon = (eventType: string) => {
  switch (eventType) {
    case 'phone':
      return <Phone className="h-3 w-3" />;
    case 'video':
      return <Video className="h-3 w-3" />;
    case 'meeting':
      return <Users className="h-3 w-3" />;
    default:
      return <Calendar className="h-3 w-3" />;
  }
};

const getEventTypeColor = (eventType: string, source?: string) => {
  if (source === 'google_calendar') return 'bg-blue-500';
  if (source === 'bookeo') return 'bg-yellow-500';
  if (source === 'simplybook') return 'bg-green-500';
  
  switch (eventType) {
    case 'phone':
      return 'bg-blue-500';
    case 'video':
      return 'bg-purple-500';
    case 'meeting':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export const UpcomingEventsList = ({ 
  events, 
  onEventClick, 
  maxEvents = 5,
  timezone = 'Europe/Stockholm'
}: UpcomingEventsListProps) => {
  const now = getCurrentTimeInZone(timezone);
  const upcomingEvents = events
    .filter(event => parseISO(event.start_time) > now)
    .sort((a, b) => parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime())
    .slice(0, maxEvents);

  if (upcomingEvents.length === 0) {
    return (
      <div className="text-xs text-muted-foreground text-center py-4">
        Inga kommande events
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-2 pr-2">
        {upcomingEvents.map((event) => {
          const startTime = parseISO(event.start_time);
          const colorClass = getEventTypeColor(event.event_type, event.source);
          
          return (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className={cn(
                "flex items-start gap-2 p-2 rounded-lg cursor-pointer",
                "hover:bg-accent transition-colors duration-200"
              )}
            >
              <div className={cn("w-1 h-full rounded-full flex-shrink-0 mt-1", colorClass)} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                  {getEventTypeIcon(event.event_type)}
                  <span className="font-medium">
                    {format(startTime, 'MMM dd', { locale: sv })}
                  </span>
                  <span>•</span>
                  <span>{format(startTime, 'HH:mm')}</span>
                </div>
                
                <div className="text-sm font-medium truncate">
                  {event.title}
                </div>
                
                {event.contact_person && (
                  <div className="text-xs text-muted-foreground truncate">
                    {event.contact_person}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
