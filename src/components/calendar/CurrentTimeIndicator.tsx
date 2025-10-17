import { useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';

interface CurrentTimeIndicatorProps {
  displayDate: Date;
}

export const CurrentTimeIndicator = ({ displayDate }: CurrentTimeIndicatorProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Only show if displaying today
  if (!isSameDay(currentTime, displayDate)) return null;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const PIXELS_PER_MINUTE = 1;
  const top = (hours * 60 + minutes) * PIXELS_PER_MINUTE; // Start at 00:00

  return (
    <div 
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <div className="flex items-center">
        <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {format(currentTime, 'HH:mm')}
        </div>
        <div className="flex-1 border-t-2 border-red-500"></div>
      </div>
    </div>
  );
};
