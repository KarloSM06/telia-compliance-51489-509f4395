import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { format, startOfYear, endOfYear, eachMonthOfInterval, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO, isToday } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface YearViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

export const YearView = ({ date, events, onEventClick, onDateChange, onDayClick }: YearViewProps) => {
  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const getEventsForDay = (day: Date) => {
    // Parse TEXT with offset: "2025-10-26T08:00:00+01:00"
    return events.filter(event => isSameDay(new Date(event.start_time), day));
  };

  const getEventsForMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return events.filter(event => {
      // Parse TEXT with offset: "2025-10-26T08:00:00+01:00"
      const eventDate = new Date(event.start_time);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  };

  const renderMonthGrid = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Pad with days from previous/next month to fill grid
    const firstDayOfWeek = monthStart.getDay();
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const paddedDays = Array(startPadding).fill(null).concat(days);
    const weeks = [];
    for (let i = 0; i < paddedDays.length; i += 7) {
      weeks.push(paddedDays.slice(i, i + 7));
    }

    return (
      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Må', 'Ti', 'On', 'To', 'Fr', 'Lö', 'Sö'].map(day => (
            <div key={day} className="text-[10px] font-medium text-muted-foreground text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIdx) => {
                if (!day) return <div key={dayIdx} className="aspect-square" />;
                
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const isCurrentDay = isToday(day);
                const isCurrentMonth = isSameMonth(day, month);

                return (
                  <button
                    key={dayIdx}
                    onClick={() => onDayClick(day)}
                    className={`
                      aspect-square text-[10px] rounded transition-all hover:bg-accent/50
                      ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                      ${isCurrentDay ? 'bg-primary text-primary-foreground font-bold hover:bg-primary/90' : ''}
                      ${hasEvents && !isCurrentDay ? 'font-semibold' : ''}
                    `}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <span>{format(day, 'd')}</span>
                      {hasEvents && !isCurrentDay && (
                        <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDateChange(new Date(date.getFullYear() - 1, 0, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-xl font-bold min-w-[120px] text-center">
              {format(date, 'yyyy', { locale: sv })}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => onDateChange(new Date(date.getFullYear() + 1, 0, 1))}
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

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {events.length} händelser detta år
          </span>
        </div>
      </div>

      {/* Year grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map((month) => {
            const monthEvents = getEventsForMonth(month);
            return (
              <div key={month.toISOString()} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">
                    {format(month, 'MMMM', { locale: sv })}
                  </h3>
                  {monthEvents.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] h-5">
                      {monthEvents.length}
                    </Badge>
                  )}
                </div>
                {renderMonthGrid(month)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
