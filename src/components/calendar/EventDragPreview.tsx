import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { getEventPosition } from '@/lib/calendarUtils';

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
  const { top, height } = getEventPosition(start.toISOString(), end.toISOString());

  return (
    <>
      {/* Snap indicator line */}
      {snapIndicatorY !== undefined && (
        <div
          className="absolute left-0 right-0 h-0.5 bg-primary/50 z-40 pointer-events-none transition-all duration-100"
          style={{ top: `${snapIndicatorY}px` }}
        >
          <div className="absolute right-2 -top-2 text-xs text-primary font-semibold bg-background/90 px-2 py-0.5 rounded">
            {format(start, 'HH:mm')}
          </div>
        </div>
      )}

      {/* Ghost preview */}
      <div
        className="absolute left-0 right-0 rounded-lg border-2 border-dashed border-primary/50 bg-primary/10 p-2 shadow-lg pointer-events-none z-30 animate-pulse"
        style={{
          top: `${top}px`,
          height: `${Math.max(height, 30)}px`,
        }}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="h-4 w-4" />
          <span>{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</span>
        </div>
        {height > 40 && (
          <div className="text-xs text-muted-foreground mt-1 truncate">
            {title}
          </div>
        )}
      </div>
    </>
  );
};
