import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date;
  to: Date;
};

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
}

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);

  const presets = [
    {
      label: "Idag",
      getValue: () => {
        const today = new Date();
        return { from: today, to: today };
      },
    },
    {
      label: "Senaste 7 dagarna",
      getValue: () => {
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { from: weekAgo, to: today };
      },
    },
    {
      label: "Senaste 30 dagarna",
      getValue: () => {
        const today = new Date();
        const monthAgo = new Date(today);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { from: monthAgo, to: today };
      },
    },
    {
      label: "Senaste 90 dagarna",
      getValue: () => {
        const today = new Date();
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
        return { from: threeMonthsAgo, to: today };
      },
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          size="sm"
          onClick={() => {
            onChange(preset.getValue());
          }}
        >
          {preset.label}
        </Button>
      ))}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("justify-start text-left font-normal")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "d LLL", { locale: sv })} -{" "}
                  {format(value.to, "d LLL, y", { locale: sv })}
                </>
              ) : (
                format(value.from, "d LLL, y", { locale: sv })
              )
            ) : (
              <span>Välj datum</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={{ from: value?.from, to: value?.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onChange({ from: range.from, to: range.to });
                setOpen(false);
              }
            }}
            numberOfMonths={2}
            locale={sv}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
