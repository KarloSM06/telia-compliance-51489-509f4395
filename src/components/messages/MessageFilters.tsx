import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MessageFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const MessageFilters = ({ onFilterChange }: MessageFiltersProps) => {
  const [localFilters, setLocalFilters] = useState({
    status: 'all',
    channel: 'all',
    messageType: 'all',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
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
            <SelectItem value="pending">Väntande</SelectItem>
            <SelectItem value="sent">Skickade</SelectItem>
            <SelectItem value="failed">Misslyckade</SelectItem>
            <SelectItem value="cancelled">Avbrutna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select defaultValue="all" onValueChange={(value) => handleFilterChange('channel', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Kanal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla kanaler</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="both">Både SMS & Email</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select defaultValue="all" onValueChange={(value) => handleFilterChange('messageType', value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Typ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla typer</SelectItem>
            <SelectItem value="booking_confirmation">Bekräftelse</SelectItem>
            <SelectItem value="reminder">Påminnelse</SelectItem>
            <SelectItem value="review_request">Recensionsförfrågan</SelectItem>
            <SelectItem value="cancellation">Avbokning</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
