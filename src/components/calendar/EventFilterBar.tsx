import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

export interface EventFilters {
  search: string;
  sources: string[];
  eventTypes: string[];
  syncStates: string[];
}

interface EventFilterBarProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  availableSources: string[];
  availableEventTypes: string[];
}

export const EventFilterBar = ({
  filters,
  onFiltersChange,
  availableSources,
  availableEventTypes,
}: EventFilterBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search);

  const syncStateOptions = [
    { value: 'synced', label: 'Synkad' },
    { value: 'pending', label: 'Väntar' },
    { value: 'conflict', label: 'Konflikt' },
    { value: 'failed', label: 'Misslyckad' },
  ];

  const sourceLabels: Record<string, string> = {
    internal: 'Intern',
    simplybook: 'SimplyBook',
    google_calendar: 'Google Calendar',
    bookeo: 'Bookeo',
  };

  const typeLabels: Record<string, string> = {
    meeting: 'Möte',
    call: 'Samtal',
    booking: 'Bokning',
    reminder: 'Påminnelse',
    demo: 'Demo',
    follow_up: 'Uppföljning',
    work: 'Arbete',
    personal: 'Personlig',
    leisure: 'Fritid',
    other: 'Övrigt',
  };

  const toggleSource = (source: string) => {
    const newSources = filters.sources.includes(source)
      ? filters.sources.filter(s => s !== source)
      : [...filters.sources, source];
    onFiltersChange({ ...filters, sources: newSources });
  };

  const toggleEventType = (type: string) => {
    const newTypes = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter(t => t !== type)
      : [...filters.eventTypes, type];
    onFiltersChange({ ...filters, eventTypes: newTypes });
  };

  const toggleSyncState = (state: string) => {
    const newStates = filters.syncStates.includes(state)
      ? filters.syncStates.filter(s => s !== state)
      : [...filters.syncStates, state];
    onFiltersChange({ ...filters, syncStates: newStates });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFiltersChange({ ...filters, search: value });
  };

  const clearFilters = () => {
    setSearchInput('');
    onFiltersChange({
      search: '',
      sources: [],
      eventTypes: [],
      syncStates: [],
    });
  };

  const activeFiltersCount =
    filters.sources.length + filters.eventTypes.length + filters.syncStates.length;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Sök händelser..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Source Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Källa
              {filters.sources.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {filters.sources.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrera efter källa</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableSources.map((source) => (
              <DropdownMenuCheckboxItem
                key={source}
                checked={filters.sources.includes(source)}
                onCheckedChange={() => toggleSource(source)}
              >
                {sourceLabels[source] || source}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Event Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Typ
              {filters.eventTypes.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {filters.eventTypes.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrera efter typ</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableEventTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={filters.eventTypes.includes(type)}
                onCheckedChange={() => toggleEventType(type)}
              >
                {typeLabels[type] || type}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sync State Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default">
              <Filter className="h-4 w-4 mr-2" />
              Status
              {filters.syncStates.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {filters.syncStates.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filtrera efter sync-status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {syncStateOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.syncStates.includes(option.value)}
                onCheckedChange={() => toggleSyncState(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active Filter Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.sources.map((source) => (
            <Badge key={source} variant="secondary" className="gap-1">
              {sourceLabels[source] || source}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSource(source)}
              />
            </Badge>
          ))}
          {filters.eventTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {typeLabels[type] || type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleEventType(type)}
              />
            </Badge>
          ))}
          {filters.syncStates.map((state) => (
            <Badge key={state} variant="secondary" className="gap-1">
              {syncStateOptions.find(o => o.value === state)?.label || state}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleSyncState(state)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
