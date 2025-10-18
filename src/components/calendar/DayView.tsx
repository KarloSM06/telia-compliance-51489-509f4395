import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format, addDays, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Undo } from 'lucide-react';
import { TimeGrid } from './TimeGrid';
import { EventBlock } from './EventBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { InteractionOverlay } from './InteractionOverlay';
import { EventModal } from './EventModal';
import { layoutOverlappingEvents } from '@/lib/calendarUtils';
import { useUnifiedEventInteraction } from '@/hooks/useUnifiedEventInteraction';
import { usePendingEventChanges } from '@/hooks/usePendingEventChanges';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useAvailability } from '@/hooks/useAvailability';
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
  // Calculate visible hour range based on availability slots
  const {
    startHour,
    endHour
  } = useMemo(() => {
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
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
  const eventsWithPendingChanges = useMemo(() => {
    return events.map(getEventWithPendingChanges);
  }, [events, getEventWithPendingChanges]);

  const layoutedEvents = useMemo(() => {
    return layoutOverlappingEvents(eventsWithPendingChanges);
  }, [eventsWithPendingChanges]);

  const {
    interactionState,
    containerRef,
    currentPointer,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useUnifiedEventInteraction({
    onEventUpdate: async (eventId, updates) => {
      addPendingChange(eventId, updates);
    },
    nearbyEvents: eventsWithPendingChanges,
    viewStartHour: startHour,
  });

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
              {format(date, 'EEEE, d MMMM yyyy', {
              locale: sv
            })}
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
          <div 
            ref={containerRef} 
            className="relative" 
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <TimeGrid 
              onTimeSlotClick={handleTimeSlotClick} 
              availabilitySlots={slots} 
              currentDate={date}
              snapIndicatorY={interactionState.snapIndicatorY}
              snapTime={interactionState.previewTimes?.start || null}
            />
            
            {/* Current time indicator */}
            <CurrentTimeIndicator displayDate={date} />

            {/* Events */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              <div className="relative h-full pointer-events-auto">
                {layoutedEvents.map(event => <EventBlock 
                  key={event.id} 
                  event={event} 
                  column={event.column} 
                  totalColumns={event.totalColumns} 
                  onEventClick={onEventClick} 
                  onPointerDown={handlePointerDown}
                  isInteracting={interactionState.eventId === event.id && !!interactionState.type}
                  viewStartHour={startHour}
                  hasPendingChanges={pendingChanges.has(event.id)}
                />)}
                
                {/* Interaction overlay */}
                {interactionState.type && (
                  <InteractionOverlay 
                    interactionState={interactionState}
                    viewStartHour={startHour}
                    mouseY={currentPointer?.y}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal with pending changes support */}
      {showEventModal && <EventModal open={showEventModal} onClose={onCloseModal} event={selectedEvent} onSave={onEventSave} onDelete={onDelete} pendingChanges={selectedEvent ? pendingChanges.get(selectedEvent.id) : undefined} />}
    </div>;
};