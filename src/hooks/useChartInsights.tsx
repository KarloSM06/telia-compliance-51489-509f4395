import { useMemo } from 'react';

interface ChartInsight {
  message: string;
  type: 'success' | 'warning' | 'info';
  value?: number;
}

export const useChartInsights = (
  data: any[],
  dataKey: string,
  chartType: 'revenue' | 'cost' | 'roi' | 'bookings' = 'revenue'
): ChartInsight[] => {
  return useMemo(() => {
    if (!data || data.length < 2) return [];

    const insights: ChartInsight[] = [];
    const values = data.map(d => typeof d[dataKey] === 'number' ? d[dataKey] : 0);
    
    const lastValue = values[values.length - 1];
    const prevValue = values[values.length - 2];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend
    if (prevValue !== 0) {
      const change = ((lastValue - prevValue) / prevValue) * 100;
      
      if (Math.abs(change) > 15) {
        const isImprovement = chartType === 'cost' ? change < 0 : change > 0;
        insights.push({
          message: `${change > 0 ? '↑' : '↓'} ${Math.abs(change).toFixed(1)}% ${
            change > 0 ? 'ökning' : 'minskning'
          } från förra perioden`,
          type: isImprovement ? 'success' : 'warning',
          value: change,
        });
      }
    }

    // Check if trending above/below average
    const recentAvg = values.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, values.length);
    if (recentAvg > avg * 1.2) {
      insights.push({
        message: `Senaste veckan ligger ${((recentAvg / avg - 1) * 100).toFixed(0)}% över genomsnittet`,
        type: 'success',
      });
    } else if (recentAvg < avg * 0.8) {
      insights.push({
        message: `Senaste veckan ligger ${((1 - recentAvg / avg) * 100).toFixed(0)}% under genomsnittet`,
        type: 'warning',
      });
    }

    // Peak detection
    const maxIndex = values.indexOf(max);
    if (maxIndex >= 0 && maxIndex < values.length - 1) {
      const maxDate = data[maxIndex]?.date || data[maxIndex]?.name || '';
      insights.push({
        message: `Högsta värde: ${max.toFixed(0)} ${maxDate ? `(${maxDate})` : ''}`,
        type: 'info',
        value: max,
      });
    }

    return insights.slice(0, 3); // Max 3 insights
  }, [data, dataKey, chartType]);
};
