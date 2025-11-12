import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { WidgetDataSource } from '@/types/widget.types';

export const useWidgetData = (dataSource: WidgetDataSource, widgetId: string) => {
  return useQuery({
    queryKey: ['widget-data', widgetId, dataSource],
    queryFn: async () => {
      if (!dataSource.type || dataSource.type === 'custom-query') {
        return null;
      }

      const tableName = dataSource.table || (dataSource.type as string);
      let query = supabase.from(tableName as any).select('*');

      // Apply filters
      if (dataSource.filters) {
        Object.entries(dataSource.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Apply aggregation if needed
      if (dataSource.aggregation && data) {
        const aggregated = applyAggregation(data, dataSource.aggregation, dataSource.groupBy);
        return aggregated;
      }
      
      return data;
    },
    enabled: !!dataSource.type && dataSource.type !== 'custom-query',
    refetchInterval: dataSource.refreshInterval ? dataSource.refreshInterval * 1000 : false,
  });
};

function applyAggregation(data: any[], type: string, groupBy?: string) {
  if (!Array.isArray(data)) {
    return [];
  }
  
  if (!groupBy) {
    // Simple aggregation without grouping
    switch (type) {
      case 'count':
        return [{ value: data.length }];
      case 'sum':
        return [{ value: data.reduce((sum, item) => sum + (parseFloat(item.value) || 0), 0) }];
      case 'avg':
        const sum = data.reduce((s, item) => s + (parseFloat(item.value) || 0), 0);
        return [{ value: sum / data.length }];
      case 'min':
        return [{ value: Math.min(...data.map(item => parseFloat(item.value) || 0)) }];
      case 'max':
        return [{ value: Math.max(...data.map(item => parseFloat(item.value) || 0)) }];
      default:
        return data;
    }
  }
  
  // Group by aggregation
  const grouped = data.reduce((acc, item) => {
    const key = item[groupBy];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, any[]>);
  
  return Object.entries(grouped).map(([key, items]) => ({
    [groupBy]: key,
    value: Array.isArray(items) ? items.length : 0,
  }));
}
