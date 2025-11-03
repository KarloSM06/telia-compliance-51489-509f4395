import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { cn } from '@/lib/utils';

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
  const [showFilters, setShowFilters] = useState(false);

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

  // Count active filters
  const activeFilterCount = [
    filters.search !== '',
    filters.provider !== 'all',
    filters.eventType !== 'all',
    filters.direction !== 'all',
    filters.status !== 'all',
    filters.callStatus !== 'all',
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <Collapsible open={showFilters} onOpenChange={setShowFilters}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} aktiva
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Rensa
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? 'Dölj' : 'Visa'} filter
              <ChevronDown className={cn(
                "h-4 w-4 ml-2 transition-transform",
                showFilters && "rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent>
        <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Sök</Label>
                <Input
                  placeholder="Telefonnummer eller event ID..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Provider */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Provider</Label>
                <Select value={filters.provider} onValueChange={(v) => handleFilterChange('provider', v)}>
                  <SelectTrigger>
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
              </div>

              {/* Event Type */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Event Type</Label>
                <Select value={filters.eventType} onValueChange={(v) => handleFilterChange('eventType', v)}>
                  <SelectTrigger>
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
              </div>

              {/* Direction */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Riktning</Label>
                <Select value={filters.direction} onValueChange={(v) => handleFilterChange('direction', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Riktning" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla</SelectItem>
                    <SelectItem value="inbound">Inkommande</SelectItem>
                    <SelectItem value="outbound">Utgående</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla status</SelectItem>
                    <SelectItem value="completed">Klar</SelectItem>
                    <SelectItem value="failed">Misslyckad</SelectItem>
                    <SelectItem value="pending">Pågående</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Call Status */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Samtalsstatus</Label>
                <Select value={filters.callStatus || 'all'} onValueChange={(v) => handleFilterChange('callStatus', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Samtalsstatus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla samtal</SelectItem>
                    <SelectItem value="in-progress">Pågående</SelectItem>
                    <SelectItem value="completed">Avslutade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Från datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? (
                        format(filters.dateFrom, 'PPP', { locale: sv })
                      ) : (
                        <span>Välj datum</span>
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
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Till datum</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? (
                        format(filters.dateTo, 'PPP', { locale: sv })
                      ) : (
                        <span>Välj datum</span>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
