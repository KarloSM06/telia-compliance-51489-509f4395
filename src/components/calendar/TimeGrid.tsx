import { format, setHours, setMinutes } from 'date-fns';
import { useState, useMemo } from 'react';
import { AvailabilitySlot } from '@/hooks/useAvailability';

interface TimeGridProps {
  onTimeSlotClick: (time: Date) => void;
  availabilitySlots?: AvailabilitySlot[];
  currentDate?: Date;
}

export const TimeGrid = ({ onTimeSlotClick, availabilitySlots = [], currentDate = new Date() }: TimeGridProps) => {
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
    const minutes = Math.floor((relativeY / 48) * 60); // Uppdaterad för 48px höjd
    const snappedMinutes = Math.round(minutes / 15) * 15;
    
    const clickedTime = setMinutes(setHours(new Date(), hour), snappedMinutes);
    onTimeSlotClick(clickedTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const quarter = Math.floor((relativeY / 48) * 4); // Uppdaterad för 48px höjd
    setHoveredSlot({ hour, quarter: Math.min(quarter, 3) });
  };

  return (
    <div className="relative" onMouseLeave={() => setHoveredSlot(null)}>
      {hours.map((hour) => {
        const isHourAvailable = isAvailableAt(hour, 0);
        return (
          <div
            key={hour}
            className={`relative h-[48px] border-b border-border transition-all cursor-pointer group ${
              isHourAvailable ? 'bg-emerald-500/10' : 'hover:bg-accent/30'
            }`}
            onClick={(e) => handleClick(e, hour)}
            onMouseMove={(e) => handleMouseMove(e, hour)}
          >
            {/* Hour label - Kompakt */}
            <div className="absolute -left-12 -top-2 text-[10px] text-muted-foreground w-10 text-right font-medium">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* 15-minute gridlines - Kompakt 48px höjd */}
            {[0, 1, 2, 3].map((quarter) => (
              <div
                key={quarter}
                className={`absolute left-0 right-0 border-t transition-all ${
                  quarter === 0 ? 'top-0 border-border' : ''
                }${quarter === 1 ? 'top-[12px] border-dashed border-border/30' : ''}${
                  quarter === 2 ? 'top-[24px] border-dashed border-border/30' : ''
                }${quarter === 3 ? 'top-[36px] border-dashed border-border/30' : ''}${
                  hoveredSlot?.hour === hour && hoveredSlot?.quarter === quarter
                    ? ' bg-primary/10'
                    : ''
                }`}
                style={{
                  height: quarter === 0 ? '0' : '12px',
                  top: quarter === 0 ? '0' : `${quarter * 12}px`,
                }}
              />
            ))}
            
            {/* Hover time indicator - Kompakt */}
            {hoveredSlot?.hour === hour && (
              <div 
                className="absolute left-1 text-[10px] font-medium text-primary pointer-events-none bg-background/90 px-1.5 py-0.5 rounded shadow-sm"
                style={{ top: `${hoveredSlot.quarter * 12}px` }}
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
