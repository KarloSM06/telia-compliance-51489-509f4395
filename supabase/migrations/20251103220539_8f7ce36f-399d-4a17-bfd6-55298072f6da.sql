-- Create notification_insights table for AI-generated notification analytics
CREATE TABLE IF NOT EXISTS public.notification_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Analysis period
  analysis_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  analysis_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Overall metrics (AI-enhanced)
  total_notifications INTEGER NOT NULL DEFAULT 0,
  total_sent INTEGER NOT NULL DEFAULT 0,
  total_read INTEGER NOT NULL DEFAULT 0,
  read_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  avg_read_time_minutes NUMERIC(10,2) NOT NULL DEFAULT 0,
  
  -- AI-generated insights
  engagement_score NUMERIC(5,2) NOT NULL DEFAULT 0, -- 0-100 score
  engagement_trend TEXT, -- 'improving', 'stable', 'declining'
  peak_engagement_hours INTEGER[], -- Array of hours (0-23) when engagement is highest
  
  -- Channel effectiveness (AI-analyzed)
  channel_effectiveness JSONB, -- { "email": { "sent": 100, "read": 80, "score": 85 }, "sms": {...}, "push": {...} }
  recommended_channels TEXT[], -- AI recommends best channels
  
  -- Type distribution insights
  type_distribution JSONB, -- { "booking": 50, "review": 30, "system": 20 }
  high_priority_alerts INTEGER NOT NULL DEFAULT 0,
  
  -- AI-generated recommendations
  optimization_suggestions JSONB, -- [{ "title": "...", "description": "...", "impact": "high|medium|low", "category": "timing|channel|content" }]
  
  -- Metadata
  ai_model TEXT NOT NULL DEFAULT 'google/gemini-2.5-flash',
  confidence_score NUMERIC(5,2), -- AI confidence in analysis (0-100)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index for faster queries
CREATE INDEX idx_notification_insights_user_period ON public.notification_insights(user_id, analysis_period_end DESC);

-- Enable RLS
ALTER TABLE public.notification_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own notification insights"
  ON public.notification_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notification insights"
  ON public.notification_insights FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update notification insights"
  ON public.notification_insights FOR UPDATE
  USING (true);

-- Create analysis queue table for notification analysis
CREATE TABLE IF NOT EXISTS public.notification_analysis_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  trigger_source TEXT, -- 'manual', 'automatic', 'schedule'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Index for queue processing
CREATE INDEX idx_notification_analysis_queue_status ON public.notification_analysis_queue(status, created_at);
CREATE INDEX idx_notification_analysis_queue_user ON public.notification_analysis_queue(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.notification_analysis_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own queue items"
  ON public.notification_analysis_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own queue items"
  ON public.notification_analysis_queue FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update queue items"
  ON public.notification_analysis_queue FOR UPDATE
  USING (true);

-- Enable Realtime
ALTER TABLE notification_insights REPLICA IDENTITY FULL;
ALTER TABLE notification_analysis_queue REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE notification_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE notification_analysis_queue;