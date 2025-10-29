import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface EventFilterValues {
  search: string;
  provider: string;
  eventType: string;
  direction: string;
  status: string;
  callStatus?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface EventFiltersProps {
  onFilterChange: (filters: EventFilterValues) => void;
  providers: Array<{ provider: string }>;
}

export const EventFilters = ({ onFilterChange, providers }: EventFiltersProps) => {
  const [filters, setFilters] = useState<EventFilterValues>({
    search: '',
    provider: 'all',
    eventType: 'all',
    direction: 'all',
    status: 'all',
    callStatus: 'all',
  });

  const handleFilterChange = (key: keyof EventFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: EventFilterValues = {
      search: '',
      provider: 'all',
      eventType: 'all',
      direction: 'all',
      status: 'all',
      callStatus: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const uniqueProviders = Array.from(new Set(providers.map(p => p.provider)));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Sök telefonnummer eller event ID..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-xs"
        />

        <Select value={filters.provider} onValueChange={(v) => handleFilterChange('provider', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla providers</SelectItem>
            {uniqueProviders.map((provider) => (
              <SelectItem key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.eventType} onValueChange={(v) => handleFilterChange('eventType', v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla typer</SelectItem>
            <SelectItem value="call">Samtal</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="transcript">Transkript</SelectItem>
            <SelectItem value="recording">Inspelning</SelectItem>
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

        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla status</SelectItem>
            <SelectItem value="completed">Klar</SelectItem>
            <SelectItem value="failed">Misslyckad</SelectItem>
            <SelectItem value="pending">Pågående</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.callStatus || 'all'} onValueChange={(v) => handleFilterChange('callStatus', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Samtalsstatus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla samtal</SelectItem>
            <SelectItem value="in-progress">Pågående</SelectItem>
            <SelectItem value="completed">Avslutade</SelectItem>
          </SelectContent>
        </Select>

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
