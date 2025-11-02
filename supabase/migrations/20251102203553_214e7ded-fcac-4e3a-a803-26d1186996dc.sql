-- Create user_ai_settings table for storing user-specific AI provider settings
CREATE TABLE user_ai_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- OpenRouter credentials (encrypted)
  openrouter_api_key_encrypted TEXT,
  
  -- AI Provider selection
  ai_provider TEXT DEFAULT 'lovable' CHECK (ai_provider IN ('lovable', 'openrouter')),
  
  -- Model selection per use case
  default_model TEXT DEFAULT 'google/gemini-2.5-flash',
  chat_model TEXT,
  enrichment_model TEXT,
  analysis_model TEXT,
  classification_model TEXT,
  
  -- Fallback settings
  use_system_fallback BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_user_ai_settings UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_ai_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own AI settings" 
  ON user_ai_settings 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own AI settings" 
  ON user_ai_settings 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own AI settings" 
  ON user_ai_settings 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own AI settings" 
  ON user_ai_settings 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_user_ai_settings_updated_at
  BEFORE UPDATE ON user_ai_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();