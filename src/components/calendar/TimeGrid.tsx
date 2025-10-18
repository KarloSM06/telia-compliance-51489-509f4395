import { format, setHours, setMinutes } from 'date-fns';
import { useState, useMemo } from 'react';
import { AvailabilitySlot } from '@/hooks/useAvailability';
import { Clock } from 'lucide-react';

interface TimeGridProps {
  onTimeSlotClick: (time: Date) => void;
  availabilitySlots?: AvailabilitySlot[];
  currentDate?: Date;
  snapIndicatorY?: number | null;
  snapTime?: Date | null;
}

export const TimeGrid = ({ 
  onTimeSlotClick, 
  availabilitySlots = [], 
  currentDate = new Date(),
  snapIndicatorY = null,
  snapTime = null,
}: TimeGridProps) => {
  const [hoveredSlot, setHoveredSlot] = useState<{ hour: number; quarter: number } | null>(null);

  // Get availability slots for current day of week (0 = Monday, 6 = Sunday)
  const dayOfWeek = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  const daySlots = availabilitySlots.filter(slot => slot.day_of_week === dayOfWeek && slot.is_active);

  // Calculate visible hour range based on availability slots
  const { startHour, endHour } = useMemo(() => {
    if (daySlots.length === 0) {
      return { startHour: 0, endHour: 23 };
    }

    const times = daySlots.flatMap(slot => [
      parseInt(slot.start_time.split(':')[0]),
      parseInt(slot.end_time.split(':')[0])
    ]);

    const earliest = Math.max(0, Math.min(...times) - 1);
    const latest = Math.min(23, Math.max(...times) + 1);

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
    const minutes = Math.floor((relativeY / 80) * 60);
    const snappedMinutes = Math.round(minutes / 15) * 15;
    
    const clickedTime = setMinutes(setHours(new Date(), hour), snappedMinutes);
    onTimeSlotClick(clickedTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const quarter = Math.floor((relativeY / 80) * 4);
    setHoveredSlot({ hour, quarter: Math.min(quarter, 3) });
  };

  const isSnapping = snapIndicatorY !== null && snapTime !== null;

  return (
    <div className="relative" onMouseLeave={() => setHoveredSlot(null)}>
      {/* Global snap indicator */}
      {isSnapping && snapTime && (
        <div
          className="absolute left-0 right-0 z-50 pointer-events-none transition-all duration-50"
          style={{ top: `${snapIndicatorY}px` }}
        >
          <div className="h-1 bg-primary shadow-lg animate-pulse" />
          <div className="absolute left-2 -top-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-base font-semibold shadow-lg flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {format(snapTime, 'HH:mm')}
          </div>
        </div>
      )}

      {hours.map((hour) => {
        const isHourAvailable = isAvailableAt(hour, 0);
        
        return (
          <div
            key={hour}
            className={`relative h-[80px] border-b transition-all duration-50 cursor-pointer group ${
              isHourAvailable ? 'bg-emerald-500/10' : 'hover:bg-accent/30'
            }`}
            onClick={(e) => handleClick(e, hour)}
            onMouseMove={(e) => handleMouseMove(e, hour)}
          >
            {/* Hour label */}
            <div className="absolute -left-14 -top-2 text-xs text-muted-foreground w-12 text-right font-medium">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* 15-minute gridlines */}
            {[0, 1, 2, 3].map((quarter) => {
              const isHovered = hoveredSlot?.hour === hour && hoveredSlot?.quarter === quarter && !isSnapping;
              
              return (
                <div
                  key={quarter}
                  className={`absolute left-0 right-0 transition-all duration-50 ${
                    quarter === 0 ? 'top-0 border-t border-border' : ''
                  }${isHovered ? ' bg-primary/10' : ''}${
                    quarter > 0 ? ' border-t border-dashed border-border/30' : ''
                  }${isSnapping && quarter > 0 ? ' border-primary/40' : ''}`}
                  style={{
                    height: '20px',
                    top: `${quarter * 20}px`,
                    borderWidth: isSnapping && quarter > 0 ? '1.5px' : '1px',
                  }}
                />
              );
            })}
            
            {/* Hover time indicator (only when not snapping) */}
            {!isSnapping && hoveredSlot?.hour === hour && (
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
