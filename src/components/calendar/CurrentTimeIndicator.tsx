import { useEffect, useState } from 'react';
import { isSameDay } from 'date-fns';
import { getCurrentTimeInZone, formatInTimeZone_, toTimeZone } from '@/lib/timezoneUtils';
import { useUserTimezone } from '@/hooks/useUserTimezone';

interface CurrentTimeIndicatorProps {
  displayDate: Date;
  viewStartHour?: number;
}

export const CurrentTimeIndicator = ({ displayDate, viewStartHour = 0 }: CurrentTimeIndicatorProps) => {
  const { timezone } = useUserTimezone();
  const [currentTime, setCurrentTime] = useState(getCurrentTimeInZone(timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTimeInZone(timezone));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timezone]);

  // Only show if displaying today (compare in user's timezone)
  const displayDateInTz = toTimeZone(displayDate, timezone);
  if (!isSameDay(currentTime, displayDateInTz)) return null;

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  
  // Calendar grid: 80px per hour = 1.333px per minute
  const PIXELS_PER_HOUR = 80;
  const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;
  const top = ((hours - viewStartHour) * 60 + minutes) * PIXELS_PER_MINUTE;

  return (
    <div 
      className="absolute left-0 right-0 z-20 pointer-events-none transition-all duration-300"
      style={{ top: `${top}px` }}
    >
      <div className="flex items-center">
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
          {formatInTimeZone_(currentTime, 'HH:mm', timezone)}
        </div>
        <div className="flex-1 border-t-2 border-red-500 shadow-sm"></div>
      </div>
    </div>
  );
};
