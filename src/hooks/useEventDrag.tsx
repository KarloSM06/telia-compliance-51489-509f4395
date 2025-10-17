import { useState, useCallback } from 'react';
import { CalendarEvent } from './useCalendarEvents';
import { addMinutes, parseISO } from 'date-fns';
import { snapToInterval, getTimeFromYPosition } from '@/lib/calendarUtils';

export const useEventDrag = (
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent | undefined>
) => {
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((event: CalendarEvent) => {
    setDraggedEvent(event);
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, containerRef: HTMLDivElement | null) => {
    if (!draggedEvent || !containerRef) return;

    const rect = containerRef.getBoundingClientRect();
    const dropTime = getTimeFromYPosition(e.clientY, rect.top);
    const snappedTime = snapToInterval(dropTime, 15);
    
    const startTime = parseISO(draggedEvent.start_time);
    const endTime = parseISO(draggedEvent.end_time);
    const duration = (endTime.getTime() - startTime.getTime()) / 1000 / 60; // minutes
    
    const newEndTime = addMinutes(snappedTime, duration);

    await onEventUpdate(draggedEvent.id, {
      start_time: snappedTime.toISOString(),
      end_time: newEndTime.toISOString(),
    });

    setDraggedEvent(null);
    setIsDragging(false);
  }, [draggedEvent, onEventUpdate]);

  const handleDragEnd = useCallback(() => {
    setDraggedEvent(null);
    setIsDragging(false);
  }, []);

  return {
    draggedEvent,
    isDragging,
    handleDragStart,
    handleDrop,
    handleDragEnd,
  };
};
