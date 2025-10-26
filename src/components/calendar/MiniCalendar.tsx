import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { isSameDay, parseISO } from 'date-fns';
import { memo } from 'react';

interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events: CalendarEvent[];
}

const MiniCalendarComponent = ({ selectedDate, onDateSelect, events }: MiniCalendarProps) => {
  // Get dates that have events
  const eventDates = events.map(e => parseISO(e.start_time));
  
  // Check if a date has events
  const hasEvents = (date: Date) => {
    return eventDates.some(eventDate => isSameDay(eventDate, date));
  };

  return (
    <Card className="p-3">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        className="rounded-md"
        modifiers={{
          hasEvents: (date) => hasEvents(date)
        }}
        modifiersStyles={{
          hasEvents: {
            fontWeight: 'bold',
            textDecoration: 'underline',
            textDecorationColor: 'hsl(var(--primary))',
            textDecorationThickness: '2px',
            textUnderlineOffset: '4px'
          }
        }}
      />
    </Card>
  );
};

export const MiniCalendar = memo(MiniCalendarComponent);
