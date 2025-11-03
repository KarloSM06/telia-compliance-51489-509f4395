import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void;
  providers?: string[];
  showProviderFilter?: boolean;
  showStatusFilter?: boolean;
  showDirectionFilter?: boolean;
}

export const AdvancedFilters = ({
  onFilterChange,
  providers = [],
  showProviderFilter = true,
  showStatusFilter = true,
  showDirectionFilter = true,
}: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({ from: undefined, to: undefined });
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [selectedDirection, setSelectedDirection] = useState<string>();

  const applyFilters = () => {
    onFilterChange({
      dateRange,
      provider: selectedProvider,
      status: selectedStatus,
      direction: selectedDirection,
    });
  };

  const clearFilters = () => {
    setDateRange({});
    setSelectedProvider(undefined);
    setSelectedStatus(undefined);
    setSelectedDirection(undefined);
    onFilterChange({});
  };

  const activeFiltersCount = [
    dateRange.from && dateRange.to,
    selectedProvider,
    selectedStatus,
    selectedDirection,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Rensa filter
          </Button>
        )}
      </div>

      {isOpen && (
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
            {/* Date range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Datumintervall</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.to ? (
                      `${format(dateRange.from, "d MMM", { locale: sv })} - ${format(dateRange.to, "d MMM", { locale: sv })}`
                    ) : (
                      "Välj datum"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                    onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                    locale={sv}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Provider filter */}
            {showProviderFilter && providers.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider</label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alla providers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla providers</SelectItem>
                    {providers.map(provider => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status filter */}
            {showStatusFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alla statusar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla statusar</SelectItem>
                    <SelectItem value="sent">Skickad</SelectItem>
                    <SelectItem value="delivered">Levererad</SelectItem>
                    <SelectItem value="failed">Misslyckad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Direction filter */}
            {showDirectionFilter && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Riktning</label>
                <Select value={selectedDirection} onValueChange={setSelectedDirection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alla riktningar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alla riktningar</SelectItem>
                    <SelectItem value="inbound">Inkommande</SelectItem>
                    <SelectItem value="outbound">Utgående</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Apply button */}
            <div className="flex items-end">
              <Button onClick={applyFilters} className="w-full">
                Tillämpa filter
              </Button>
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  );
};
