import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { differenceInMinutes, startOfDay, setMinutes, parseISO } from "date-fns";
import { toTimeZone, createDateTimeInZone, getCurrentTimeInZone } from "./timezoneUtils";

/**
 * Snap time to nearest interval
 */
export const snapToInterval = (date: Date, intervalMinutes: number = 15): Date => {
  const minutes = date.getMinutes();
  const snappedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;
  return setMinutes(date, snappedMinutes);
};

/**
 * Calculate time from Y position in calendar (timezone-aware)
 * @param y - Y position in pixels
 * @param containerTop - Top offset of container
 * @param viewStartHour - Starting hour of the view
 * @param referenceDate - Reference date to use
 * @param timezone - IANA timezone identifier
 * @returns Date object as UTC instant representing the local time
 */
export const getTimeFromYPosition = (
  y: number, 
  containerTop: number, 
  viewStartHour: number = 0,
  referenceDate: Date | undefined,
  timezone: string
): Date => {
  const PIXELS_PER_HOUR = 80;
  const relativeY = y - containerTop;
  const totalMinutes = (relativeY / PIXELS_PER_HOUR) * 60;
  const hours = Math.floor(totalMinutes / 60) + viewStartHour;
  const minutes = totalMinutes % 60;
  
  // Use referenceDate or current time in timezone
  const baseDate = referenceDate 
    ? toTimeZone(referenceDate, timezone)
    : getCurrentTimeInZone(timezone);
  
  // Create UTC instant for this local time
  return createDateTimeInZone(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hours,
    Math.round(minutes),
    timezone
  );
};

/**
 * Calculate event position from times (timezone-aware for display)
 * @param startTime - Start time ISO string (UTC from database)
 * @param endTime - End time ISO string (UTC from database)
 * @param viewStartHour - Starting hour of the view
 * @param timezone - IANA timezone identifier for display
 */
export const getEventPosition = (
  startTime: string, 
  endTime: string, 
  viewStartHour: number = 0,
  timezone: string
) => {
  // Convert to local time for display positioning
  const start = toTimeZone(startTime, timezone);
  const end = toTimeZone(endTime, timezone);
  
  const dayStart = startOfDay(start);
  const startMinutes = differenceInMinutes(start, dayStart);
  const duration = differenceInMinutes(end, start);
  
  const PIXELS_PER_HOUR = 80;
  return {
    top: ((startMinutes / 60) - viewStartHour) * PIXELS_PER_HOUR,
    height: (duration / 60) * PIXELS_PER_HOUR,
  };
};

/**
 * Check if two events overlap (timezone-aware)
 */
export const doesOverlap = (
  event1: CalendarEvent, 
  event2: CalendarEvent,
  timezone: string
): boolean => {
  // Convert to local time for comparison
  const start1 = toTimeZone(event1.start_time, timezone);
  const end1 = toTimeZone(event1.end_time, timezone);
  const start2 = toTimeZone(event2.start_time, timezone);
  const end2 = toTimeZone(event2.end_time, timezone);
  
  return start1 < end2 && start2 < end1;
};

export interface LayoutEvent extends CalendarEvent {
  column: number;
  totalColumns: number;
}

/**
 * Layout overlapping events in columns
 * Sorting is done on UTC times, but overlap detection uses timezone
 */
export const layoutOverlappingEvents = (
  events: CalendarEvent[],
  timezone: string = 'Europe/Stockholm'
): LayoutEvent[] => {
  if (events.length === 0) return [];
  
  const sorted = [...events].sort((a, b) => 
    parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime()
  );
  
  const columns: CalendarEvent[][] = [];
  
  sorted.forEach(event => {
    let placed = false;
    for (let col of columns) {
      const lastInCol = col[col.length - 1];
      if (!doesOverlap(event, lastInCol, timezone)) {
        col.push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
  });
  
  return sorted.map(event => {
    const colIndex = columns.findIndex(col => col.includes(event));
    return {
      ...event,
      column: colIndex,
      totalColumns: columns.length,
    };
  });
};

export const getEventTypeColor = (eventType: string) => {
  const colors: Record<string, string> = {
    meeting: 'bg-blue-100 border-blue-500 text-blue-900',
    call: 'bg-green-100 border-green-500 text-green-900',
    demo: 'bg-purple-100 border-purple-500 text-purple-900',
    followup: 'bg-orange-100 border-orange-500 text-orange-900',
    other: 'bg-gray-100 border-gray-500 text-gray-900',
  };
  
  return colors[eventType] || colors.other;
};

/**
 * Calculate snap position with smart snapping (timezone-aware)
 */
export const calculateSnapPosition = (
  time: Date,
  intervalMinutes: number = 15,
  nearbyEvents?: CalendarEvent[],
  timezone: string = 'Europe/Stockholm'
): Date => {
  const snappedTime = snapToInterval(time, intervalMinutes);
  
  // If no nearby events, return simple snap
  if (!nearbyEvents || nearbyEvents.length === 0) {
    return snappedTime;
  }

  // Check if we're close to any event boundaries (within 5 minutes)
  const SNAP_THRESHOLD = 5 * 60 * 1000; // 5 minutes in ms
  
  for (const event of nearbyEvents) {
    const eventStart = toTimeZone(event.start_time, timezone);
    const eventEnd = toTimeZone(event.end_time, timezone);
    
    const diffToStart = Math.abs(time.getTime() - eventStart.getTime());
    const diffToEnd = Math.abs(time.getTime() - eventEnd.getTime());
    
    if (diffToStart < SNAP_THRESHOLD) {
      return eventStart;
    }
    if (diffToEnd < SNAP_THRESHOLD) {
      return eventEnd;
    }
  }
  
  return snappedTime;
};

/**
 * Validate event times
 */
export const validateEventTimes = (start: Date, end: Date): boolean => {
  const minDuration = 15; // minutes
  const maxDuration = 24 * 60; // 24 hours
  
  const duration = differenceInMinutes(end, start);
  return duration >= minDuration && duration <= maxDuration;
};

/**
 * Check for event conflicts (timezone-aware)
 */
export const checkEventConflicts = (
  event: CalendarEvent,
  allEvents: CalendarEvent[],
  timezone: string = 'Europe/Stockholm'
): CalendarEvent[] => {
  return allEvents.filter(e => 
    e.id !== event.id && doesOverlap(event, e, timezone)
  );
};

/**
 * Format event duration
 */
export const formatEventDuration = (start: Date, end: Date): string => {
  const duration = differenceInMinutes(end, start);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours === 0) {
    return `${minutes}min`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}min`;
};
