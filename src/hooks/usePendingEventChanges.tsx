import { useState, useCallback, useMemo } from 'react';
import { CalendarEvent } from './useCalendarEvents';

export interface PendingEventChange {
  eventId: string;
  updates: Partial<CalendarEvent>;
}

interface HistoryEntry {
  changes: Map<string, Partial<CalendarEvent>>;
  timestamp: number;
}

export const usePendingEventChanges = () => {
  const [pendingChanges, setPendingChanges] = useState<Map<string, Partial<CalendarEvent>>>(new Map());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Optimized lookup cache
  const changesCache = useMemo(() => {
    const cache = new Map<string, CalendarEvent>();
    return {
      get: (event: CalendarEvent) => {
        const cached = cache.get(event.id);
        if (cached && cached.start_time === event.start_time && cached.end_time === event.end_time) {
          return cached;
        }
        const pending = pendingChanges.get(event.id);
        const result = pending ? { ...event, ...pending } : event;
        cache.set(event.id, result);
        return result;
      },
      clear: () => cache.clear(),
    };
  }, [pendingChanges]);

  const addPendingChange = useCallback((eventId: string, updates: Partial<CalendarEvent>) => {
    setPendingChanges(prev => {
      const newChanges = new Map(prev);
      const existing = newChanges.get(eventId) || {};
      newChanges.set(eventId, { ...existing, ...updates });
      
      // Save to history
      setHistory(h => [...h.slice(0, historyIndex + 1), {
        changes: new Map(newChanges),
        timestamp: Date.now(),
      }]);
      setHistoryIndex(i => i + 1);
      
      return newChanges;
    });
    changesCache.clear();
  }, [historyIndex, changesCache]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1);
      setPendingChanges(history[historyIndex - 1].changes);
      changesCache.clear();
    } else if (historyIndex === 0) {
      setHistoryIndex(-1);
      setPendingChanges(new Map());
      changesCache.clear();
    }
  }, [historyIndex, history, changesCache]);

  const clearPendingChanges = useCallback(() => {
    setPendingChanges(new Map());
    setHistory([]);
    setHistoryIndex(-1);
    changesCache.clear();
  }, [changesCache]);

  const getEventWithPendingChanges = useCallback((event: CalendarEvent): CalendarEvent => {
    return changesCache.get(event);
  }, [changesCache]);

  const hasPendingChanges = pendingChanges.size > 0;
  const canUndo = historyIndex >= 0;

  return {
    pendingChanges,
    addPendingChange,
    clearPendingChanges,
    getEventWithPendingChanges,
    hasPendingChanges,
    undo,
    canUndo,
  };
};
