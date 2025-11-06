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
    staleTime: 3 * 60 * 1000, // Consider data fresh for 3 minutes
    refetchInterval: (query) => {
      // Poll less frequently - optimize performance
      const data = query.state.data;
      if (!data) return 2 * 60 * 1000; // 2 minutes if no data
      const isOld = new Date().getTime() - new Date(data.updated_at).getTime() > 24 * 60 * 60 * 1000;
      return isOld ? 2 * 60 * 1000 : 5 * 60 * 1000; // 2 min if old, 5 min otherwise
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
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    refetchInterval: 2 * 60 * 1000 // Poll every 2 minutes (reduced from 10s)
  });

  // Count new interactions since last analysis
  const { data: newInteractionsCount } = useQuery({
    queryKey: ['new-interactions-count', user?.id, insights?.analysis_period_end],
    queryFn: async () => {
      if (!user || !insights) return 0;
      
      const lastAnalysis = new Date(insights.analysis_period_end);
      
      // Count new reviews
      const { count: reviewCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('created_at', lastAnalysis.toISOString());
      
      // Count new SMS/Email
      const { count: messageCount } = await supabase
        .from('message_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('created_at', lastAnalysis.toISOString());
      
      // Count new calls
      const { count: callCount } = await supabase
        .from('telephony_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('created_at', lastAnalysis.toISOString());
      
      return (reviewCount || 0) + (messageCount || 0) + (callCount || 0);
    },
    enabled: !!user && !!insights,
    staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
    refetchInterval: 5 * 60 * 1000 // Check every 5 minutes (reduced from 30s)
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

  // Auto-trigger analys om data är föråldrad eller ny data finns
  useEffect(() => {
    if (!user || isLoading) return;
    
    // Beräkna tid sedan senaste analys
    const minutesSinceLastAnalysis = insights 
      ? (new Date().getTime() - new Date(insights.created_at).getTime()) / (1000 * 60)
      : Infinity;
    
    // Optimized triggering logic - less aggressive
    const hasNewData = (newInteractionsCount || 0) >= 10; // Increased from 1 to 10
    const enoughTimePassed = minutesSinceLastAnalysis >= 30; // Increased from 5 to 30 min
    const hasSignificantNewData = (newInteractionsCount || 0) >= 50; // Increased from 3 to 50
    
    const shouldAutoTrigger = 
      !insights ||                                    // No previous analysis
      isOutdated ||                                   // Older than 24h
      hasSignificantNewData ||                        // At least 50 new interactions
      (hasNewData && enoughTimePassed);               // 10+ new interactions AND 30+ minutes passed
    
    if (shouldAutoTrigger && !queueStatus) {
      supabase.functions.invoke('analyze-reviews', {
        body: { 
          auto_triggered: true,
          user_id: user.id
        }
      }).then(({ data, error }) => {
        if (error) {
          toast.error('AI-analys misslyckades: ' + error.message);
        } else {
          if (hasNewData) {
            toast.success('AI-insikter uppdaterade!', {
              icon: <Sparkles className="h-4 w-4" />
            });
          }
        }
      }).catch(() => {
        toast.error('Kunde inte starta AI-analys.');
      });
    }
  }, [user, insights, isOutdated, isLoading, queueStatus, newInteractionsCount]);

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
    newInteractionsCount,
    triggerAnalysis: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending,
  };
};
