-- Create AI usage logs table
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Request metadata
  generation_id TEXT,
  model TEXT NOT NULL,
  provider TEXT DEFAULT 'openrouter',
  use_case TEXT,
  
  -- Token usage
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  cached_tokens INTEGER DEFAULT 0,
  reasoning_tokens INTEGER DEFAULT 0,
  
  -- Cost tracking (in SEK and USD)
  cost_usd NUMERIC(10, 6) NOT NULL,
  cost_sek NUMERIC(10, 2) NOT NULL,
  upstream_cost_usd NUMERIC(10, 6),
  
  -- Request details
  request_metadata JSONB,
  error_message TEXT,
  status TEXT DEFAULT 'success',
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_date ON public.ai_usage_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_model ON public.ai_usage_logs(model);
CREATE INDEX IF NOT EXISTS idx_ai_usage_case ON public.ai_usage_logs(use_case);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own AI usage" 
  ON public.ai_usage_logs FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Service role can insert AI usage" 
  ON public.ai_usage_logs FOR INSERT 
  WITH CHECK (true);