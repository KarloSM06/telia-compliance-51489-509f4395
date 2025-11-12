import { useMemo } from "react";
import { subDays, startOfDay, endOfDay, isWithinInterval } from "date-fns";

interface TrendData {
  value: number;
  isPositive: boolean;
  label?: string;
}

interface DailyData {
  date: Date;
  value: number;
}

/**
 * Calculate trend compared to previous period
 * @param currentValue - Current period value
 * @param previousValue - Previous period value
 * @returns Trend data with percentage change
 */
export function calculateTrend(
  currentValue: number,
  previousValue: number
): TrendData {
  if (previousValue === 0) {
    return {
      value: currentValue > 0 ? 100 : 0,
      isPositive: currentValue > 0,
      label: "från föregående period",
    };
  }

  const change = ((currentValue - previousValue) / previousValue) * 100;
  
  return {
    value: Math.abs(change),
    isPositive: change >= 0,
    label: "från föregående period",
  };
}

/**
 * Hook to calculate trends and sparkline data
 */
export function useStatTrends(
  data: any[],
  dateField: string = "created_at",
  valueField: string = "amount",
  dateRange?: { from: Date; to: Date }
) {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        currentValue: 0,
        previousValue: 0,
        trend: { value: 0, isPositive: true, label: "ingen data" },
        sparklineData: [],
      };
    }

    const now = new Date();
    const defaultFrom = subDays(now, 30);
    const from = dateRange?.from || defaultFrom;
    const to = dateRange?.to || now;

    // Calculate period duration
    const periodDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
    const previousFrom = subDays(from, periodDays);
    const previousTo = from;

    // Filter data for current and previous periods
    const currentPeriodData = data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, { start: startOfDay(from), end: endOfDay(to) });
    });

    const previousPeriodData = data.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return isWithinInterval(itemDate, { start: startOfDay(previousFrom), end: endOfDay(previousTo) });
    });

    // Calculate values
    const currentValue = currentPeriodData.reduce((sum, item) => {
      const value = typeof item[valueField] === 'number' ? item[valueField] : 0;
      return sum + value;
    }, 0);

    const previousValue = previousPeriodData.reduce((sum, item) => {
      const value = typeof item[valueField] === 'number' ? item[valueField] : 0;
      return sum + value;
    }, 0);

    // Calculate trend
    const trend = calculateTrend(currentValue, previousValue);

    // Generate sparkline data (last 10 data points)
    const sparklineData = currentPeriodData
      .slice(-10)
      .map((item) => ({
        value: typeof item[valueField] === 'number' ? item[valueField] : 0,
      }));

    return {
      currentValue,
      previousValue,
      trend,
      sparklineData,
    };
  }, [data, dateField, valueField, dateRange]);
}

/**
 * Calculate daily aggregated data for sparklines
 */
export function aggregateDailyData(
  data: any[],
  dateField: string = "created_at",
  valueField: string = "amount",
  days: number = 30
): { value: number }[] {
  const now = new Date();
  const startDate = subDays(now, days);

  // Group data by day
  const dailyMap = new Map<string, number>();

  data.forEach((item) => {
    const itemDate = new Date(item[dateField]);
    if (itemDate >= startDate) {
      const dateKey = startOfDay(itemDate).toISOString();
      const currentValue = dailyMap.get(dateKey) || 0;
      const itemValue = typeof item[valueField] === 'number' ? item[valueField] : 0;
      dailyMap.set(dateKey, currentValue + itemValue);
    }
  });

  // Convert to array and sort by date
  const dailyData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([_, value]) => ({ value }));

  return dailyData;
}
