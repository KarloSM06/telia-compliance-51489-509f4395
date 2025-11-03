import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export interface ActivityFilterValues {
  search: string;
  model: string;
  apiKey: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface ActivityFiltersProps {
  onFilterChange: (filters: ActivityFilterValues) => void;
  models: string[];
  apiKeys: Array<{ hash: string; name?: string; label?: string }>;
}

export const ActivityFilters = ({ onFilterChange, models, apiKeys }: ActivityFiltersProps) => {
  const [filters, setFilters] = useState<ActivityFilterValues>({
    search: '',
    model: 'all',
    apiKey: 'all',
  });

  const handleFilterChange = (key: keyof ActivityFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ActivityFilterValues = {
      search: '',
      model: 'all',
      apiKey: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.model !== 'all' || 
    filters.apiKey !== 'all' || 
    filters.dateFrom || 
    filters.dateTo;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <Input
          placeholder="Sök model, API key..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full"
        />

        {/* Model Filter */}
        <Select value={filters.model} onValueChange={(value) => handleFilterChange('model', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Alla Modeller" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla Modeller</SelectItem>
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* API Key Filter */}
        <Select value={filters.apiKey} onValueChange={(value) => handleFilterChange('apiKey', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Alla API Keys" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla API Keys</SelectItem>
            {apiKeys.map((key) => (
              <SelectItem key={key.hash} value={key.hash}>
                {key.name || key.label || key.hash.slice(0, 8)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateFrom ? format(filters.dateFrom, 'PPP', { locale: sv }) : 'Från datum'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateFrom}
              onSelect={(date) => handleFilterChange('dateFrom', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateTo ? format(filters.dateTo, 'PPP', { locale: sv }) : 'Till datum'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.dateTo}
              onSelect={(date) => handleFilterChange('dateTo', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Rensa filter
          </Button>
        </div>
      )}
    </div>
  );
};
