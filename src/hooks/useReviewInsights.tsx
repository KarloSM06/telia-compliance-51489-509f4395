import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ImprovementSuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'service' | 'product' | 'communication' | 'process' | 'other';
  expectedImpact: string;
}

export interface Driver {
  driver: string;
  impact: 'high' | 'medium' | 'low';
  frequency: number;
}

export interface ReviewInsights {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  topPositiveDrivers: Driver[];
  topNegativeDrivers: Driver[];
  improvementSuggestions: ImprovementSuggestion[];
  keyInsights: string[];
  trends: {
    sentimentTrend: 'improving' | 'stable' | 'declining';
    commonThemes: string[];
  };
  metadata: {
    analyzedAt: string;
    dataPoints: {
      reviews: number;
      telephony: number;
      sms: number;
      email: number;
      total: number;
    };
    dateRange: { from: string; to: string };
  };
}

export const useReviewInsights = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();

  const { data: insights, isLoading, error, refetch } = useQuery({
    queryKey: ['review-insights', user?.id, dateRange],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase.functions.invoke('analyze-reviews', {
        body: {
          userId: user.id,
          dateFrom: dateRange?.from.toISOString() || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          dateTo: dateRange?.to.toISOString() || new Date().toISOString(),
        },
      });

      if (error) throw error;
      return data as ReviewInsights;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache för 5 minuter
  });

  return {
    insights,
    isLoading,
    error,
    refetch,
  };
};