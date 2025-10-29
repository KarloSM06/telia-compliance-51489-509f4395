import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessageFiltersProps {
  type: 'sms' | 'email';
  onFilterChange: (filters: { status: string; dateFrom?: string; dateTo?: string }) => void;
}

export const MessageFilters = ({ type, onFilterChange }: MessageFiltersProps) => {
  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange({
      status: newFilters.status,
      dateFrom: newFilters.dateFrom || undefined,
      dateTo: newFilters.dateTo || undefined,
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full sm:w-auto">
        <Select defaultValue="all" onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla status</SelectItem>
            <SelectItem value="delivered">Levererad</SelectItem>
            <SelectItem value="sent">Skickad</SelectItem>
            <SelectItem value="failed">Misslyckad</SelectItem>
            {type === 'email' && <SelectItem value="bounced">Studsad</SelectItem>}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto space-y-2">
        <Label htmlFor="dateFrom" className="text-sm">Från datum</Label>
        <Input
          id="dateFrom"
          type="date"
          className="w-full sm:w-[180px]"
          value={localFilters.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        />
      </div>

      <div className="w-full sm:w-auto space-y-2">
        <Label htmlFor="dateTo" className="text-sm">Till datum</Label>
        <Input
          id="dateTo"
          type="date"
          className="w-full sm:w-[180px]"
          value={localFilters.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        />
      </div>
    </div>
  );
};
