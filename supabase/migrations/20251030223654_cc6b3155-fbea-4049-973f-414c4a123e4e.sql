-- Create review_insights table for AI-generated insights
CREATE TABLE IF NOT EXISTS public.review_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Analysis period
  analysis_period_start TIMESTAMPTZ NOT NULL,
  analysis_period_end TIMESTAMPTZ NOT NULL,
  
  -- Summary metrics
  total_reviews INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  average_sentiment DECIMAL(3,2),
  sentiment_trend TEXT,
  
  -- AI-generated insights
  improvement_suggestions JSONB,
  positive_drivers JSONB,
  negative_drivers JSONB,
  topic_distribution JSONB,
  
  -- Metadata
  ai_model TEXT,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_review_insights_user_period ON public.review_insights(user_id, analysis_period_end DESC);

-- Enable RLS
ALTER TABLE public.review_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own insights"
  ON public.review_insights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert insights"
  ON public.review_insights FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update insights"
  ON public.review_insights FOR UPDATE
  USING (true);

-- Extend reviews table with AI analysis
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS topics TEXT[];

-- Index for sentiment and topics
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment ON public.reviews(user_id, sentiment_score);
CREATE INDEX IF NOT EXISTS idx_reviews_topics ON public.reviews USING GIN(topics);