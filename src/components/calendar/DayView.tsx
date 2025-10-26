import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Undo } from 'lucide-react';
import { TimeGrid } from './TimeGrid';
import { EventBlock } from './EventBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { EventDragPreview } from './EventDragPreview';
import { EventModal } from './EventModal';
import { layoutOverlappingEvents, getEventPosition } from '@/lib/calendarUtils';
import { useOptimizedEventInteraction } from '@/hooks/useOptimizedEventInteraction';
import { usePendingEventChanges } from '@/hooks/usePendingEventChanges';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useAvailability } from '@/hooks/useAvailability';
import { useUserTimezone } from '@/hooks/useUserTimezone';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { formatInTimeZone_, toISOStringWithOffset } from '@/lib/timezoneUtils';
interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent | undefined>;
  onBackToMonth: () => void;
  onCreate: (startTime: Date) => Promise<void>;
  onDateChange: (date: Date) => void;
  onDelete: (id: string) => Promise<void>;
  showEventModal: boolean;
  selectedEvent: CalendarEvent | null;
  onCloseModal: () => void;
  onEventSave: (eventData: Partial<CalendarEvent>) => Promise<void>;
}
export const DayView = ({
  date,
  events,
  onEventClick,
  onEventUpdate,
  onBackToMonth,
  onCreate,
  onDateChange,
  onDelete,
  showEventModal,
  selectedEvent,
  onCloseModal,
  onEventSave
}: DayViewProps) => {
  const { timezone } = useUserTimezone();
  const { settings } = useProfileSettings();
  const {
    slots
  } = useAvailability();
  const {
    pendingChanges,
    addPendingChange,
    clearPendingChanges,
    getEventWithPendingChanges,
    hasPendingChanges,
    undo,
    canUndo
  } = usePendingEventChanges();
  const {
    dragState,
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleResizeStart,
    clearDragState
  } = useOptimizedEventInteraction(addPendingChange);

  // Calculate visible hour range based on availability slots
  // Swedish/ISO week standard: 0=Monday, 6=Sunday
  // Note: JavaScript Date.getDay() uses 0=Sunday, so conversion is needed
  const {
    startHour,
    endHour
  } = useMemo(() => {
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1; // Convert JS day (0=Sun) to our standard (0=Mon)
    const daySlots = slots.filter(slot => slot.day_of_week === dayOfWeek && slot.is_active);
    if (daySlots.length === 0) {
      return {
        startHour: 0,
        endHour: 23
      };
    }
    const times = daySlots.flatMap(slot => [parseInt(slot.start_time.split(':')[0]), parseInt(slot.end_time.split(':')[0])]);
    const earliest = Math.max(0, Math.min(...times) - 1);
    const latest = Math.min(23, Math.max(...times) + 1);
    return {
      startHour: earliest,
      endHour: latest
    };
  }, [slots, date]);

  // Apply pending changes to events for display with memoization
  const eventsWithPendingChanges = useMemo(() => events.map(getEventWithPendingChanges), [events, getEventWithPendingChanges]);
  const layoutedEvents = useMemo(() => layoutOverlappingEvents(eventsWithPendingChanges, timezone), [eventsWithPendingChanges, timezone]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);
  const handleSaveChanges = async () => {
    try {
      // Save all pending changes
      const savePromises = Array.from(pendingChanges.entries()).map(([eventId, updates]) => onEventUpdate(eventId, updates));
      await Promise.all(savePromises);
      clearPendingChanges();
      toast.success('Ändringar sparade');
    } catch (error) {
      toast.error('Kunde inte spara ändringar');
    }
  };
  const handleTimeSlotClick = async (time: Date) => {
    await onCreate(time);
  };
  const handleUndoClick = () => {
    undo();
    toast.success('Ångrade ändring');
  };

  // Calculate snap indicator position
  const snapIndicatorY = useMemo(() => {
    if (dragState.previewPosition?.start && dragState.previewPosition?.end) {
      const {
        top
      } = getEventPosition(toISOStringWithOffset(dragState.previewPosition.start, timezone), toISOStringWithOffset(dragState.previewPosition.end, timezone), startHour, timezone);
      return top;
    }
    return undefined;
  }, [dragState.previewPosition, startHour, timezone]);
  return <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBackToMonth}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Tillbaka till månad
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onDateChange(subDays(date, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-lg font-semibold min-w-[200px] text-center">
              {formatInTimeZone_(date, 'EEEE, d MMMM yyyy', timezone)}
            </div>
            
            <Button variant="outline" size="icon" onClick={() => onDateChange(addDays(date, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={() => onDateChange(new Date())}>
            Idag
          </Button>
        </div>

        <div className="flex gap-2">
          {canUndo && <Button onClick={handleUndoClick} variant="outline" size="sm" className="gap-2" title="Ångra (Ctrl+Z)">
              <Undo className="h-4 w-4" />
              Ångra
            </Button>}
          {hasPendingChanges && <Button onClick={handleSaveChanges} variant="default" className="gap-2">
              <Save className="h-4 w-4" />
              Spara ändringar ({pendingChanges.size})
            </Button>}
          
        </div>
      </div>

      {/* Day view grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative pl-16 pr-4">
          <div ref={containerRef} className="relative" onDragOver={handleDragOver} onDrop={handleDrop}>
            <TimeGrid onTimeSlotClick={handleTimeSlotClick} availabilitySlots={slots} currentDate={date} />
            
            {/* Current time indicator */}
            <CurrentTimeIndicator displayDate={date} viewStartHour={startHour} />

            {/* Lunch break overlay */}
            {settings.lunch_break_enabled && (() => {
              const lunchStart = settings.lunch_break_start.split(':');
              const lunchEnd = settings.lunch_break_end.split(':');
              const startHourNum = parseInt(lunchStart[0]);
              const startMinNum = parseInt(lunchStart[1]);
              const endHourNum = parseInt(lunchEnd[0]);
              const endMinNum = parseInt(lunchEnd[1]);
              
              const PIXELS_PER_HOUR = 80;
              const top = ((startHourNum * 60 + startMinNum) / 60 - startHour) * PIXELS_PER_HOUR;
              const height = ((endHourNum * 60 + endMinNum) - (startHourNum * 60 + startMinNum)) / 60 * PIXELS_PER_HOUR;
              
              return (
                <div
                  className="absolute left-0 right-0 bg-orange-100/50 dark:bg-orange-900/20 border-y border-orange-200 dark:border-orange-800 pointer-events-none z-0"
                  style={{ top: `${top}px`, height: `${height}px` }}
                >
                  <div className="flex items-center justify-center h-full text-xs text-orange-600 dark:text-orange-400 font-medium">
                    🍽️ Lunchrast
                  </div>
                </div>
              );
            })()}

            {/* Events */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              <div className="relative h-full pointer-events-auto">
                {layoutedEvents.map(event => <EventBlock key={event.id} event={event} column={event.column} totalColumns={event.totalColumns} onEventClick={onEventClick} onDragStart={handleDragStart} onResizeStart={handleResizeStart} isResizing={dragState.activeEventId === event.id && dragState.operation !== 'drag'} viewStartHour={startHour} />)}
                
                {/* Ghost preview during drag */}
                {dragState.operation === 'drag' && dragState.previewPosition && dragState.activeEventId && <EventDragPreview start={dragState.previewPosition.start} end={dragState.previewPosition.end} title={events.find(e => e.id === dragState.activeEventId)?.title || ''} snapIndicatorY={snapIndicatorY} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal with pending changes support */}
      {showEventModal && <EventModal open={showEventModal} onClose={onCloseModal} event={selectedEvent} onSave={onEventSave} onDelete={onDelete} pendingChanges={selectedEvent ? pendingChanges.get(selectedEvent.id) : undefined} />}
    </div>;
};