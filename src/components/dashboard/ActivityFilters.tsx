import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface ActivityFilterValues {
  search: string;
  type: string;
  status: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ActivityFiltersProps {
  onFilterChange: (filters: ActivityFilterValues) => void;
}

export const ActivityFilters = ({ onFilterChange }: ActivityFiltersProps) => {
  const [filters, setFilters] = useState<ActivityFilterValues>({
    search: '',
    type: 'all',
    status: 'all',
  });

  const handleFilterChange = (key: keyof ActivityFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ActivityFilterValues = {
      search: '',
      type: 'all',
      status: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Sök händelser..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-xs"
        />

        <Select value={filters.type} onValueChange={(v) => handleFilterChange('type', v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla typer</SelectItem>
            <SelectItem value="telephony">Telefoni</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="booking">Bokningar</SelectItem>
            <SelectItem value="review">Reviews</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla status</SelectItem>
            <SelectItem value="completed">Klar</SelectItem>
            <SelectItem value="pending">Pågående</SelectItem>
            <SelectItem value="failed">Misslyckad</SelectItem>
            <SelectItem value="positive">Positiv</SelectItem>
            <SelectItem value="negative">Negativ</SelectItem>
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
