import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface SMSFilterValues {
  search: string;
  status: string;
  direction: string;
  messageType?: string;
  messageSource?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface SMSFiltersProps {
  onFilterChange: (filters: SMSFilterValues) => void;
}

export const SMSFilters = ({ onFilterChange }: SMSFiltersProps) => {
  const [filters, setFilters] = useState<SMSFilterValues>({
    search: '',
    status: 'all',
    direction: 'all',
  });

  const handleFilterChange = (key: keyof SMSFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SMSFilterValues = {
      search: '',
      status: 'all',
      direction: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Sök telefonnummer eller meddelande..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-xs"
        />

        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla status</SelectItem>
            <SelectItem value="delivered">Levererad</SelectItem>
            <SelectItem value="sent">Skickad</SelectItem>
            <SelectItem value="pending">Väntande</SelectItem>
            <SelectItem value="failed">Misslyckad</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.direction} onValueChange={(v) => handleFilterChange('direction', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Riktning" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla</SelectItem>
            <SelectItem value="inbound">Inkommande</SelectItem>
            <SelectItem value="outbound">Utgående</SelectItem>
          </SelectContent>
        </Select>

        {filters.direction === 'inbound' && (
          <Select value={filters.messageType || 'all'} onValueChange={(v) => handleFilterChange('messageType', v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Meddelandetyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla typer</SelectItem>
              <SelectItem value="review">Omdömen</SelectItem>
              <SelectItem value="booking_request">Bokningar</SelectItem>
              <SelectItem value="question">Frågor</SelectItem>
              <SelectItem value="general">Generella</SelectItem>
            </SelectContent>
          </Select>
        )}

        {filters.direction === 'outbound' && (
          <Select value={filters.messageSource || 'all'} onValueChange={(v) => handleFilterChange('messageSource', v === 'all' ? undefined : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Källa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla källor</SelectItem>
              <SelectItem value="calendar_notification">Kalender</SelectItem>
              <SelectItem value="ai_agent">AI-Agent</SelectItem>
              <SelectItem value="manual">Manuell</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? (
                format(filters.dateFrom, 'PPP', { locale: sv })
              ) : (
                <span>Från datum</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => handleFilterChange('dateFrom', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[180px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? (
                format(filters.dateTo, 'PPP', { locale: sv })
              ) : (
                <span>Till datum</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => handleFilterChange('dateTo', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Rensa
        </Button>
      </div>
    </div>
  );
};
