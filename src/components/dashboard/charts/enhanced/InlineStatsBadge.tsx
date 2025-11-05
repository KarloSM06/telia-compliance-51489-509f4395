import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface InlineStatsBadgeProps {
  data: any[];
  dataKey: string;
  label?: string;
}

export const InlineStatsBadge = ({ data, dataKey, label }: InlineStatsBadgeProps) => {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    const values = data.map(d => d[dataKey] || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const lastValue = values[values.length - 1];
    const prevValue = values[values.length - 2];
    
    const trend = prevValue !== 0 ? ((lastValue - prevValue) / prevValue) * 100 : 0;
    const maxDate = data[values.indexOf(max)]?.date || data[values.indexOf(max)]?.name;
    const minDate = data[values.indexOf(min)]?.date || data[values.indexOf(min)]?.name;

    return { max, min, avg, trend, maxDate, minDate };
  }, [data, dataKey]);

  if (!stats) return null;

  const TrendIcon = stats.trend > 0 ? TrendingUp : stats.trend < 0 ? TrendingDown : Minus;
  const trendColor = stats.trend > 0 ? 'text-green-600 dark:text-green-400' : 
                     stats.trend < 0 ? 'text-red-600 dark:text-red-400' : 
                     'text-muted-foreground';

  return (
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3 pb-3 border-b">
      <div className="flex items-center gap-1">
        <span className="font-medium">Högsta:</span>
        <span className="text-foreground font-semibold">
          {stats.max.toFixed(0)}
        </span>
        {stats.maxDate && (
          <span className="text-[10px]">({formatDate(stats.maxDate)})</span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <span className="font-medium">Lägsta:</span>
        <span className="text-foreground font-semibold">
          {stats.min.toFixed(0)}
        </span>
        {stats.minDate && (
          <span className="text-[10px]">({formatDate(stats.minDate)})</span>
        )}
      </div>
      
      <div className="flex items-center gap-1">
        <span className="font-medium">Medel:</span>
        <span className="text-foreground font-semibold">
          {stats.avg.toFixed(0)}
        </span>
      </div>
      
      {stats.trend !== 0 && (
        <div className={`flex items-center gap-1 ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span className="font-semibold">
            {Math.abs(stats.trend).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
