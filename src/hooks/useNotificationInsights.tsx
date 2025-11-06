import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface OptimizationSuggestion {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'timing' | 'channel' | 'content';
}

interface NotificationInsight {
  id: string;
  user_id: string;
  analysis_period_start: string;
  analysis_period_end: string;
  total_notifications: number;
  total_sent: number;
  total_read: number;
  read_rate: number;
  avg_read_time_minutes: number;
  engagement_score: number;
  engagement_trend: string;
  peak_engagement_hours: number[];
  channel_effectiveness: Record<string, { sent: number; read: number; score: number }>;
  recommended_channels: string[];
  type_distribution: Record<string, number>;
  high_priority_alerts: number;
  optimization_suggestions: OptimizationSuggestion[];
  ai_model: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

interface QueueStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  processed_at?: string;
  error_message?: string;
}

export const useNotificationInsights = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch latest insights
  const { data: insights, isLoading: isLoadingInsights, error: insightsError, refetch: refetchInsights } = useQuery({
    queryKey: ['notification-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('notification_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as NotificationInsight | null;
    },
    enabled: !!user,
    staleTime: 3 * 60 * 1000, // Consider data fresh for 3 minutes
    refetchInterval: (query) => {
      // Optimized polling - less aggressive
      const data = query.state.data;
      if (!data?.created_at) return false;
      
      const createdAt = new Date(data.created_at).getTime();
      const now = Date.now();
      const ageMinutes = (now - createdAt) / 1000 / 60;
      
      if (ageMinutes < 10) return 2 * 60 * 1000; // 2 minutes if fresh
      if (ageMinutes < 60) return 5 * 60 * 1000; // 5 minutes if recent
      return false; // Don't poll if data is old
    },
  });

  // Fetch queue status
  const { data: queueStatus, isLoading: isLoadingQueue } = useQuery({
    queryKey: ['notification-analysis-queue', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('notification_analysis_queue')
        .select('status, created_at, processed_at, error_message')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as QueueStatus | null;
    },
    enabled: !!user,
    staleTime: 60 * 1000, // Consider data fresh for 1 minute
    refetchInterval: 2 * 60 * 1000, // Poll every 2 minutes (reduced from 5s)
  });

  // Count new notifications since last analysis
  const { data: newNotificationsCount } = useQuery({
    queryKey: ['new-notifications-count', user?.id, insights?.created_at],
    queryFn: async () => {
      if (!user?.id) return 0;

      const lastAnalysis = insights?.created_at || new Date(0).toISOString();
      
      const { count, error } = await supabase
        .from('owner_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gt('created_at', lastAnalysis);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const insightsChannel = supabase
      .channel('notification-insights-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_insights',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notification-insights'] });
          toast.success('Ny notifikationsanalys tillgänglig');
        }
      )
      .subscribe();

    const queueChannel = supabase
      .channel('notification-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_analysis_queue',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notification-analysis-queue'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(insightsChannel);
      supabase.removeChannel(queueChannel);
    };
  }, [user?.id, queryClient]);

  // Auto-trigger analysis when needed
  useEffect(() => {
    if (!user?.id || !insights) return;

    const now = new Date();
    const lastAnalysis = new Date(insights.created_at);
    const hoursSinceAnalysis = (now.getTime() - lastAnalysis.getTime()) / 1000 / 60 / 60;

    // Auto-trigger if:
    // 1. More than 24 hours since last analysis AND there are new notifications
    // 2. More than 100 new notifications since last analysis
    const shouldAutoTrigger = 
      (hoursSinceAnalysis > 24 && (newNotificationsCount || 0) > 0) ||
      (newNotificationsCount || 0) > 100;

    if (shouldAutoTrigger && !queueStatus) {
      // Removed console.log for production performance
      analyzeMutation.mutate();
    }
  }, [insights, newNotificationsCount, queueStatus, user?.id]);

  // Manual trigger
  const analyzeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('analyze-notifications', {
        body: { user_id: user.id, trigger_source: 'manual' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Notifikationsanalys startad');
      queryClient.invalidateQueries({ queryKey: ['notification-insights'] });
      queryClient.invalidateQueries({ queryKey: ['notification-analysis-queue'] });
    },
    onError: (error: Error) => {
      console.error('Failed to start analysis:', error);
      toast.error('Kunde inte starta analys: ' + error.message);
    },
  });

  // Check if insights are outdated
  const isOutdated = insights ? 
    (new Date().getTime() - new Date(insights.created_at).getTime()) / 1000 / 60 / 60 > 24 
    : true;

  return {
    insights,
    isLoading: isLoadingInsights || isLoadingQueue,
    error: insightsError,
    isOutdated,
    queueStatus,
    newNotificationsCount: newNotificationsCount || 0,
    triggerAnalysis: () => analyzeMutation.mutate(),
    isAnalyzing: analyzeMutation.isPending || queueStatus?.status === 'processing',
    refetch: refetchInsights,
  };
};
