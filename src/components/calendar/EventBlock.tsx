import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { getEventPosition, getEventTypeColor } from '@/lib/calendarUtils';
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { useState, useRef, useCallback } from 'react';
import { addMinutes } from 'date-fns';
import { snapToInterval } from '@/lib/calendarUtils';

interface EventBlockProps {
  event: CalendarEvent;
  column: number;
  totalColumns: number;
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent | undefined>;
  onDragStart: (event: CalendarEvent) => void;
}

export const EventBlock = ({
  event,
  column,
  totalColumns,
  onEventClick,
  onEventUpdate,
  onDragStart,
}: EventBlockProps) => {
  const { top, height } = getEventPosition(event.start_time, event.end_time);
  const colorClass = getEventTypeColor(event.event_type);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{ startY: number; handle: 'top' | 'bottom' } | null>(null);

  const width = totalColumns > 1 ? `${100 / totalColumns}%` : '100%';
  const left = totalColumns > 1 ? `${(column * 100) / totalColumns}%` : '0%';

  const startTime = parseISO(event.start_time);
  const endTime = parseISO(event.end_time);
  const duration = differenceInMinutes(endTime, startTime);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: 'top' | 'bottom') => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStartRef.current = { startY: e.clientY, handle };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;

      const deltaY = moveEvent.clientY - resizeStartRef.current.startY;
      const deltaMinutes = Math.round(deltaY); // 1px = 1 minute
      const snappedDelta = Math.round(deltaMinutes / 15) * 15; // Snap to 15 min

      if (resizeStartRef.current.handle === 'top') {
        const newStartTime = addMinutes(startTime, snappedDelta);
        if (newStartTime < endTime) {
          onEventUpdate(event.id, {
            start_time: newStartTime.toISOString(),
          });
        }
      } else {
        const newEndTime = addMinutes(endTime, snappedDelta);
        if (newEndTime > startTime) {
          onEventUpdate(event.id, {
            end_time: newEndTime.toISOString(),
          });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeStartRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [event.id, startTime, endTime, onEventUpdate]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('eventId', event.id);
    onDragStart(event);
  };

  return (
    <div
      draggable={!isResizing}
      onDragStart={handleDragStart}
      onClick={() => onEventClick(event)}
      className={`absolute rounded-lg border-l-4 p-2 shadow-sm cursor-move hover:shadow-md transition-all group ${colorClass}`}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 30)}px`, // Minimum 30px height
        width,
        left,
        zIndex: isResizing ? 30 : 10,
      }}
    >
      {/* Top resize handle */}
      {height > 40 && (
        <div
          className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-foreground/20 rounded-t-lg transition-opacity"
          onMouseDown={(e) => handleResizeStart(e, 'top')}
        />
      )}

      {/* Event content */}
      <div className="text-xs font-medium truncate">{event.title}</div>
      {height > 40 && (
        <>
          <div className="text-xs text-muted-foreground">
            {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
          </div>
          {event.contact_person && height > 60 && (
            <div className="text-xs truncate mt-1">👤 {event.contact_person}</div>
          )}
        </>
      )}

      {/* Bottom resize handle */}
      {height > 40 && (
        <div
          className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100 hover:bg-foreground/20 rounded-b-lg transition-opacity"
          onMouseDown={(e) => handleResizeStart(e, 'bottom')}
        />
      )}
    </div>
  );
};
