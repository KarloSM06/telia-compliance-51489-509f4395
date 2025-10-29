import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MessageFiltersProps {
  onFilterChange: (filters: { direction: string; status: string }) => void;
}

export const MessageFilters = ({ onFilterChange }: MessageFiltersProps) => {
  const [localFilters, setLocalFilters] = useState({
    direction: 'all',
    status: 'all',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full sm:w-auto">
        <Select defaultValue="all" onValueChange={(value) => handleFilterChange('direction', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Riktning" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla riktningar</SelectItem>
            <SelectItem value="inbound">Inkommande</SelectItem>
            <SelectItem value="outbound">Utgående</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            <SelectItem value="undelivered">Ej levererad</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
