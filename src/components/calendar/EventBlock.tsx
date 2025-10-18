import React, { useMemo } from 'react';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { getEventPosition, formatEventDuration } from '@/lib/calendarUtils';
import { format, parseISO } from 'date-fns';
import { MapPin, User, FileText, GripVertical, Mail, Phone } from 'lucide-react';
import { InteractionType } from '@/hooks/useUnifiedEventInteraction';

interface EventBlockProps {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  onEventClick: (event: CalendarEvent) => void;
  onPointerDown?: (e: React.PointerEvent, event: CalendarEvent, type: InteractionType) => void;
  viewStartHour?: number;
  hasPendingChanges?: boolean;
  isInteracting?: boolean;
}

const EventBlockComponent: React.FC<EventBlockProps> = ({
  event,
  column,
  totalColumns,
  onEventClick,
  onPointerDown,
  viewStartHour = 0,
  hasPendingChanges = false,
  isInteracting = false,
}) => {
  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);
  
  const { top, height } = useMemo(
    () => getEventPosition(event.start_time, event.end_time, viewStartHour),
    [event.start_time, event.end_time, viewStartHour]
  );

  const width = totalColumns > 1 ? `${100 / totalColumns}%` : '100%';
  const left = totalColumns > 1 ? `${(column * 100) / totalColumns}%` : '0%';

  const duration = formatEventDuration(startTime, endTime);

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

  const handleTitleClick = (e: React.MouseEvent) => {
    if (!isInteracting) {
      e.stopPropagation();
      onEventClick(event);
    }
  };

  return (
    <div
      className={`absolute rounded-lg border-l-4 p-2 shadow-sm select-none transition-all duration-50 group ${enhancedColorClass} ${
        isInteracting ? 'opacity-50 scale-[1.02] shadow-xl' : 'hover:shadow-lg hover:scale-[1.01]'
      } ${hasPendingChanges ? 'ring-2 ring-orange-500/50 animate-pulse' : ''}`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`,
        width,
        left,
        cursor: isInteracting ? 'grabbing' : 'grab',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        zIndex: isInteracting ? 30 : 10,
      }}
      onPointerDown={(e) => onPointerDown?.(e, event, 'drag')}
      title={hasPendingChanges ? 'Osparade ändringar' : undefined}
    >
      {/* Pending changes indicator */}
      {hasPendingChanges && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-background z-10" />
      )}

      {/* Top resize handle - 48px for easy interaction */}
      <div
        className="absolute top-0 left-0 right-0 cursor-ns-resize hover:bg-primary/30 active:bg-primary/50 transition-all flex items-center justify-center group/handle touch-none"
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown?.(e, event, 'resize-top');
        }}
        style={{ height: '48px', minHeight: '48px', marginTop: '-24px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover/handle:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-foreground/60" />
        </div>
        <div className="absolute top-1 left-2 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-xs font-semibold opacity-0 group-hover/handle:opacity-100 transition-opacity">
          {format(startTime, 'HH:mm')}
        </div>
      </div>

      {/* Event content */}
      <div className="mt-2 space-y-1 overflow-hidden pointer-events-none">
        {/* Title - always visible and clickable */}
        <div 
          className="text-sm font-semibold truncate leading-tight cursor-pointer hover:underline pointer-events-auto"
          onClick={handleTitleClick}
        >
          {event.title}
        </div>
        
        {/* Time - visible for events > 30px */}
        {height > 30 && (
          <div className="text-xs text-muted-foreground font-medium">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')} ({duration})
          </div>
        )}
        
        {/* Address - visible for events > 45px */}
        {event.address && height > 45 && (
          <div className="text-xs opacity-80 truncate flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{event.address}</span>
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
          <div className="flex items-start gap-1 text-xs opacity-70 pt-1 border-t border-current/10">
            <FileText className="h-3 w-3 flex-shrink-0 mt-0.5" />
            <span className="line-clamp-2">{event.description}</span>
          </div>
        )}
      </div>

      {/* Bottom resize handle - 48px for easy interaction */}
      <div
        className="absolute bottom-0 left-0 right-0 cursor-ns-resize hover:bg-primary/30 active:bg-primary/50 transition-all flex items-center justify-center group/handle touch-none"
        onPointerDown={(e) => {
          e.stopPropagation();
          onPointerDown?.(e, event, 'resize-bottom');
        }}
        style={{ height: '48px', minHeight: '48px', marginBottom: '-24px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover/handle:opacity-100 transition-opacity">
          <GripVertical className="h-4 w-4 text-foreground/60" />
        </div>
        <div className="absolute bottom-1 left-2 bg-primary/90 text-primary-foreground px-2 py-0.5 rounded text-xs font-semibold opacity-0 group-hover/handle:opacity-100 transition-opacity">
          {format(endTime, 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

export const EventBlock = React.memo(
  EventBlockComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.event.id === nextProps.event.id &&
      prevProps.event.start_time === nextProps.event.start_time &&
      prevProps.event.end_time === nextProps.event.end_time &&
      prevProps.event.title === nextProps.event.title &&
      prevProps.column === nextProps.column &&
      prevProps.totalColumns === nextProps.totalColumns &&
      prevProps.hasPendingChanges === nextProps.hasPendingChanges &&
      prevProps.isInteracting === nextProps.isInteracting
    );
  }
);
