import { useState, useMemo } from "react";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { TimelineEventBlock } from "./TimelineEventBlock";
import { EventModal } from "./EventModal";
import { 
  format, 
  startOfWeek, 
  addWeeks, 
  eachDayOfInterval,
  isSameDay,
  isWeekend,
  parseISO,
  startOfDay,
  endOfDay,
  differenceInDays,
} from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimelineViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventSave: (event: Partial<CalendarEvent>) => Promise<void>;
  onEventDelete: (eventId: string) => Promise<void>;
}

export const TimelineView = ({
  events,
  onEventClick,
  onEventSave,
  onEventDelete,
}: TimelineViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeksToShow, setWeeksToShow] = useState(4);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);

  // Calculate timeline range
  const timelineStart = startOfWeek(currentDate, { locale: sv });
  const timelineEnd = addWeeks(timelineStart, weeksToShow);
  
  const days = useMemo(() => 
    eachDayOfInterval({ start: timelineStart, end: timelineEnd }),
    [timelineStart, timelineEnd]
  );

  // Position events on timeline
  const positionedEvents = useMemo(() => {
    return events.map(event => {
      const eventStart = startOfDay(parseISO(event.start_time));
      const eventEnd = startOfDay(parseISO(event.end_time));
      
      // Find column position
      const columnStart = days.findIndex(day => isSameDay(day, eventStart)) + 2; // +2 for resource column
      const columnSpan = Math.max(1, differenceInDays(eventEnd, eventStart) + 1);
      
      return {
        event,
        columnStart,
        columnSpan,
        visible: columnStart > 1 && columnStart <= days.length + 1,
      };
    }).filter(pe => pe.visible);
  }, [events, days]);

  const handlePrevious = () => {
    setCurrentDate(prev => addWeeks(prev, -weeksToShow));
  };

  const handleNext = () => {
    setCurrentDate(prev => addWeeks(prev, weeksToShow));
  };

  const handleZoomIn = () => {
    if (weeksToShow > 1) setWeeksToShow(prev => prev - 1);
  };

  const handleZoomOut = () => {
    if (weeksToShow < 12) setWeeksToShow(prev => prev + 1);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    onEventClick(event);
  };

  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold ml-4">
            {format(timelineStart, 'MMMM yyyy', { locale: sv })} - {format(timelineEnd, 'MMMM yyyy', { locale: sv })}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">
            {weeksToShow} {weeksToShow === 1 ? 'vecka' : 'veckor'}
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Date Headers */}
          <div 
            className="grid sticky top-0 bg-background z-10 border-b"
            style={{ 
              gridTemplateColumns: `150px repeat(${days.length}, 80px)`,
            }}
          >
            <div className="p-2 font-semibold border-r">Resurs</div>
            {days.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 text-center text-xs border-r",
                  isWeekend(day) && "bg-muted/50",
                  isSameDay(day, new Date()) && "bg-primary/10 font-semibold"
                )}
              >
                <div className="font-semibold">
                  {format(day, 'EEE', { locale: sv })}
                </div>
                <div className="text-muted-foreground">
                  {format(day, 'd MMM', { locale: sv })}
                </div>
              </div>
            ))}
          </div>

          {/* Resource Row */}
          <div
            className="grid relative"
            style={{ 
              gridTemplateColumns: `150px repeat(${days.length}, 80px)`,
              minHeight: '80px',
            }}
          >
            {/* Resource Label */}
            <div className="p-4 border-r border-b font-medium bg-background">
              Min Kalender
            </div>

            {/* Day Cells */}
            {days.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "border-r border-b relative",
                  isWeekend(day) && "bg-muted/30"
                )}
              />
            ))}

            {/* Events */}
            {positionedEvents.map(({ event, columnStart, columnSpan }) => (
              <div
                key={event.id}
                className="absolute"
                style={{
                  gridColumnStart: columnStart,
                  gridColumnEnd: columnStart + columnSpan,
                  width: `${columnSpan * 80}px`,
                  left: `${(columnStart - 2) * 80 + 150}px`,
                  top: '4px',
                  height: 'calc(100% - 8px)',
                }}
              >
                <TimelineEventBlock
                  event={event}
                  onClick={handleEventClick}
                  onDragStart={handleDragStart}
                  columnStart={1}
                  columnSpan={columnSpan}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          open={isModalOpen}
          onClose={handleModalClose}
          event={selectedEvent}
          onSave={onEventSave}
          onDelete={onEventDelete}
        />
      )}
    </div>
  );
};
