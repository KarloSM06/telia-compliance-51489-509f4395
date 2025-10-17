import { useState, useCallback } from 'react';
import { CalendarEvent } from './useCalendarEvents';

export interface PendingEventChange {
  eventId: string;
  updates: Partial<CalendarEvent>;
}

export const usePendingEventChanges = () => {
  const [pendingChanges, setPendingChanges] = useState<Map<string, Partial<CalendarEvent>>>(new Map());

  const addPendingChange = useCallback((eventId: string, updates: Partial<CalendarEvent>) => {
    setPendingChanges(prev => {
      const newChanges = new Map(prev);
      const existing = newChanges.get(eventId) || {};
      newChanges.set(eventId, { ...existing, ...updates });
      return newChanges;
    });
  }, []);

  const clearPendingChanges = useCallback(() => {
    setPendingChanges(new Map());
  }, []);

  const getEventWithPendingChanges = useCallback((event: CalendarEvent): CalendarEvent => {
    const pending = pendingChanges.get(event.id);
    if (!pending) return event;
    return { ...event, ...pending };
  }, [pendingChanges]);

  const hasPendingChanges = pendingChanges.size > 0;

  return {
    pendingChanges,
    addPendingChange,
    clearPendingChanges,
    getEventWithPendingChanges,
    hasPendingChanges,
  };
};
