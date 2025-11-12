import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

export interface NotificationFilterValues {
  search: string;
  type: string;
  priority: string;
  status: string;
  channel: string;
  readStatus: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface NotificationFiltersProps {
  onFilterChange: (filters: NotificationFilterValues) => void;
}

export function NotificationFilters({ onFilterChange }: NotificationFiltersProps) {
  const [filters, setFilters] = useState<NotificationFilterValues>({
    search: '',
    type: 'all',
    priority: 'all',
    status: 'all',
    channel: 'all',
    readStatus: 'all',
  });

  const handleFilterChange = (key: keyof NotificationFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: NotificationFilterValues = {
      search: '',
      type: 'all',
      priority: 'all',
      status: 'all',
      channel: 'all',
      readStatus: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border border-primary/10 bg-card/50 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtrera notifikationer</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Rensa filter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Sök</Label>
          <Input
            id="search"
            placeholder="Sök i notifikationer..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label>Typ</Label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla typer</SelectItem>
              <SelectItem value="booking">Bokning</SelectItem>
              <SelectItem value="review">Recension</SelectItem>
              <SelectItem value="message_failed">Meddelandefel</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="other">Övrigt</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>Prioritet</Label>
          <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="high">Hög</SelectItem>
              <SelectItem value="medium">Medel</SelectItem>
              <SelectItem value="low">Låg</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="pending">Väntande</SelectItem>
              <SelectItem value="sent">Skickad</SelectItem>
              <SelectItem value="failed">Misslyckad</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Channel */}
        <div className="space-y-2">
          <Label>Kanal</Label>
          <Select value={filters.channel} onValueChange={(value) => handleFilterChange('channel', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla kanaler</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Read Status */}
        <div className="space-y-2">
          <Label>Läst status</Label>
          <Select value={filters.readStatus} onValueChange={(value) => handleFilterChange('readStatus', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="read">Läst</SelectItem>
              <SelectItem value="unread">Oläst</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label>Från datum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, 'PP', { locale: sv }) : 'Välj datum'}
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
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label>Till datum</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, 'PP', { locale: sv }) : 'Välj datum'}
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
      </div>
    </div>
  );
}
