-- Create table for OpenRouter account snapshots
CREATE TABLE IF NOT EXISTS public.openrouter_account_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  snapshot_date DATE NOT NULL,
  
  -- Account Balance (from /api/v1/credits)
  total_credits DECIMAL(10,4),
  total_usage DECIMAL(10,4),
  limit_remaining DECIMAL(10,4),
  
  -- Rate Limits (from /api/v1/key)
  rate_limit_requests INT,
  rate_limit_interval VARCHAR(20),
  
  -- API Keys Summary (from /api/v1/keys)
  api_keys_count INT,
  api_keys_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, snapshot_date)
);

CREATE INDEX IF NOT EXISTS idx_account_snapshots_user_date ON public.openrouter_account_snapshots(user_id, snapshot_date DESC);

-- RLS Policies
ALTER TABLE public.openrouter_account_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots" 
  ON public.openrouter_account_snapshots 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own snapshots" 
  ON public.openrouter_account_snapshots 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create table for OpenRouter usage history
CREATE TABLE IF NOT EXISTS public.openrouter_usage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  
  -- Aggregated data from /api/v1/activity
  total_requests INT DEFAULT 0,
  total_cost_usd DECIMAL(10,4) DEFAULT 0,
  models_used JSONB,
  
  -- Metadata
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_history_user_date ON public.openrouter_usage_history(user_id, date DESC);

-- RLS for usage history
ALTER TABLE public.openrouter_usage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage history" 
  ON public.openrouter_usage_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage history" 
  ON public.openrouter_usage_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);