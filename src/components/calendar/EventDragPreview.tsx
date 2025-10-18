import { format, differenceInMinutes } from 'date-fns';
import { Clock, MoveVertical } from 'lucide-react';
import { getEventPosition } from '@/lib/calendarUtils';

interface EventDragPreviewProps {
  start: Date;
  end: Date;
  title: string;
  snapIndicatorY?: number;
  mouseY?: number;
}

export const EventDragPreview = ({
  start,
  end,
  title,
  snapIndicatorY,
  mouseY,
}: EventDragPreviewProps) => {
  const { top, height } = getEventPosition(start.toISOString(), end.toISOString());
  const duration = differenceInMinutes(end, start);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  const durationText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <>
      {/* Enhanced snap indicator line - super prominent */}
      {snapIndicatorY !== undefined && (
        <div
          className="absolute left-0 right-0 h-1 bg-primary/90 z-40 pointer-events-none transition-all duration-100 animate-pulse"
          style={{ 
            top: `${snapIndicatorY}px`,
            boxShadow: '0 0 20px hsl(var(--primary) / 0.8)',
          }}
        >
          <div className="absolute right-2 -top-4 text-base font-bold text-primary-foreground bg-primary px-4 py-1.5 rounded-lg shadow-xl border-2 border-primary flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {format(start, 'HH:mm')}
          </div>
        </div>
      )}

      {/* Enhanced ghost preview with vertical accent line */}
      <div
        className="absolute left-0 right-0 rounded-lg border-2 border-primary/60 bg-primary/20 p-2 shadow-xl pointer-events-none z-30 transition-all duration-50"
        style={{
          top: `${top}px`,
          height: `${Math.max(height, 30)}px`,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          borderLeftWidth: '6px',
          borderLeftColor: 'hsl(var(--primary))',
        }}
      >
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</span>
          <span className="text-xs text-muted-foreground ml-auto">({durationText})</span>
        </div>
        {height > 40 && (
          <div className="text-xs text-muted-foreground mt-1 truncate font-medium">
            {title}
          </div>
        )}
      </div>

      {/* Floating time indicator that follows mouse */}
      {mouseY !== undefined && (
        <div
          className="absolute left-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-xl pointer-events-none z-50 font-bold text-sm transition-all duration-50"
          style={{
            top: `${mouseY - 30}px`,
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
          }}
        >
          <div className="flex items-center gap-2">
            <MoveVertical className="h-4 w-4" />
            <div>
              <div>{format(start, 'HH:mm')} - {format(end, 'HH:mm')}</div>
              <div className="text-xs opacity-90">{durationText}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
