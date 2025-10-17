import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { parseISO, addMinutes, setMinutes, setHours, isSameDay, differenceInMinutes } from "date-fns";

export const snapToInterval = (date: Date, intervalMinutes: number = 15): Date => {
  const minutes = date.getMinutes();
  const snappedMinutes = Math.round(minutes / intervalMinutes) * intervalMinutes;
  return setMinutes(date, snappedMinutes);
};

export const getTimeFromYPosition = (y: number, containerTop: number): Date => {
  const PIXELS_PER_HOUR = 60;
  const relativeY = y - containerTop;
  const totalMinutes = (relativeY / PIXELS_PER_HOUR) * 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const now = new Date();
  return setMinutes(setHours(now, hours), minutes); // Start at 00:00
};

export const getEventPosition = (startTime: string, endTime: string) => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);
  
  const startHour = start.getHours();
  const startMinute = start.getMinutes();
  const duration = differenceInMinutes(end, start);
  
  const PIXELS_PER_MINUTE = 1;
  const top = (startHour * 60 + startMinute) * PIXELS_PER_MINUTE; // Start at 00:00
  const height = duration * PIXELS_PER_MINUTE;
  
  return { top, height };
};

export const doesOverlap = (event1: CalendarEvent, event2: CalendarEvent): boolean => {
  const start1 = parseISO(event1.start_time);
  const end1 = parseISO(event1.end_time);
  const start2 = parseISO(event2.start_time);
  const end2 = parseISO(event2.end_time);
  
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
