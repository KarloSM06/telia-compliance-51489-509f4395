import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";

export interface ImprovementSuggestion {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  actionable_steps: string[];
}

export interface Driver {
  topic: string;
  mentions: number;
  sentiment: number;
  examples?: string[];
}

export interface TopicDistribution {
  categories: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

export interface ReviewInsight {
  id: string;
  user_id: string;
  analysis_period_start: string;
  analysis_period_end: string;
  total_reviews: number;
  total_interactions: number;
  average_sentiment: number;
  sentiment_trend: 'improving' | 'stable' | 'declining';
  improvement_suggestions: ImprovementSuggestion[];
  positive_drivers: Driver[];
  negative_drivers: Driver[];
  topic_distribution: TopicDistribution;
  ai_model: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export const useReviewInsights = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch latest insights with optimized polling
  const { data: insights, isLoading, error } = useQuery({
    queryKey: ['review-insights', user?.id, dateRange],
    queryFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('review_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('analysis_period_end', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Cast JSONB fields to proper types
      return {
        ...data,
        improvement_suggestions: data.improvement_suggestions as unknown as ImprovementSuggestion[],
        positive_drivers: data.positive_drivers as unknown as Driver[],
        negative_drivers: data.negative_drivers as unknown as Driver[],
        topic_distribution: data.topic_distribution as unknown as TopicDistribution,
      } as ReviewInsight;
    },
    enabled: !!user,
    refetchInterval: (query) => {
      // Polla oftare om ingen analys finns eller är outdated
      const data = query.state.data;
      if (!data) return 30000; // 30 sekunder
      const isOld = new Date().getTime() - new Date(data.updated_at).getTime() > 24 * 60 * 60 * 1000;
      return isOld ? 30000 : 5 * 60 * 1000; // 30s om gammal, annars 5 min
    }
  });

  // Fetch queue status for real-time feedback
  const { data: queueStatus } = useQuery({
    queryKey: ['analysis-queue-status', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data } = await supabase
        .from('review_analysis_queue')
        .select('status, created_at')
        .eq('user_id', user.id)
        .in('status', ['pending', 'processing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      return data;
    },
    enabled: !!user,
    refetchInterval: 10000 // Polla var 10:e sekund
  });

  // Check if insights are outdated (older than 24 hours)
  const isOutdated = insights 
    ? new Date().getTime() - new Date(insights.updated_at).getTime() > 24 * 60 * 60 * 1000
    : true;

  // Realtime subscription för review_insights
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('review-insights-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_insights',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New insight received:', payload);
          queryClient.invalidateQueries({ queryKey: ['review-insights'] });
          toast.success('Ny AI-analys tillgänglig!', {
            icon: <Sparkles className="h-4 w-4" />
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Realtime subscription för analysis queue
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('analysis-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'review_analysis_queue',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['analysis-queue-status'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Auto-trigger analys om data är föråldrad
  useEffect(() => {
    if (!user || isLoading) return;
    
    const shouldAutoTrigger = !insights || isOutdated;
    
    if (shouldAutoTrigger && !queueStatus) {
      console.log('Auto-triggering analysis in background...');
      supabase.functions.invoke('analyze-reviews', {
        body: { 
          auto_triggered: true,
          user_id: user.id
        }
      }).then(({ data, error }) => {
        if (error) {
          console.error('Auto-trigger failed:', error);
          toast.error('AI-analys misslyckades: ' + error.message);
        } else {
          console.log('Auto-trigger succeeded:', data);
        }
      }).catch(error => {
        console.error('Auto-trigger network error:', error);
        toast.error('Kunde inte starta AI-analys. Kontrollera din internetanslutning.');
      });
    }
  }, [user, insights, isOutdated, isLoading, queueStatus]);

  // Trigger new analysis (manual trigger - not used in UI anymore but kept for compatibility)
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('analyze-reviews', {
        body: { 
          dateRange: dateRange ? {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString()
          } : undefined
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['review-insights'] });
      toast.success(data.message || 'Analys genomförd');
    },
    onError: (error: any) => {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Fel vid analys');
    },
  });

  return {
    insights,
    isLoading,
    error,
    isOutdated,
    queueStatus,
    triggerAnalysis: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending,
  };
};
