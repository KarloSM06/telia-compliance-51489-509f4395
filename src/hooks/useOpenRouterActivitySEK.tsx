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
    if (!rawData?.data) return { activity: [], daily_usage: [] };

    // Convert and prepare data for ModelUsageChart
    const activityData = rawData.data.map((item: any) => ({
      date: item.date,
      model: item.model || item.model_permaslug,
      usage: (item.usage || 0) * USD_TO_SEK,
      prompt_tokens: item.prompt_tokens || 0,
      completion_tokens: item.completion_tokens || 0,
      requests: item.requests || 0,
    }));

    // Aggregate data by date and endpoint_id for APIKeyUsageChart
    const dailyUsageMap = new Map();
    rawData.data.forEach((item: any) => {
      const key = `${item.date}_${item.endpoint_id}`;
      if (!dailyUsageMap.has(key)) {
        dailyUsageMap.set(key, {
          date: item.date,
          endpoint_id: item.endpoint_id,
          usage: 0,
          requests: 0,
        });
      }
      const existing = dailyUsageMap.get(key);
      existing.usage += (item.usage || 0) * USD_TO_SEK;
      existing.requests += item.requests || 0;
    });

    const dailyUsageData = Array.from(dailyUsageMap.values());

    return {
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
