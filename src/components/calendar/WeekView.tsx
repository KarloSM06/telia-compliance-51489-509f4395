import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Undo } from 'lucide-react';
import { TimeGrid } from './TimeGrid';
import { EventBlock } from './EventBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { EventDragPreview } from './EventDragPreview';
import { EventModal } from './EventModal';
import { MiniCalendarPanel } from './MiniCalendarPanel';
import { layoutOverlappingEvents, getEventPosition } from '@/lib/calendarUtils';
import { useOptimizedEventInteraction } from '@/hooks/useOptimizedEventInteraction';
import { usePendingEventChanges } from '@/hooks/usePendingEventChanges';
import { useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { useAvailability } from '@/hooks/useAvailability';
import { useUserTimezone } from '@/hooks/useUserTimezone';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { toTimeZone, getCurrentTimeInZone, createDateTimeInZone, toISOStringWithOffset } from '@/lib/timezoneUtils';
interface WeekViewProps {
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
  onMonthViewClick?: () => void;
}
export const WeekView = ({
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
  onEventSave,
  onMonthViewClick
}: WeekViewProps) => {
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

  // Get week boundaries
  const weekStart = startOfWeek(date, {
    locale: sv,
    weekStartsOn: 1
  });
  const weekEnd = endOfWeek(date, {
    locale: sv,
    weekStartsOn: 1
  });
  const daysInWeek = eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });

  // Calculate visible hour range based on availability slots
  const {
    startHour,
    endHour
  } = useMemo(() => {
    if (slots.length === 0) {
      return {
        startHour: 0,
        endHour: 23
      };
    }
    const times = slots.flatMap(slot => [parseInt(slot.start_time.split(':')[0]), parseInt(slot.end_time.split(':')[0])]);
    const earliest = Math.max(0, Math.min(...times) - 1);
    const latest = Math.min(23, Math.max(...times) + 1);
    return {
      startHour: earliest,
      endHour: latest
    };
  }, [slots]);
  const visibleHours = useMemo(() => Array.from({
    length: endHour - startHour + 1
  }, (_, i) => startHour + i), [startHour, endHour]);

  // Check if time is available for a specific day
  const isAvailableAt = (dayIndex: number, hour: number) => {
    const daySlots = slots.filter(slot => slot.day_of_week === dayIndex && slot.is_active);
    const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
    return daySlots.some(slot => timeString >= slot.start_time && timeString < slot.end_time);
  };

  // Apply pending changes to events for display with memoization
  const eventsWithPendingChanges = useMemo(() => events.map(getEventWithPendingChanges), [events, getEventWithPendingChanges]);

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
      const savePromises = Array.from(pendingChanges.entries()).map(([eventId, updates]) => onEventUpdate(eventId, updates));
      await Promise.all(savePromises);
      clearPendingChanges();
      toast.success('Ändringar sparade');
    } catch (error) {
      toast.error('Kunde inte spara ändringar');
    }
  };
  const handleTimeSlotClick = async (time: Date, dayDate: Date) => {
    // Create UTC instant for this local time
    const dateTime = createDateTimeInZone(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
      time.getHours(),
      time.getMinutes(),
      timezone
    );
    await onCreate(dateTime);
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
      } = getEventPosition(toISOStringWithOffset(dragState.previewPosition.start, timezone), toISOStringWithOffset(dragState.previewPosition.end, timezone), 0, timezone);
      return top;
    }
    return undefined;
  }, [dragState.previewPosition, timezone]);

  // Get events for a specific day with layout
  const getEventsForDay = (day: Date) => {
    const dayLocalDate = toTimeZone(day, timezone);
    const dayEvents = eventsWithPendingChanges.filter(e => {
      // Parse TEXT with offset: "2025-10-26T08:00:00+01:00"
      const eventStartDate = new Date(e.start_time);
      const eventStart = toTimeZone(eventStartDate, timezone);
      return isSameDay(eventStart, dayLocalDate);
    });
    return layoutOverlappingEvents(dayEvents, timezone);
  };
  return <div className="flex h-full gap-4">
      {/* Main calendar area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBackToMonth}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Tillbaka till månad
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onDateChange(subDays(weekStart, 7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-lg font-semibold min-w-[300px] text-center">
              Vecka {format(weekStart, 'w, yyyy', {
              locale: sv
            })}
              <span className="text-sm text-muted-foreground ml-2">
                {format(weekStart, 'd MMM', {
                locale: sv
              })} - {format(weekEnd, 'd MMM', {
                locale: sv
              })}
              </span>
            </div>
            
            <Button variant="outline" size="icon" onClick={() => onDateChange(addDays(weekStart, 7))}>
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

      {/* Week view grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Day headers */}
          <div className="sticky top-0 z-20 bg-background border-b flex">
            {/* Time column header spacer */}
            <div className="w-16 flex-shrink-0 border-r"></div>
            
            {/* Day headers */}
            {daysInWeek.map(day => {
              const dayInTz = toTimeZone(day, timezone);
              const todayInTz = getCurrentTimeInZone(timezone);
              const isToday = isSameDay(dayInTz, todayInTz);
              
              return <div key={day.toISOString()} className={`flex-1 p-2 text-center border-r ${isToday ? 'bg-primary/10' : ''}`}>
                <div className="text-xs text-muted-foreground">
                  {format(day, 'EEE', {
                locale: sv
              })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd', {
                locale: sv
              })}
                </div>
              </div>;
            })}
          </div>

          {/* Time grid and events */}
          <div className="flex">
            {/* Time labels column */}
            <div className="w-16 flex-shrink-0 relative">
              {visibleHours.map(hour => <div key={hour} className="relative h-[80px] border-b border-r border-border">
                  <div className="absolute -top-2 right-2 text-xs text-muted-foreground font-medium">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                </div>)}
            </div>

            {/* Days grid */}
            <div className="flex flex-1" ref={containerRef}>
              {daysInWeek.map((day, dayIndex) => <div key={day.toISOString()} className="flex-1 relative border-r" data-day-index={dayIndex} data-day-date={day.toISOString()} onDragOver={handleDragOver} onDrop={handleDrop}>
                  {/* Hourly grid lines */}
                  {visibleHours.map(hour => <div key={hour} className={`relative h-[80px] border-b border-border transition-all cursor-pointer group ${isAvailableAt(dayIndex, hour) ? 'bg-emerald-500/10' : 'hover:bg-accent/30'}`} onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const relativeY = e.clientY - rect.top;
                const minutes = Math.floor(relativeY / 80 * 60);
                const snappedMinutes = Math.round(minutes / 15) * 15;
                const clickedTime = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, snappedMinutes);
                handleTimeSlotClick(clickedTime, day);
              }}>
                      {/* 15-minute gridlines */}
                      {[1, 2, 3].map(quarter => <div key={quarter} className="absolute left-0 right-0 border-t border-dashed border-border/30" style={{
                  top: `${quarter * 20}px`
                }} />)}
                    </div>)}
                  
                   {/* Current time indicator - only for today */}
                  {(() => {
                    const dayInTz = toTimeZone(day, timezone);
                    const todayInTz = getCurrentTimeInZone(timezone);
                    return isSameDay(dayInTz, todayInTz) ? <CurrentTimeIndicator displayDate={day} viewStartHour={startHour} /> : null;
                  })()}

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

                  {/* Events for this day */}
                  <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                    <div className="relative h-full pointer-events-auto">
                      {getEventsForDay(day).map(event => <EventBlock key={event.id} event={event} column={event.column} totalColumns={event.totalColumns} onEventClick={onEventClick} onDragStart={handleDragStart} onResizeStart={handleResizeStart} isResizing={dragState.activeEventId === event.id && dragState.operation !== 'drag'} viewStartHour={startHour} />)}
                      
                      {/* Ghost preview during drag */}
                      {dragState.operation === 'drag' && dragState.previewPosition && dragState.activeEventId && isSameDay(dragState.previewPosition.start, day) && <EventDragPreview start={dragState.previewPosition.start} end={dragState.previewPosition.end} title={events.find(e => e.id === dragState.activeEventId)?.title || ''} snapIndicatorY={snapIndicatorY} />}
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>

        {/* Event Modal with pending changes support */}
        {showEventModal && <EventModal open={showEventModal} onClose={onCloseModal} event={selectedEvent} onSave={onEventSave} onDelete={onDelete} pendingChanges={selectedEvent ? pendingChanges.get(selectedEvent.id) : undefined} />}
      </div>

      {/* Mini Calendar Panel - Desktop Only */}
      <div className="hidden lg:block w-[280px] flex-shrink-0">
        <div className="sticky top-4 mt-4">
          <MiniCalendarPanel
            selectedDate={date}
            events={events}
            onMonthViewClick={() => onMonthViewClick?.()}
            onDateSelect={onDateChange}
            onEventClick={onEventClick}
          />
        </div>
      </div>
    </div>;
};