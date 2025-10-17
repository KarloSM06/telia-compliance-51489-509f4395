import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { getEventPosition, getEventTypeColor } from '@/lib/calendarUtils';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { memo } from 'react';
import { User, Mail, Phone } from 'lucide-react';

interface EventBlockProps {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  onResizeStart: (e: React.MouseEvent | React.TouchEvent, event: CalendarEvent, handle: 'top' | 'bottom') => void;
  isResizing?: boolean;
}

const EventBlockComponent = ({
  event,
  column,
  totalColumns,
  onEventClick,
  onDragStart,
  onResizeStart,
  isResizing = false,
}: EventBlockProps) => {
  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);
  
  const { top, height } = getEventPosition(startTime.toISOString(), endTime.toISOString());
  const colorClass = getEventTypeColor(event.event_type);

  const width = totalColumns > 1 ? `${100 / totalColumns}%` : '100%';
  const left = totalColumns > 1 ? `${(column * 100) / totalColumns}%` : '0%';

  const duration = differenceInMinutes(endTime, startTime);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('eventId', event.id);
    onDragStart(event);
  };

  const handleClick = () => {
    if (!isResizing) {
      onEventClick(event);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, handle: 'top' | 'bottom') => {
    e.stopPropagation();
    onResizeStart(e, event, handle);
  };

  const handleMouseDown = (e: React.MouseEvent, handle: 'top' | 'bottom') => {
    e.stopPropagation();
    onResizeStart(e, event, handle);
  };

  return (
    <div
      draggable={!isResizing}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`absolute rounded-lg border-l-4 p-2 shadow-sm cursor-pointer transition-all duration-200 group ${colorClass} ${
        isResizing ? 'ring-2 ring-primary scale-[1.02] shadow-lg' : 'hover:shadow-lg hover:scale-[1.01]'
      }`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`,
        width,
        left,
        zIndex: isResizing ? 30 : 10,
        transform: 'translate3d(0, 0, 0)',
        willChange: isResizing ? 'transform' : 'auto',
      }}
    >
      {/* Top resize handle - larger touch target */}
      <div
        className="absolute top-0 left-0 right-0 h-4 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-primary/20 rounded-t-lg transition-all flex items-center justify-center touch-manipulation"
        onMouseDown={(e) => handleMouseDown(e, 'top')}
        onTouchStart={(e) => handleTouchStart(e, 'top')}
        style={{ minHeight: '16px' }}
      >
        <div className="w-10 h-1 bg-foreground/50 rounded-full" />
      </div>

      {/* Event content */}
      <div className="mt-2 space-y-1 overflow-hidden">
        {/* Title - always visible */}
        <div className="text-sm font-semibold truncate leading-tight">
          {event.title}
        </div>
        
        {/* Time - visible for events > 30px */}
        {height > 30 && (
          <div className="text-xs text-muted-foreground font-medium">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </div>
        )}
        
        {/* Contact person - visible for events > 60px (1h) */}
        {event.contact_person && height > 60 && (
          <div className="flex items-center gap-1 text-xs truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{event.contact_person}</span>
          </div>
        )}
        
        {/* Contact details - visible for events > 90px (1.5h) */}
        {height > 90 && (
          <div className="space-y-0.5">
            {event.contact_email && (
              <div className="flex items-center gap-1 text-xs truncate opacity-80">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.contact_email}</span>
              </div>
            )}
            {event.contact_phone && (
              <div className="flex items-center gap-1 text-xs truncate opacity-80">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.contact_phone}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Description - visible for events > 120px (2h) */}
        {event.description && height > 120 && (
          <div className="text-xs opacity-70 line-clamp-2 pt-1 border-t border-current/10">
            {event.description}
          </div>
        )}
      </div>

      {/* Bottom resize handle - larger touch target */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-primary/20 rounded-b-lg transition-all flex items-center justify-center touch-manipulation"
        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        onTouchStart={(e) => handleTouchStart(e, 'bottom')}
        style={{ minHeight: '16px' }}
      >
        <div className="w-10 h-1 bg-foreground/50 rounded-full" />
      </div>
    </div>
  );
};

// Memoize component for better performance
export const EventBlock = memo(EventBlockComponent, (prevProps, nextProps) => {
  return (
    prevProps.event.id === nextProps.event.id &&
    prevProps.event.start_time === nextProps.event.start_time &&
    prevProps.event.end_time === nextProps.event.end_time &&
    prevProps.event.title === nextProps.event.title &&
    prevProps.column === nextProps.column &&
    prevProps.totalColumns === nextProps.totalColumns &&
    prevProps.isResizing === nextProps.isResizing
  );
});
