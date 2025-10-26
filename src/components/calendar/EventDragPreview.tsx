import { Clock } from 'lucide-react';
import { toISOStringWithOffset } from '@/lib/timezoneUtils';
import { useUserTimezone } from '@/hooks/useUserTimezone';
import { format } from 'date-fns';

interface EventDragPreviewProps {
  start: Date;
  end: Date;
  title: string;
  snapIndicatorY?: number;
}

export const EventDragPreview = ({
  start,
  end,
  title,
  snapIndicatorY,
}: EventDragPreviewProps) => {
  const { timezone } = useUserTimezone();
  
  // Format times for display
  const startTime = format(start, 'HH:mm');
  const endTime = format(end, 'HH:mm');
  
  // Calculate position based on current drag position
  const PIXELS_PER_HOUR = 80;
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();
  const pixelsPerMinute = PIXELS_PER_HOUR / 60;
  
  const top = startMinutes * pixelsPerMinute;
  const height = Math.max((endMinutes - startMinutes) * pixelsPerMinute, 30);

  return (
    <>
      {/* Snap indicator line */}
      {snapIndicatorY !== undefined && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-primary z-40 pointer-events-none transition-all duration-100"
          style={{ top: `${snapIndicatorY}px` }}
        >
          <div className="absolute right-2 -top-2.5 text-xs text-primary-foreground font-semibold bg-primary px-2 py-1 rounded shadow-lg">
            {startTime}
          </div>
        </div>
      )}

      {/* Ghost preview */}
      <div
        className="absolute left-0 right-0 rounded-lg border-2 border-dashed border-primary bg-primary/20 backdrop-blur-sm p-3 shadow-xl pointer-events-none z-30"
        style={{
          top: `${top}px`,
          height: `${height}px`,
        }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4" />
          <span>{startTime} - {endTime}</span>
        </div>
        {height > 50 && (
          <div className="text-xs text-muted-foreground mt-2 truncate font-medium">
            {title}
          </div>
        )}
      </div>
    </>
  );
};
