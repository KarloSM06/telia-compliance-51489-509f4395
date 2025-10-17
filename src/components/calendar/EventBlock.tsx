import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { getEventPosition, getEventTypeColor } from '@/lib/calendarUtils';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { useState, useRef, useCallback, useEffect } from 'react';
import { addMinutes } from 'date-fns';
import { snapToInterval } from '@/lib/calendarUtils';
import { User, Mail, Phone } from 'lucide-react';

interface EventBlockProps {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  onEventClick: (event: CalendarEvent) => void;
  onPendingChange: (eventId: string, updates: Partial<CalendarEvent>) => void;
  onDragStart: (event: CalendarEvent) => void;
}

export const EventBlock = ({
  event,
  column,
  totalColumns,
  onEventClick,
  onPendingChange,
  onDragStart,
}: EventBlockProps) => {
  const [tempStartTime, setTempStartTime] = useState<Date | null>(null);
  const [tempEndTime, setTempEndTime] = useState<Date | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ startY: number; handle: 'top' | 'bottom' } | null>(null);

  // Reset temp times when event times change (after save or cancel)
  useEffect(() => {
    setTempStartTime(null);
    setTempEndTime(null);
  }, [event.start_time, event.end_time]);

  const startTime = tempStartTime || parseISO(event.start_time);
  const endTime = tempEndTime || parseISO(event.end_time);
  
  const { top, height } = getEventPosition(startTime.toISOString(), endTime.toISOString());
  const colorClass = getEventTypeColor(event.event_type);

  const width = totalColumns > 1 ? `${100 / totalColumns}%` : '100%';
  const left = totalColumns > 1 ? `${(column * 100) / totalColumns}%` : '0%';

  const duration = differenceInMinutes(endTime, startTime);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: 'top' | 'bottom') => {
    e.stopPropagation();
    setIsResizing(true);
    const originalStart = parseISO(event.start_time);
    const originalEnd = parseISO(event.end_time);
    resizeStartRef.current = { startY: e.clientY, handle };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaY = moveEvent.clientY - resizeStartRef.current.startY;
      const deltaMinutes = Math.round(deltaY); // 1px = 1 minute
      const snappedDelta = Math.round(deltaMinutes / 15) * 15; // Snap to 15 min

      if (resizeStartRef.current.handle === 'top') {
        const newStartTime = addMinutes(originalStart, snappedDelta);
        if (newStartTime < (tempEndTime || originalEnd)) {
          setTempStartTime(newStartTime);
        }
      } else {
        const newEndTime = addMinutes(originalEnd, snappedDelta);
        if (newEndTime > (tempStartTime || originalStart)) {
          setTempEndTime(newEndTime);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Add as pending change instead of opening modal
      if (tempStartTime || tempEndTime) {
        onPendingChange(event.id, {
          start_time: (tempStartTime || originalStart).toISOString(),
          end_time: (tempEndTime || originalEnd).toISOString(),
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [event.id, tempStartTime, tempEndTime, onPendingChange]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('eventId', event.id);
    onDragStart(event);
  };

  const handleClick = () => {
    if (!isResizing) {
      // Reset temp times when opening modal normally
      setTempStartTime(null);
      setTempEndTime(null);
      onEventClick(event);
    }
  };

  return (
    <div
      draggable={!isResizing}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`absolute rounded-lg border-l-4 p-2 shadow-sm cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all group ${colorClass} ${isResizing ? 'ring-2 ring-primary' : ''}`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`,
        width,
        left,
        zIndex: isResizing ? 30 : 10,
      }}
    >
      {/* Top resize handle - more visible */}
      <div
        className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize opacity-50 group-hover:opacity-100 hover:bg-primary/30 rounded-t-lg transition-all flex items-center justify-center"
        onMouseDown={(e) => handleResizeStart(e, 'top')}
      >
        <div className="w-8 h-0.5 bg-foreground/40 rounded-full" />
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

      {/* Bottom resize handle - more visible */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize opacity-50 group-hover:opacity-100 hover:bg-primary/30 rounded-b-lg transition-all flex items-center justify-center"
        onMouseDown={(e) => handleResizeStart(e, 'bottom')}
      >
        <div className="w-8 h-0.5 bg-foreground/40 rounded-full" />
      </div>
    </div>
  );
};
