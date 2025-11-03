import { useMemo } from 'react';
import { useOpenRouterActivity } from './useOpenRouterActivity';
import { USD_TO_SEK } from '@/lib/constants';

interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Hook that fetches OpenRouter activity data and converts all USD values to SEK
 * @param dateRange - Optional date range to filter activity
 * @param enabled - Whether the query should run
 * @returns OpenRouter activity data with all costs converted to SEK
 */
export const useOpenRouterActivitySEK = (dateRange?: DateRange, enabled: boolean = true) => {
  const { data: rawData, isLoading, error } = useOpenRouterActivity(dateRange, enabled);

  const convertedData = useMemo(() => {
    if (!rawData) return rawData;

    // Convert activity data
    const activityData = rawData.activity?.map((item: any) => ({
      ...item,
      usage: (item.usage || 0) * USD_TO_SEK, // Convert USD to SEK
    })) || [];

    // Convert daily usage data
    const dailyUsageData = rawData.daily_usage?.map((item: any) => ({
      ...item,
      usage: (item.usage || 0) * USD_TO_SEK, // Convert USD to SEK
    })) || [];

    return {
      ...rawData,
      activity: activityData,
      daily_usage: dailyUsageData,
    };
  }, [rawData]);

  return {
    data: convertedData,
    isLoading,
    error,
  };
};
