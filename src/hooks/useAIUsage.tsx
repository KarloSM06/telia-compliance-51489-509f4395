import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { startOfDay, endOfDay } from "date-fns";
import { useEffect } from "react";

export interface AIUsageSummary {
  totalCostSEK: number;
  totalTokens: number;
  totalCalls: number;
  costByModel: Array<{
    model: string;
    cost: number;
    tokens: number;
    calls: number;
  }>;
  costByUseCase: Array<{
    useCase: string;
    cost: number;
    calls: number;
  }>;
  dailyCosts: Array<{
    date: string;
    cost: number;
    tokens: number;
  }>;
}

export const useAIUsage = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ai-usage", user?.id, dateRange],
    queryFn: async () => {
      if (!user?.id) return null;

      let query = supabase
        .from("ai_usage_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dateRange) {
        query = query
          .gte("created_at", startOfDay(dateRange.from).toISOString())
          .lte("created_at", endOfDay(dateRange.to).toISOString());
      }

      const { data: logs, error } = await query;

      if (error) throw error;
      if (!logs || logs.length === 0) {
        return {
          totalCostSEK: 0,
          totalTokens: 0,
          totalCalls: 0,
          costByModel: [],
          costByUseCase: [],
          dailyCosts: [],
        } as AIUsageSummary;
      }

      // Aggregate data
      const totalCostSEK = logs.reduce((sum, log) => sum + Number(log.cost_sek), 0);
      const totalTokens = logs.reduce((sum, log) => sum + (log.total_tokens || 0), 0);
      const totalCalls = logs.length;

      // Group by model
      const modelMap = new Map<string, { cost: number; tokens: number; calls: number }>();
      logs.forEach(log => {
        const existing = modelMap.get(log.model) || { cost: 0, tokens: 0, calls: 0 };
        modelMap.set(log.model, {
          cost: existing.cost + Number(log.cost_sek),
          tokens: existing.tokens + (log.total_tokens || 0),
          calls: existing.calls + 1,
        });
      });
      const costByModel = Array.from(modelMap.entries()).map(([model, data]) => ({
        model,
        ...data,
      }));

      // Group by use case
      const useCaseMap = new Map<string, { cost: number; calls: number }>();
      logs.forEach(log => {
        const useCase = log.use_case || 'unknown';
        const existing = useCaseMap.get(useCase) || { cost: 0, calls: 0 };
        useCaseMap.set(useCase, {
          cost: existing.cost + Number(log.cost_sek),
          calls: existing.calls + 1,
        });
      });
      const costByUseCase = Array.from(useCaseMap.entries()).map(([useCase, data]) => ({
        useCase,
        ...data,
      }));

      // Group by day
      const dayMap = new Map<string, { cost: number; tokens: number }>();
      logs.forEach(log => {
        const date = new Date(log.created_at).toISOString().split('T')[0];
        const existing = dayMap.get(date) || { cost: 0, tokens: 0 };
        dayMap.set(date, {
          cost: existing.cost + Number(log.cost_sek),
          tokens: existing.tokens + (log.total_tokens || 0),
        });
      });
      const dailyCosts = Array.from(dayMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalCostSEK,
        totalTokens,
        totalCalls,
        costByModel,
        costByUseCase,
        dailyCosts,
      } as AIUsageSummary;
    },
    enabled: !!user?.id,
  });

  // Realtime subscription for new AI usage
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('ai-usage-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_usage_logs',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('New AI usage detected, refreshing...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  return {
    usage: data,
    isLoading,
    refetch,
  };
};
