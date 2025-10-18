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
  viewStartHour?: number;
  hasPendingChanges?: boolean;
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
  hasPendingChanges = false,
}: EventBlockProps) => {
  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);
  
  const { top, height } = getEventPosition(startTime.toISOString(), endTime.toISOString(), viewStartHour);
  const colorClass = getEventTypeColor(event.event_type);

  const width = totalColumns > 1 ? `${100 / totalColumns}%` : '100%';
  const left = totalColumns > 1 ? `${(column * 100) / totalColumns}%` : '0%';

  const duration = differenceInMinutes(endTime, startTime);

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
      className={`absolute rounded-lg border-l-4 p-2 shadow-sm cursor-move transition-all duration-50 group ${enhancedColorClass} ${
        isResizing ? 'ring-2 ring-primary scale-[1.02] shadow-xl opacity-90' : 'hover:shadow-lg hover:scale-[1.01]'
      } ${hasPendingChanges ? 'ring-2 ring-orange-500/50 animate-[pulse_1s_ease-in-out_1]' : ''}`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`,
        width,
        left,
        zIndex: isResizing ? 30 : 10,
        transform: 'translate3d(0, 0, 0)',
        willChange: isResizing ? 'transform' : 'auto',
      }}
      title={hasPendingChanges ? 'Ej sparad' : undefined}
    >
      {/* Pending changes indicator */}
      {hasPendingChanges && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-background z-10" />
      )}

      {/* Enhanced top resize handle - always visible and larger */}
      <div
        className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-primary/40 rounded-t-lg transition-all duration-100 flex flex-col items-center justify-center touch-manipulation"
        onMouseDown={(e) => handleMouseDown(e, 'top')}
        onTouchStart={(e) => handleTouchStart(e, 'top')}
        style={{ minHeight: '32px', marginTop: '-8px' }}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="text-xs leading-none">═══</div>
        </div>
        <div className={`absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-primary-foreground bg-primary px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap transition-opacity ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {format(startTime, 'HH:mm')}
        </div>
      </div>

      {/* Event content */}
      <div className="mt-2 space-y-1 overflow-hidden">
        {/* Title - always visible and clickable */}
        <div 
          className="text-sm font-semibold truncate leading-tight cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            if (!isResizing) {
              onEventClick(event);
            }
          }}
        >
          {event.title}
        </div>
        
        {/* Time - visible for events > 30px */}
        {height > 30 && (
          <div className="text-xs text-muted-foreground font-medium">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </div>
        )}
        
        {/* Address - visible for events > 45px */}
        {event.address && height > 45 && (
          <div className="text-xs opacity-80 truncate">
            📍 {event.address}
          </div>
        )}
        
        {/* Contact person - visible for events > 70px */}
        {event.contact_person && height > 70 && (
          <div className="flex items-center gap-1 text-xs truncate">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{event.contact_person}</span>
          </div>
        )}
        
        {/* Contact details - visible for events > 100px */}
        {height > 100 && (
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
        
        {/* Description - visible for events > 130px */}
        {event.description && height > 130 && (
          <div className="text-xs opacity-70 line-clamp-2 pt-1 border-t border-current/10">
            {event.description}
          </div>
        )}
      </div>

      {/* Enhanced bottom resize handle - always visible and larger */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-transparent hover:bg-primary/40 rounded-b-lg transition-all duration-100 flex flex-col items-center justify-center touch-manipulation"
        onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        onTouchStart={(e) => handleTouchStart(e, 'bottom')}
        style={{ minHeight: '32px', marginBottom: '-8px' }}
      >
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="text-xs leading-none">═══</div>
        </div>
        <div className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-bold text-primary-foreground bg-primary px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap transition-opacity ${isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {format(endTime, 'HH:mm')}
        </div>
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
    prevProps.viewStartHour === nextProps.viewStartHour &&
    prevProps.hasPendingChanges === nextProps.hasPendingChanges
  );
});
