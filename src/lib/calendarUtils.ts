import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { parseISO, addMinutes, setMinutes, setHours, isSameDay, differenceInMinutes } from "date-fns";
import { toStockholmTime, getCurrentStockholmTime } from "./timezoneUtils";

export const snapToInterval = (date: Date, intervalMinutes: number = 15): Date => {
  const minutes = date.getMinutes();
  const snappedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;
  return setMinutes(date, snappedMinutes);
};

export const getTimeFromYPosition = (y: number, containerTop: number, viewStartHour: number = 0): Date => {
  const PIXELS_PER_HOUR = 80;
  const relativeY = y - containerTop;
  const totalMinutes = (relativeY / PIXELS_PER_HOUR) * 60;
  const hours = Math.floor(totalMinutes / 60) + viewStartHour; // Add offset
  const minutes = totalMinutes % 60;
  
  // Create date in Stockholm timezone
  const stockholmNow = getCurrentStockholmTime();
  return setMinutes(setHours(stockholmNow, hours), minutes);
};

export const getEventPosition = (startTime: string, endTime: string, viewStartHour: number = 0) => {
  // Parse times as Stockholm time
  const start = toStockholmTime(startTime);
  const end = toStockholmTime(endTime);
  
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const duration = differenceInMinutes(end, start);
  
  const PIXELS_PER_MINUTE = 80 / 60; // 80px per hour = 1.33px per minute
  // Adjust for the view's start hour offset
  const top = ((startHour - viewStartHour) * 60 + startMinute) * PIXELS_PER_MINUTE;
  const height = duration * PIXELS_PER_MINUTE;
  
  return { top, height };
};

export const doesOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  // Convert to Stockholm time for overlap comparison
  const start1 = toStockholmTime(event1.start_time);
  const end1 = toStockholmTime(event1.end_time);
  const start2 = toStockholmTime(event2.start_time);
  const end2 = toStockholmTime(event2.end_time);
  
  return start1 < end2 && start2 < end1;
};

export interface LayoutEvent extends CalendarEvent {
  column: number;
  totalColumns: number;
}

export const layoutOverlappingEvents = (events: CalendarEvent[]): LayoutEvent[] => {
  if (events.length === 0) return [];
  
  const sorted = [...events].sort((a, b) => 
    parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime()
  );
  
  const columns: CalendarEvent[][] = [];
  
  sorted.forEach(event => {
    let placed = false;
    for (let col of columns) {
      const lastInCol = col[col.length - 1];
      if (!doesOverlap(event, lastInCol)) {
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

// Calculate snap position with smart snapping
export const calculateSnapPosition = (
  time: Date,
  intervalMinutes: number = 15,
  nearbyEvents?: CalendarEvent[]
): Date => {
  const snappedTime = snapToInterval(time, intervalMinutes);
  
  // If no nearby events, return simple snap
  if (!nearbyEvents || nearbyEvents.length === 0) {
    return snappedTime;
  }

  // Check if we're close to any event boundaries (within 5 minutes)
  const SNAP_THRESHOLD = 5 * 60 * 1000; // 5 minutes in ms
  
  for (const event of nearbyEvents) {
    const eventStart = toStockholmTime(event.start_time);
    const eventEnd = toStockholmTime(event.end_time);
    
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

// Validate event times
export const validateEventTimes = (start: Date, end: Date): boolean => {
  const minDuration = 15; // minutes
  const maxDuration = 24 * 60; // 24 hours
  
  const duration = differenceInMinutes(end, start);
  return duration >= minDuration && duration <= maxDuration;
};

// Check for event conflicts
export const checkEventConflicts = (
  event: CalendarEvent,
  allEvents: CalendarEvent[]
): CalendarEvent[] => {
  return allEvents.filter(e => 
    e.id !== event.id && doesOverlap(event, e)
  );
};

// Format event duration
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
