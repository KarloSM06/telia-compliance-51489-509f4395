import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { cn } from "@/lib/utils";
import { format, parseISO, differenceInDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Calendar, Phone, Video, Users } from "lucide-react";

interface TimelineEventBlockProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  columnStart: number;
  columnSpan: number;
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

const getEventColor = (eventType: string, source?: string) => {
  if (source === 'google_calendar') return 'bg-blue-500/90 border-blue-600 hover:bg-blue-500';
  if (source === 'bookeo') return 'bg-yellow-500/90 border-yellow-600 hover:bg-yellow-500';
  if (source === 'simplybook') return 'bg-green-500/90 border-green-600 hover:bg-green-500';
  
  switch (eventType) {
    case 'phone':
      return 'bg-blue-500/90 border-blue-600 hover:bg-blue-500';
    case 'video':
      return 'bg-purple-500/90 border-purple-600 hover:bg-purple-500';
    case 'meeting':
      return 'bg-green-500/90 border-green-600 hover:bg-green-500';
    default:
      return 'bg-gray-500/90 border-gray-600 hover:bg-gray-500';
  }
};

export const TimelineEventBlock = ({
  event,
  onClick,
  onDragStart,
  columnStart,
  columnSpan,
}: TimelineEventBlockProps) => {
  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);
  const colorClass = getEventColor(event.event_type, event.source);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(event)}
      onClick={() => onClick(event)}
      className={cn(
        "absolute h-full px-2 py-1 rounded-lg border-l-4 cursor-pointer",
        "transition-all duration-200 text-white text-xs",
        "overflow-hidden",
        colorClass
      )}
      style={{
        gridColumnStart: columnStart,
        gridColumnEnd: columnStart + columnSpan,
        minWidth: '60px',
      }}
    >
      <div className="flex items-center gap-1 mb-0.5">
        {getEventTypeIcon(event.event_type)}
        <span className="font-semibold truncate">{event.title}</span>
      </div>
      
      <div className="text-[10px] opacity-90">
        {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
      </div>
      
      {columnSpan > 1 && (
        <div className="text-[10px] opacity-90">
          {differenceInDays(endTime, startTime) + 1} dagar
        </div>
      )}
      
      {event.contact_person && columnSpan > 2 && (
        <div className="text-[10px] opacity-90 truncate mt-1">
          {event.contact_person}
        </div>
      )}
    </div>
  );
};
