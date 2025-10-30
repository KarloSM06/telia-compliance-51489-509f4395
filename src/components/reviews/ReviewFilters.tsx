import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface ReviewFilterValues {
  search: string;
  rating: string;
  sentiment: string;
  source: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ReviewFiltersProps {
  onFilterChange: (filters: ReviewFilterValues) => void;
}

export const ReviewFilters = ({ onFilterChange }: ReviewFiltersProps) => {
  const [filters, setFilters] = useState<ReviewFilterValues>({
    search: '',
    rating: 'all',
    sentiment: 'all',
    source: 'all',
  });

  const handleFilterChange = (key: keyof ReviewFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ReviewFilterValues = {
      search: '',
      rating: 'all',
      sentiment: 'all',
      source: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Sök på kund, email eller kommentar..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="max-w-xs"
        />

        <Select value={filters.rating} onValueChange={(v) => handleFilterChange('rating', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Betyg" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla betyg</SelectItem>
            <SelectItem value="5">⭐⭐⭐⭐⭐</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐</SelectItem>
            <SelectItem value="3">⭐⭐⭐</SelectItem>
            <SelectItem value="2">⭐⭐</SelectItem>
            <SelectItem value="1">⭐</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sentiment} onValueChange={(v) => handleFilterChange('sentiment', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla</SelectItem>
            <SelectItem value="positive">Positiv</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negativ</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.source} onValueChange={(v) => handleFilterChange('source', v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Källa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla källor</SelectItem>
            <SelectItem value="calendar">Kalender</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="telephony">Telefoni</SelectItem>
            <SelectItem value="manual">Manuell</SelectItem>
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