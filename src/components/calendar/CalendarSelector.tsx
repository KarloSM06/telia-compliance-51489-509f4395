import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/hooks/useCalendars";

interface CalendarSelectorProps {
  calendars: Calendar[];
  selectedCalendarId: string | 'all';
  onSelect: (calendarId: string | 'all') => void;
}

export const CalendarSelector = ({ calendars, selectedCalendarId, onSelect }: CalendarSelectorProps) => {
  return (
    <Select value={selectedCalendarId} onValueChange={onSelect}>
      <SelectTrigger className="w-[200px]">
        <CalendarIcon className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Välj kalender" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            Alla kalendrar
          </div>
        </SelectItem>
        {calendars.map(calendar => (
          <SelectItem key={calendar.id} value={calendar.id}>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: calendar.color }}
              />
              {calendar.name}
              {calendar.is_default && <span className="text-xs text-muted-foreground">(Standard)</span>}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
