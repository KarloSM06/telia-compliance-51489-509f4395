import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format, addDays, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save } from 'lucide-react';
import { TimeGrid } from './TimeGrid';
import { EventBlock } from './EventBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { layoutOverlappingEvents } from '@/lib/calendarUtils';
import { useEventDrag } from '@/hooks/useEventDrag';
import { usePendingEventChanges } from '@/hooks/usePendingEventChanges';
import { useRef } from 'react';
import { addMinutes } from 'date-fns';
import { toast } from 'sonner';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent | undefined>;
  onBackToMonth: () => void;
  onCreate: (startTime: Date) => Promise<void>;
  onDateChange: (date: Date) => void;
}

export const DayView = ({
  date,
  events,
  onEventClick,
  onEventUpdate,
  onBackToMonth,
  onCreate,
  onDateChange,
}: DayViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { 
    pendingChanges, 
    addPendingChange, 
    clearPendingChanges, 
    getEventWithPendingChanges, 
    hasPendingChanges 
  } = usePendingEventChanges();
  
  const { handleDragStart, handleDrop, handleDragEnd } = useEventDrag(addPendingChange);
  
  // Apply pending changes to events for display
  const eventsWithPendingChanges = events.map(getEventWithPendingChanges);
  const layoutedEvents = layoutOverlappingEvents(eventsWithPendingChanges);

  const handleSaveChanges = async () => {
    try {
      // Save all pending changes
      const savePromises = Array.from(pendingChanges.entries()).map(([eventId, updates]) => 
        onEventUpdate(eventId, updates)
      );
      
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    handleDrop(e, containerRef.current);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBackToMonth}>
            <CalendarIcon className="h-4 w-4 mr-2" />
            Tillbaka till månad
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDateChange(subDays(date, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-lg font-semibold min-w-[200px] text-center">
              {format(date, 'EEEE, d MMMM yyyy', { locale: sv })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDateChange(addDays(date, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateChange(new Date())}
          >
            Idag
          </Button>
        </div>

        <div className="flex gap-2">
          {hasPendingChanges && (
            <Button onClick={handleSaveChanges} variant="default" className="gap-2">
              <Save className="h-4 w-4" />
              Spara ändringar
            </Button>
          )}
          <Button onClick={async () => {
            const now = new Date();
            const roundedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), Math.floor(now.getMinutes() / 15) * 15);
            await onCreate(roundedTime);
          }}>
            Ny händelse
          </Button>
        </div>
      </div>

      {/* Day view grid */}
      <div className="flex-1 overflow-auto">
        <div className="relative pl-16 pr-4">
          <div
            ref={containerRef}
            className="relative"
            onDragOver={handleDragOver}
            onDrop={handleDropEvent}
            onDragEnd={handleDragEnd}
          >
            <TimeGrid onTimeSlotClick={handleTimeSlotClick} />
            
            {/* Current time indicator */}
            <CurrentTimeIndicator displayDate={date} />

            {/* Events */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              <div className="relative h-full pointer-events-auto">
                {layoutedEvents.map((event) => (
                  <EventBlock
                    key={event.id}
                    event={event}
                    column={event.column}
                    totalColumns={event.totalColumns}
                    onEventClick={onEventClick}
                    onPendingChange={addPendingChange}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
