import { useEffect, useState } from 'react';
import { isSameDay } from 'date-fns';
import { getCurrentStockholmTime, formatInStockholm, toStockholmTime } from '@/lib/timezoneUtils';

interface CurrentTimeIndicatorProps {
  displayDate: Date;
}

export const CurrentTimeIndicator = ({ displayDate }: CurrentTimeIndicatorProps) => {
  const [currentTime, setCurrentTime] = useState(getCurrentStockholmTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentStockholmTime());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Only show if displaying today (compare in Stockholm time)
  const stockholmDisplayDate = toStockholmTime(displayDate);
  if (!isSameDay(currentTime, stockholmDisplayDate)) return null;

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
          {formatInStockholm(currentTime, 'HH:mm')}
        </div>
        <div className="flex-1 border-t-2 border-red-500"></div>
      </div>
    </div>
  );
};
