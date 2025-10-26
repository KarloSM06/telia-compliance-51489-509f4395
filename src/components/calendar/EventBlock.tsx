import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { getEventPosition } from '@/lib/calendarUtils';
import { useUserTimezone } from '@/hooks/useUserTimezone';
import { memo } from 'react';
import { User, Mail, Phone, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface EventBlockProps {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  onEventClick: (event: CalendarEvent) => void;
  onDragStart: (event: CalendarEvent) => void;
  onResizeStart: (e: React.MouseEvent | React.TouchEvent, event: CalendarEvent, handle: 'top' | 'bottom') => void;
  isResizing?: boolean;
  viewStartHour?: number;
}

const EventBlockComponent = ({
  event,
  column,
  totalColumns,
  onEventClick,
  onDragStart,
  onResizeStart,
  isResizing = false,
  viewStartHour = 0,
}: EventBlockProps) => {
  const { timezone } = useUserTimezone();
  
  // Calculate position in calendar grid
  const { top, height } = getEventPosition(event.start_time, event.end_time, viewStartHour, timezone);
  
  // Extract time directly from ISO string to show EXACT stored time
  // "2025-10-26T06:00:00+01:00" -> display as "06:00"
  const startMatch = event.start_time.match(/T(\d{2}):(\d{2})/);
  const endMatch = event.end_time.match(/T(\d{2}):(\d{2})/);
  
  const startTime = startMatch ? `${startMatch[1]}:${startMatch[2]}` : format(new Date(event.start_time), 'HH:mm');
  const endTime = endMatch ? `${endMatch[1]}:${endMatch[2]}` : format(new Date(event.end_time), 'HH:mm');

  const width = totalColumns > 1 ? `${100 / totalColumns}%` : '100%';
  const left = totalColumns > 1 ? `${(column * 100) / totalColumns}%` : '0%';

  // Enhanced color schemes for different event types
  const getEventColors = (type: string) => {
    const colors = {
      meeting: 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100',
      call: 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-600 text-green-900 dark:text-green-100',
      demo: 'bg-purple-100 dark:bg-purple-900/30 border-purple-400 dark:border-purple-600 text-purple-900 dark:text-purple-100',
      follow_up: 'bg-orange-100 dark:bg-orange-900/30 border-orange-400 dark:border-orange-600 text-orange-900 dark:text-orange-100',
      work: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-400 dark:border-indigo-600 text-indigo-900 dark:text-indigo-100',
      personal: 'bg-pink-100 dark:bg-pink-900/30 border-pink-400 dark:border-pink-600 text-pink-900 dark:text-pink-100',
      leisure: 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-400 dark:border-cyan-600 text-cyan-900 dark:text-cyan-100',
      other: 'bg-gray-100 dark:bg-gray-800/50 border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const enhancedColorClass = getEventColors(event.event_type);

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
      className={`absolute rounded-lg border-l-4 p-2 shadow-sm cursor-pointer transition-all duration-200 group ${enhancedColorClass} ${
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
      <div className="mt-2 space-y-1.5 overflow-hidden">
        {/* Title and Time - always visible */}
        <div className="space-y-1">
          <div className="text-sm font-semibold truncate leading-tight">
            {event.title}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium opacity-90">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>{startTime} - {endTime}</span>
          </div>
        </div>
        
        {/* Additional details for larger events */}
        {height > 60 && (
          <div className="space-y-1 pt-1 border-t border-current/10">
            {/* Address */}
            {event.address && (
              <div className="text-xs opacity-80 truncate">
                📍 {event.address}
              </div>
            )}
            
            {/* Contact person */}
            {event.contact_person && (
              <div className="flex items-center gap-1 text-xs truncate">
                <User className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.contact_person}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Contact details - visible for events > 100px */}
        {height > 100 && (
          <div className="space-y-1 pt-1 border-t border-current/10">
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
        
        {/* Description - visible for events > 140px */}
        {event.description && height > 140 && (
          <div className="text-xs opacity-70 line-clamp-3 pt-1 border-t border-current/10">
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
    prevProps.isResizing === nextProps.isResizing &&
    prevProps.viewStartHour === nextProps.viewStartHour
  );
});
