import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface EmailFilterValues {
  search: string;
  status: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface EmailFiltersProps {
  onFilterChange: (filters: EmailFilterValues) => void;
}

export const EmailFilters = ({ onFilterChange }: EmailFiltersProps) => {
  const [filters, setFilters] = useState<EmailFilterValues>({
    search: '',
    status: 'all',
  });

  const handleFilterChange = (key: keyof EmailFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: EmailFilterValues = {
      search: '',
      status: 'all',
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          placeholder="Sök email eller mottagare..."
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
            <SelectItem value="failed">Misslyckad</SelectItem>
            <SelectItem value="bounced">Studsad</SelectItem>
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
