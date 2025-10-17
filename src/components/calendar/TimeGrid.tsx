import { format, setHours, setMinutes } from 'date-fns';

interface TimeGridProps {
  onTimeSlotClick: (time: Date) => void;
}

export const TimeGrid = ({ onTimeSlotClick }: TimeGridProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i); // 00:00 to 23:00

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, hour: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const minutes = Math.floor((relativeY / 60) * 60); // 60px per hour
    const snappedMinutes = Math.round(minutes / 15) * 15; // Snap to 15 min
    
    const clickedTime = setMinutes(setHours(new Date(), hour), snappedMinutes);
    onTimeSlotClick(clickedTime);
  };

  return (
    <div className="relative">
      {hours.map((hour) => {
        const time = setHours(new Date(), hour);
        return (
          <div
            key={hour}
            className="relative h-[60px] border-b border-border hover:bg-accent/20 transition-colors cursor-pointer"
            onClick={(e) => handleClick(e, hour)}
          >
            {/* Hour label */}
            <div className="absolute -left-14 -top-2 text-xs text-muted-foreground w-12 text-right">
              {format(time, 'HH:mm')}
            </div>
            
            {/* 15-minute gridlines */}
            <div className="absolute left-0 right-0 top-[15px] border-t border-dashed border-border/30"></div>
            <div className="absolute left-0 right-0 top-[30px] border-t border-dashed border-border/30"></div>
            <div className="absolute left-0 right-0 top-[45px] border-t border-dashed border-border/30"></div>
          </div>
        );
      })}
    </div>
  );
};
