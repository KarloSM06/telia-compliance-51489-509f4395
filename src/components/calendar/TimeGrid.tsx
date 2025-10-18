import { format, setHours, setMinutes } from 'date-fns';
import { useState, useMemo } from 'react';
import { AvailabilitySlot } from '@/hooks/useAvailability';

interface TimeGridProps {
  onTimeSlotClick: (time: Date) => void;
  availabilitySlots?: AvailabilitySlot[];
  currentDate?: Date;
  isDragging?: boolean;
  dragSnapHour?: number;
  dragSnapQuarter?: number;
}

export const TimeGrid = ({ 
  onTimeSlotClick, 
  availabilitySlots = [], 
  currentDate = new Date(),
  isDragging = false,
  dragSnapHour,
  dragSnapQuarter,
}: TimeGridProps) => {
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
    const minutes = Math.floor((relativeY / 60) * 60);
    const snappedMinutes = Math.round(minutes / 15) * 15;
    
    const clickedTime = setMinutes(setHours(new Date(), hour), snappedMinutes);
    onTimeSlotClick(clickedTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const quarter = Math.floor((relativeY / 60) * 4); // 0-3 for 15min intervals
    setHoveredSlot({ hour, quarter: Math.min(quarter, 3) });
  };

  return (
    <div className="relative" onMouseLeave={() => setHoveredSlot(null)}>
      {hours.map((hour) => {
        const isHourAvailable = isAvailableAt(hour, 0);
        const isDragTarget = isDragging && dragSnapHour === hour;
        
        return (
          <div
            key={hour}
            className={`relative h-[80px] border-b transition-all duration-50 cursor-pointer group ${
              isHourAvailable ? 'bg-emerald-500/10' : 'hover:bg-accent/30'
            } ${isDragging ? 'border-border' : 'border-border'}`}
            onClick={(e) => handleClick(e, hour)}
            onMouseMove={(e) => handleMouseMove(e, hour)}
          >
            {/* Hour label */}
            <div className="absolute -left-14 -top-2 text-xs text-muted-foreground w-12 text-right font-medium">
              {hour.toString().padStart(2, '0')}:00
            </div>
            
            {/* 15-minute gridlines with enhanced visibility during drag */}
            {[0, 1, 2, 3].map((quarter) => {
              const isSnapTarget = isDragTarget && dragSnapQuarter === quarter;
              const isHovered = hoveredSlot?.hour === hour && hoveredSlot?.quarter === quarter;
              
              return (
                <div
                  key={quarter}
                  className={`absolute left-0 right-0 border-t transition-all duration-50 ${
                    quarter === 0 ? 'top-0 border-border' : ''
                  }${quarter === 1 ? 'top-[20px]' : ''}${
                    quarter === 2 ? 'top-[40px]' : ''}${
                    quarter === 3 ? 'top-[60px]' : ''}${
                    isDragging && quarter > 0 ? ' border-dashed border-primary/40' : quarter > 0 ? ' border-dashed border-border/30' : ''
                  }${isSnapTarget ? ' bg-primary/30' : isHovered ? ' bg-primary/10' : ''}`}
                  style={{
                    height: quarter === 0 ? '0' : '20px',
                    top: quarter === 0 ? '0' : `${quarter * 20}px`,
                    borderWidth: isDragging && quarter > 0 ? '1.5px' : '1px',
                  }}
                />
              );
            })}
            
            {/* Enhanced target box for drag snap - super visible */}
            {isDragTarget && dragSnapQuarter !== undefined && (
              <>
                {/* Vertical guideline */}
                <div
                  className="absolute left-0 w-1 bg-primary/40 top-0 bottom-0 pointer-events-none z-10"
                />
                {/* Target box */}
                <div
                  className="absolute left-0 right-0 h-[24px] bg-primary/30 border-[3px] border-primary rounded pointer-events-none z-20 transition-all duration-100 animate-pulse"
                  style={{
                    top: `${dragSnapQuarter * 20 - 2}px`,
                    boxShadow: '0 0 20px hsl(var(--primary) / 0.6)',
                  }}
                >
                  <div className="absolute left-2 -top-1 text-sm font-bold text-primary-foreground bg-primary px-3 py-1 rounded-lg shadow-xl">
                    {hour.toString().padStart(2, '0')}:{(dragSnapQuarter * 15).toString().padStart(2, '0')}
                  </div>
                </div>
              </>
            )}
            
            {/* Hover time indicator (only when not dragging) */}
            {!isDragging && hoveredSlot?.hour === hour && (
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
