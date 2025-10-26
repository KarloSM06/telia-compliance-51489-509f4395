import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export const CalendarView = ({ events, onEventClick, onDateClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const weekDays = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

  return (
    <div className="space-y-2">
      {/* Kompakt Navigation */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold">
          {format(currentDate, 'MMMM yyyy', { locale: sv })}
        </h2>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Idag
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Kompakt Månadsvy - Ingen Card wrapper */}
      <div className="border rounded-lg">
        <div className="grid grid-cols-7 gap-px bg-border">
          {weekDays.map(day => (
            <div key={day} className="text-center font-semibold text-[10px] text-muted-foreground p-1.5 bg-card">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={index}
                onClick={() => onDateClick(day)}
                className={cn(
                  "min-h-16 p-1 bg-card cursor-pointer transition-colors hover:bg-accent",
                  !isCurrentMonth && "bg-muted/50 text-muted-foreground",
                  isToday && "ring-2 ring-primary ring-inset"
                )}
              >
                <div className={cn(
                  "text-[11px] font-medium mb-0.5",
                  isToday && "text-primary font-bold"
                )}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={cn(
                        "text-[9px] px-1 py-0.5 rounded truncate cursor-pointer",
                        event.source === 'internal' && "bg-event-internal/20 text-event-internal",
                        event.source === 'simplybook' && "bg-event-simplybook/20 text-event-simplybook",
                        event.source === 'google_calendar' && "bg-event-google/20 text-event-google",
                        event.source === 'bookeo' && "bg-event-bookeo/20 text-event-bookeo"
                      )}
                      title={event.title}
                    >
                      {format(parseISO(event.start_time), 'HH:mm')} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-muted-foreground px-1">
                      +{dayEvents.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
