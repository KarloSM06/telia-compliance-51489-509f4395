import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface UserFiltersProps {
  onFilterChange: (filters: { search: string; role: string; permissions: string }) => void;
  filters: { search: string; role: string; permissions: string };
}

export function UserFilters({ onFilterChange, filters }: UserFiltersProps) {
  return (
    <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök efter email..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-9 border-primary/20"
            />
          </div>
          
          <Select value={filters.role} onValueChange={(value) => onFilterChange({ ...filters, role: value })}>
            <SelectTrigger className="w-[180px] border-primary/20">
              <SelectValue placeholder="Filtrera roll" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla roller</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="client">Klient</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.permissions} onValueChange={(value) => onFilterChange({ ...filters, permissions: value })}>
            <SelectTrigger className="w-[200px] border-primary/20">
              <SelectValue placeholder="Rättigheter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alla</SelectItem>
              <SelectItem value="custom">Anpassade</SelectItem>
              <SelectItem value="default">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
