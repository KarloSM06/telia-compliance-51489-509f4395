import { useState, useCallback, useRef } from 'react';
import { CalendarEvent } from './useCalendarEvents';
import { parseISO, addMinutes } from 'date-fns';
import { getTimeFromYPosition, calculateSnapPosition, validateEventTimes } from '@/lib/calendarUtils';
import { usePointerTracking } from './usePointerTracking';

export type InteractionType = 'drag' | 'resize-top' | 'resize-bottom' | null;

export interface InteractionState {
  type: InteractionType;
  eventId: string | null;
  startPos: { x: number; y: number } | null;
  currentPos: { x: number; y: number } | null;
  originalEvent: CalendarEvent | null;
  previewTimes: { start: Date; end: Date } | null;
  snapIndicatorY: number | null;
}

interface UseUnifiedEventInteractionProps {
  onEventUpdate: (eventId: string, updates: Partial<CalendarEvent>) => void;
  nearbyEvents?: CalendarEvent[];
  viewStartHour?: number;
}

export const useUnifiedEventInteraction = ({
  onEventUpdate,
  nearbyEvents = [],
  viewStartHour = 0,
}: UseUnifiedEventInteractionProps) => {
  const [interactionState, setInteractionState] = useState<InteractionState>({
    type: null,
    eventId: null,
    startPos: null,
    currentPos: null,
    originalEvent: null,
    previewTimes: null,
    snapIndicatorY: null,
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { currentPointer, startTracking, stopTracking } = usePointerTracking();

  const calculatePreviewTimes = useCallback((
    type: InteractionType,
    event: CalendarEvent,
    mouseY: number,
    containerTop: number
  ): { start: Date; end: Date } | null => {
    if (!type || !event) return null;

    const startTime = parseISO(event.start_time);
    const endTime = parseISO(event.end_time);
    const duration = (endTime.getTime() - startTime.getTime()) / 1000 / 60; // minutes

    const newTime = getTimeFromYPosition(mouseY, containerTop, viewStartHour);
    const snappedTime = calculateSnapPosition(newTime, 15, nearbyEvents);

    if (type === 'drag') {
      const newStart = snappedTime;
      const newEnd = addMinutes(newStart, duration);
      return { start: newStart, end: newEnd };
    } else if (type === 'resize-top') {
      const newStart = snappedTime;
      const newEnd = endTime;
      if (!validateEventTimes(newStart, newEnd)) {
        // Enforce minimum duration
        return { start: addMinutes(newEnd, -15), end: newEnd };
      }
      return { start: newStart, end: newEnd };
    } else if (type === 'resize-bottom') {
      const newStart = startTime;
      const newEnd = snappedTime;
      if (!validateEventTimes(newStart, newEnd)) {
        // Enforce minimum duration
        return { start: newStart, end: addMinutes(newStart, 15) };
      }
      return { start: newStart, end: newEnd };
    }

    return null;
  }, [nearbyEvents, viewStartHour]);

  const handlePointerDown = useCallback((
    e: React.PointerEvent,
    event: CalendarEvent,
    type: InteractionType
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    setInteractionState({
      type,
      eventId: event.id,
      startPos: { x: e.clientX, y: e.clientY },
      currentPos: { x: e.clientX, y: e.clientY },
      originalEvent: event,
      previewTimes: null,
      snapIndicatorY: null,
    });

    startTracking();
    
    // Capture pointer for smooth tracking
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [startTracking]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!interactionState.type || !interactionState.originalEvent || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const previewTimes = calculatePreviewTimes(
      interactionState.type,
      interactionState.originalEvent,
      e.clientY,
      rect.top
    );

    if (previewTimes) {
      const PIXELS_PER_MINUTE = 80 / 60;
      const snapY = ((previewTimes.start.getHours() - viewStartHour) * 60 + previewTimes.start.getMinutes()) * PIXELS_PER_MINUTE;

      setInteractionState(prev => ({
        ...prev,
        currentPos: { x: e.clientX, y: e.clientY },
        previewTimes,
        snapIndicatorY: snapY,
      }));
    }
  }, [interactionState.type, interactionState.originalEvent, calculatePreviewTimes, viewStartHour]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!interactionState.type || !interactionState.eventId || !interactionState.previewTimes) {
      setInteractionState({
        type: null,
        eventId: null,
        startPos: null,
        currentPos: null,
        originalEvent: null,
        previewTimes: null,
        snapIndicatorY: null,
      });
      stopTracking();
      return;
    }

    // Save the changes
    onEventUpdate(interactionState.eventId, {
      start_time: interactionState.previewTimes.start.toISOString(),
      end_time: interactionState.previewTimes.end.toISOString(),
    });

    // Reset state
    setInteractionState({
      type: null,
      eventId: null,
      startPos: null,
      currentPos: null,
      originalEvent: null,
      previewTimes: null,
      snapIndicatorY: null,
    });

    stopTracking();
    
    // Release pointer capture
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, [interactionState, onEventUpdate, stopTracking]);

  const cancelInteraction = useCallback(() => {
    setInteractionState({
      type: null,
      eventId: null,
      startPos: null,
      currentPos: null,
      originalEvent: null,
      previewTimes: null,
      snapIndicatorY: null,
    });
    stopTracking();
  }, [stopTracking]);

  return {
    interactionState,
    containerRef,
    currentPointer,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    cancelInteraction,
  };
};
