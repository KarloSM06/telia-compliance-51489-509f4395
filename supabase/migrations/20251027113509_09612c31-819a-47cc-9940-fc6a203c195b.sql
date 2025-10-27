-- Add provider column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'eniro';

-- Add provider column to lead_searches table
ALTER TABLE lead_searches ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'eniro';

-- Create lead_chat_messages table
CREATE TABLE IF NOT EXISTS lead_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'claude-linkedin',
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on lead_chat_messages
ALTER TABLE lead_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_chat_messages
CREATE POLICY "Users can view own chat messages"
  ON lead_chat_messages
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chat messages"
  ON lead_chat_messages
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own chat messages"
  ON lead_chat_messages
  FOR DELETE
  USING (user_id = auth.uid());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_lead_chat_messages_user_id ON lead_chat_messages(user_id, created_at DESC);