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
  const PIXELS_PER_MINUTE = 1;
  const top = ((hours - viewStartHour) * 60 + minutes) * PIXELS_PER_MINUTE;

  return (
    <div 
      className="absolute left-0 right-0 z-20 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <div className="flex items-center">
        <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {formatInTimeZone_(currentTime, 'HH:mm', timezone)}
        </div>
        <div className="flex-1 border-t-2 border-red-500"></div>
      </div>
    </div>
  );
};
