import { useState, useMemo } from 'react';
import { AvailabilitySlot } from '@/hooks/useAvailability';
import { createDateTimeInZone } from '@/lib/timezoneUtils';
import { useUserTimezone } from '@/hooks/useUserTimezone';

interface TimeGridProps {
  onTimeSlotClick: (time: Date) => void;
  availabilitySlots?: AvailabilitySlot[];
  currentDate?: Date;
}

export const TimeGrid = ({ onTimeSlotClick, availabilitySlots = [], currentDate = new Date() }: TimeGridProps) => {
  const { timezone } = useUserTimezone();
  const [hoveredSlot, setHoveredSlot] = useState<{ hour: number; quarter: number } | null>(null);

  // Get availability slots for current day of week (0 = Monday, 6 = Sunday)
  const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1; // Convert to 0=Mon, 6=Sun
  const daySlots = availabilitySlots.filter(slot => slot.day_of_week === dayOfWeek && slot.is_active);

  // Calculate visible hour range based on availability slots
  const { startHour, endHour } = useMemo(() => {
    if (daySlots.length === 0) {
      // No availability slots - show full day
      return { startHour: 0, endHour: 23 };
    }

    // Find earliest start and latest end from availability slots
    const times = daySlots.flatMap(slot => [
      parseInt(slot.start_time.split(':')[0]),
      parseInt(slot.end_time.split(':')[0])
    ]);

    const earliest = Math.max(0, Math.min(...times) - 1); // Add 1 hour buffer before
    const latest = Math.min(23, Math.max(...times) + 1); // Add 1 hour buffer after

    return { startHour: earliest, endHour: latest };
  }, [daySlots]);

  const hours = useMemo(() => 
    Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i),
    [startHour, endHour]
  );

  const isAvailableAt = (hour: number, minutes: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    return daySlots.some(slot => {
      return timeString >= slot.start_time && timeString < slot.end_time;
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    
    // Calculate minutes within the hour - grid cell is 80px high
    const CELL_HEIGHT = 80;
    const minutes = Math.floor((relativeY / CELL_HEIGHT) * 60);
    const snappedMinutes = Math.round(minutes / 15) * 15;
    
    // Create UTC instant for this local time
    const clickedTime = createDateTimeInZone(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      hour,
      snappedMinutes,
      timezone
    );
    onTimeSlotClick(clickedTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const CELL_HEIGHT = 80;
    const quarter = Math.floor((relativeY / CELL_HEIGHT) * 4); // 0-3 for 15min intervals
    setHoveredSlot({ hour, quarter: Math.min(quarter, 3) });
  };

  return (
    <div className="relative" onMouseLeave={() => setHoveredSlot(null)}>
      {hours.map((hour) => {
        const isHourAvailable = isAvailableAt(hour, 0);
        return (
          <div
            key={hour}
            className={`relative h-[80px] border-b border-border transition-all cursor-pointer group ${
              isHourAvailable ? 'bg-emerald-500/10' : 'hover:bg-accent/30'
            }`}
            onClick={(e) => handleClick(e, hour)}
            onMouseMove={(e) => handleMouseMove(e, hour)}
          >
            {/* Hour label */}
            <div className="absolute -left-14 -top-2 text-xs text-muted-foreground w-12 text-right font-medium">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* 15-minute gridlines with hover effect */}
            {[0, 1, 2, 3].map((quarter) => (
              <div
                key={quarter}
                className={`absolute left-0 right-0 border-t transition-all ${
                  quarter === 0 ? 'top-0 border-border' : ''
                }${quarter === 1 ? 'top-[20px] border-dashed border-border/30' : ''}${
                  quarter === 2 ? 'top-[40px] border-dashed border-border/30' : ''
                }${quarter === 3 ? 'top-[60px] border-dashed border-border/30' : ''}${
                  hoveredSlot?.hour === hour && hoveredSlot?.quarter === quarter
                    ? ' bg-primary/10'
                    : ''
                }`}
                style={{
                  height: quarter === 0 ? '0' : '20px',
                  top: quarter === 0 ? '0' : `${quarter * 20}px`,
                }}
              />
            ))}
            
            {/* Hover time indicator */}
            {hoveredSlot?.hour === hour && (
              <div 
                className="absolute left-2 text-xs font-medium text-primary pointer-events-none bg-background/90 px-2 py-0.5 rounded shadow-sm"
                style={{ top: `${hoveredSlot.quarter * 20}px` }}
              >
                {hour.toString().padStart(2, '0')}:{(hoveredSlot.quarter * 15).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
