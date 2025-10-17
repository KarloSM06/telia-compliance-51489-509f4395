import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { TimeGrid } from './TimeGrid';
import { EventBlock } from './EventBlock';
import { CurrentTimeIndicator } from './CurrentTimeIndicator';
import { layoutOverlappingEvents } from '@/lib/calendarUtils';
import { useEventDrag } from '@/hooks/useEventDrag';
import { useRef } from 'react';
import { addMinutes } from 'date-fns';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => Promise<CalendarEvent | undefined>;
  onBackToMonth: () => void;
  onCreate: (startTime: Date) => void;
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
  const { handleDragStart, handleDrop, handleDragEnd } = useEventDrag(onEventUpdate);
  
  const layoutedEvents = layoutOverlappingEvents(events);

  const handleTimeSlotClick = (time: Date) => {
    onCreate(time);
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
              {format(date, 'EEEE, d MMMM yyyy', { locale: require('date-fns/locale/sv') })}
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

        <Button onClick={() => onCreate(new Date())}>
          Ny händelse
        </Button>
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
            <CurrentTimeIndicator />

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
                    onEventUpdate={onEventUpdate}
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
