import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface RequestFiltersProps {
  filters: {
    search: string;
    type: string;
    status: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (filters: any) => void;
}

export function RequestFilters({ filters, onFilterChange }: RequestFiltersProps) {
  return (
    <Card className="p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Sök</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Namn, email, telefon..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Typ</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange({ ...filters, type: value })}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="booking">Bokningar</SelectItem>
              <SelectItem value="ai_consultation">AI-konsultationer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="pending">Väntande</SelectItem>
              <SelectItem value="contacted">Kontaktad</SelectItem>
              <SelectItem value="closed">Stängd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom">Från datum</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
