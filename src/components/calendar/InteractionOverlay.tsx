import React from 'react';
import { InteractionState } from '@/hooks/useUnifiedEventInteraction';
import { format } from 'date-fns';
import { formatEventDuration } from '@/lib/calendarUtils';
import { Clock, MoveVertical } from 'lucide-react';

interface InteractionOverlayProps {
  interactionState: InteractionState;
  viewStartHour?: number;
  mouseY?: number;
}

export const InteractionOverlay: React.FC<InteractionOverlayProps> = ({
  interactionState,
  viewStartHour = 0,
  mouseY,
}) => {
  const { snapIndicatorY, previewTimes, type } = interactionState;

  if (!type || !previewTimes) return null;

  const PIXELS_PER_MINUTE = 80 / 60;

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {/* Snap Indicator Line */}
      {snapIndicatorY !== null && (
        <div
          className="absolute left-0 right-0 transition-all duration-50"
          style={{ top: `${snapIndicatorY}px` }}
        >
          {/* Main snap line */}
          <div className="h-1 bg-primary shadow-lg animate-pulse" />
          
          {/* Time label */}
          <div className="absolute left-2 -top-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-base font-semibold shadow-lg flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {format(previewTimes.start, 'HH:mm')}
          </div>
        </div>
      )}

      {/* Floating time indicator that follows mouse */}
      {mouseY !== null && mouseY !== undefined && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-primary/95 text-primary-foreground px-4 py-2 rounded-lg shadow-xl border-2 border-primary-foreground/20 transition-all duration-50"
          style={{ top: `${mouseY}px` }}
        >
          <div className="flex items-center gap-2">
            <MoveVertical className="h-4 w-4" />
            <div className="text-sm font-semibold">
              <div>{format(previewTimes.start, 'HH:mm')} - {format(previewTimes.end, 'HH:mm')}</div>
              <div className="text-xs opacity-90">{formatEventDuration(previewTimes.start, previewTimes.end)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
