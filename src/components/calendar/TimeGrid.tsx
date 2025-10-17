import { format, setHours, setMinutes } from 'date-fns';
import { useState } from 'react';

interface TimeGridProps {
  onTimeSlotClick: (time: Date) => void;
}

export const TimeGrid = ({ onTimeSlotClick }: TimeGridProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [hoveredSlot, setHoveredSlot] = useState<{ hour: number; quarter: number } | null>(null);

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
        return (
          <div
            key={hour}
            className="relative h-[60px] border-b border-border hover:bg-accent/30 transition-all cursor-pointer group"
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
                }${quarter === 1 ? 'top-[15px] border-dashed border-border/30' : ''}${
                  quarter === 2 ? 'top-[30px] border-dashed border-border/30' : ''
                }${quarter === 3 ? 'top-[45px] border-dashed border-border/30' : ''}${
                  hoveredSlot?.hour === hour && hoveredSlot?.quarter === quarter
                    ? ' bg-primary/10'
                    : ''
                }`}
                style={{
                  height: quarter === 0 ? '0' : '15px',
                  top: quarter === 0 ? '0' : `${quarter * 15}px`,
                }}
              />
            ))}
            
            {/* Hover time indicator */}
            {hoveredSlot?.hour === hour && (
              <div 
                className="absolute left-2 text-xs font-medium text-primary pointer-events-none bg-background/90 px-2 py-0.5 rounded shadow-sm"
                style={{ top: `${hoveredSlot.quarter * 15}px` }}
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
