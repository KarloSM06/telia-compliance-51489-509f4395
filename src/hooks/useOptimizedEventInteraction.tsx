import { useState, useCallback, useRef, useEffect } from 'react';
import { CalendarEvent } from './useCalendarEvents';
import { addMinutes, parseISO, differenceInMinutes } from 'date-fns';
import { snapToInterval, getTimeFromYPosition } from '@/lib/calendarUtils';
import { useUserTimezone } from './useUserTimezone';
import { createDateTimeInZone } from '@/lib/timezoneUtils';

export type OperationType = 'drag' | 'resize-top' | 'resize-bottom' | null;

export interface DragState {
  activeEventId: string | null;
  operation: OperationType;
  previewPosition: { start: Date; end: Date } | null;
  initialMouseY: number | null;
  originalStart: Date | null;
  originalEnd: Date | null;
}

export const useOptimizedEventInteraction = (
  onPendingChange: (eventId: string, updates: Partial<CalendarEvent>) => void
) => {
  const { timezone } = useUserTimezone();
  const [dragState, setDragState] = useState<DragState>({
    activeEventId: null,
    operation: null,
    previewPosition: null,
    initialMouseY: null,
    originalStart: null,
    originalEnd: null,
  });

  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Start dragging an event
  const handleDragStart = useCallback((event: CalendarEvent) => {
    const start = parseISO(event.start_time);
    const end = parseISO(event.end_time);
    
    setDragState({
      activeEventId: event.id,
      operation: 'drag',
      previewPosition: { start, end },
      initialMouseY: null,
      originalStart: start,
      originalEnd: end,
    });
  }, []);

  // Handle drag over with throttling
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!dragState.activeEventId || dragState.operation !== 'drag' || !containerRef.current) {
      return;
    }

    // Use requestAnimationFrame for smooth 60fps updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      const dropTime = getTimeFromYPosition(e.clientY, rect.top, 0, new Date(), timezone);
      const snappedTime = snapToInterval(dropTime, 15);
      
      // Find which day column we're over
      const target = e.target as HTMLElement;
      const dayContainer = target.closest('[data-day-date]') as HTMLElement;
      
      let targetDate = snappedTime;
      if (dayContainer) {
        const dayDateStr = dayContainer.getAttribute('data-day-date');
        if (dayDateStr) {
          const dayDate = parseISO(dayDateStr);
          // Combine the day from the target column with the time from mouse position
          targetDate = new Date(
            dayDate.getFullYear(),
            dayDate.getMonth(),
            dayDate.getDate(),
            snappedTime.getHours(),
            snappedTime.getMinutes()
          );
        }
      }
      
      const duration = differenceInMinutes(
        dragState.originalEnd!,
        dragState.originalStart!
      );
      
      const newEndTime = addMinutes(targetDate, duration);

      setDragState(prev => ({
        ...prev,
        previewPosition: { start: targetDate, end: newEndTime },
      }));
    });
  }, [dragState.activeEventId, dragState.operation, dragState.originalStart, dragState.originalEnd, timezone]);

  // Drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    if (!dragState.activeEventId || !dragState.previewPosition) {
      return;
    }

    onPendingChange(dragState.activeEventId, {
      start_time: dragState.previewPosition.start.toISOString(),
      end_time: dragState.previewPosition.end.toISOString(),
    });

    setDragState({
      activeEventId: null,
      operation: null,
      previewPosition: null,
      initialMouseY: null,
      originalStart: null,
      originalEnd: null,
    });
  }, [dragState.activeEventId, dragState.previewPosition, onPendingChange]);

  // Start resizing
  const handleResizeStart = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    event: CalendarEvent,
    handle: 'top' | 'bottom'
  ) => {
    e.stopPropagation();
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const start = parseISO(event.start_time);
    const end = parseISO(event.end_time);

    setDragState({
      activeEventId: event.id,
      operation: handle === 'top' ? 'resize-top' : 'resize-bottom',
      previewPosition: { start, end },
      initialMouseY: clientY,
      originalStart: start,
      originalEnd: end,
    });
  }, []);

  // Handle resize move with throttling
  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!dragState.activeEventId || !dragState.operation || dragState.operation === 'drag') {
      return;
    }

    // Use requestAnimationFrame for smooth updates
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaY = clientY - dragState.initialMouseY!;
      const deltaMinutes = Math.round(deltaY); // 1px = 1 minute
      const snappedDelta = Math.round(deltaMinutes / 15) * 15;

      if (dragState.operation === 'resize-top') {
        const newStartTime = addMinutes(dragState.originalStart!, snappedDelta);
        if (newStartTime < dragState.originalEnd!) {
          setDragState(prev => ({
            ...prev,
            previewPosition: { start: newStartTime, end: prev.originalEnd! },
          }));
        }
      } else if (dragState.operation === 'resize-bottom') {
        const newEndTime = addMinutes(dragState.originalEnd!, snappedDelta);
        if (newEndTime > dragState.originalStart!) {
          setDragState(prev => ({
            ...prev,
            previewPosition: { start: prev.originalStart!, end: newEndTime },
          }));
        }
      }
    });
  }, [dragState.activeEventId, dragState.operation, dragState.initialMouseY, dragState.originalStart, dragState.originalEnd]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    if (!dragState.activeEventId || !dragState.previewPosition) {
      setDragState({
        activeEventId: null,
        operation: null,
        previewPosition: null,
        initialMouseY: null,
        originalStart: null,
        originalEnd: null,
      });
      return;
    }

    onPendingChange(dragState.activeEventId, {
      start_time: dragState.previewPosition.start.toISOString(),
      end_time: dragState.previewPosition.end.toISOString(),
    });

    setDragState({
      activeEventId: null,
      operation: null,
      previewPosition: null,
      initialMouseY: null,
      originalStart: null,
      originalEnd: null,
    });
  }, [dragState.activeEventId, dragState.previewPosition, onPendingChange]);

  // Attach/detach event listeners for resize
  useEffect(() => {
    if (dragState.operation && dragState.operation !== 'drag') {
      const handleMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        handleResizeMove(e);
      };

      const handleEnd = () => {
        handleResizeEnd();
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [dragState.operation, handleResizeMove, handleResizeEnd]);

  const clearDragState = useCallback(() => {
    setDragState({
      activeEventId: null,
      operation: null,
      previewPosition: null,
      initialMouseY: null,
      originalStart: null,
      originalEnd: null,
    });
  }, []);

  return {
    dragState,
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleResizeStart,
    clearDragState,
  };
};
