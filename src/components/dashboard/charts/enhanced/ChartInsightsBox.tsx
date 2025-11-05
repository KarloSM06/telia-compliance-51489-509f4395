import { TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';
import { useMemo } from 'react';
interface Insight {
  type: 'success' | 'warning' | 'info' | 'danger';
  message: string;
  icon: typeof TrendingUp;
}
interface ChartInsightsBoxProps {
  data: any[];
  dataKey: string;
  type?: 'revenue' | 'cost' | 'roi' | 'bookings' | 'general';
}
export const ChartInsightsBox = ({
  data,
  dataKey,
  type = 'general'
}: ChartInsightsBoxProps) => {
  const insights = useMemo<Insight[]>(() => {
    if (!data || data.length < 2) return [];
    const results: Insight[] = [];
    const values = data.map(d => d[dataKey] || 0);
    const lastValue = values[values.length - 1];
    const prevValue = values[values.length - 2];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend
    const change = prevValue !== 0 ? (lastValue - prevValue) / prevValue * 100 : 0;

    // Trend insight
    if (Math.abs(change) > 10) {
      const isPositive = change > 0;
      const shouldBePositive = type === 'revenue' || type === 'roi' || type === 'bookings';
      const isGood = isPositive === shouldBePositive || type === 'general';
      results.push({
        type: isGood ? 'success' : 'warning',
        message: `${isPositive ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}% ${isPositive ? 'ökning' : 'minskning'} från förra perioden ${isGood ? '🎉' : '⚠️'}`,
        icon: isPositive ? TrendingUp : TrendingDown
      });
    }

    // Anomaly detection
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length);
    if (lastValue > avg + 2 * stdDev || lastValue < avg - 2 * stdDev) {
      results.push({
        type: 'info',
        message: `Senaste värdet (${lastValue.toFixed(0)}) är ovanligt ${lastValue > avg ? 'högt' : 'lågt'} jämfört med genomsnittet (${avg.toFixed(0)})`,
        icon: AlertCircle
      });
    }

    // Extremes
    const maxIndex = values.indexOf(max);
    if (maxIndex < values.length - 1) {
      const maxDate = data[maxIndex]?.date || data[maxIndex]?.name;
      results.push({
        type: 'info',
        message: `Högsta värde: ${max.toFixed(0)} (${maxDate})`,
        icon: Info
      });
    }
    return results.slice(0, 2); // Max 2 insights
  }, [data, dataKey, type]);
  if (insights.length === 0) return null;
  return <div className="space-y-2 mb-3">
      {insights.map((insight, index) => {
      const Icon = insight.icon;
      const bgColor = {
        success: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800',
        info: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
        danger: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
      }[insight.type];
      const textColor = {
        success: 'text-green-700 dark:text-green-300',
        warning: 'text-yellow-700 dark:text-yellow-300',
        info: 'text-blue-700 dark:text-blue-300',
        danger: 'text-red-700 dark:text-red-300'
      }[insight.type];
      return (
        <div key={index} className={`flex items-start gap-2 p-3 rounded-lg border ${bgColor}`}>
          <Icon className={`h-4 w-4 mt-0.5 ${textColor}`} />
          <p className={`text-sm ${textColor}`}>{insight.message}</p>
        </div>
      );
    })}
    </div>;
};