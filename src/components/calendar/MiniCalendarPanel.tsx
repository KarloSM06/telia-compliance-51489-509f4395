import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { UpcomingEventsList } from "./UpcomingEventsList";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { startOfWeek, endOfWeek, parseISO, isSameDay, startOfDay, endOfDay } from "date-fns";
import { sv } from "date-fns/locale";

interface MiniCalendarPanelProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onMonthViewClick: () => void;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  timezone?: string;
}

export const MiniCalendarPanel = ({
  selectedDate,
  events,
  onMonthViewClick,
  onDateSelect,
  onEventClick,
  timezone,
}: MiniCalendarPanelProps) => {
  const weekStart = startOfWeek(selectedDate, { locale: sv });
  const weekEnd = endOfWeek(selectedDate, { locale: sv });

  // Get dates with events
  const datesWithEvents = events.reduce((acc, event) => {
    const eventDate = startOfDay(parseISO(event.start_time));
    const dateKey = eventDate.toISOString();
    acc.add(dateKey);
    return acc;
  }, new Set<string>());

  const isDayWithEvent = (day: Date) => {
    const dayKey = startOfDay(day).toISOString();
    return datesWithEvents.has(dayKey);
  };

  const isInSelectedWeek = (day: Date) => {
    return day >= weekStart && day <= weekEnd;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "p-4 border-2 transition-colors duration-200 cursor-pointer",
              "hover:border-primary"
            )}
            onClick={onMonthViewClick}
          >
            <div className="space-y-4">
              {/* Mini Calendar */}
              <div className="pointer-events-none">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      onDateSelect(date);
                    }
                  }}
                  locale={sv}
                  className="scale-90 -m-2"
                  modifiers={{
                    hasEvent: (day) => isDayWithEvent(day),
                    inWeek: (day) => isInSelectedWeek(day),
                  }}
                  modifiersClassNames={{
                    hasEvent: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
                    inWeek: "bg-accent/50",
                  }}
                />
              </div>

              {/* Upcoming Events */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
                <div onClick={(e) => e.stopPropagation()}>
                  <UpcomingEventsList
                    events={events}
                    onEventClick={onEventClick}
                    maxEvents={5}
                    timezone={timezone}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>Klicka för att visa månadskalender</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
