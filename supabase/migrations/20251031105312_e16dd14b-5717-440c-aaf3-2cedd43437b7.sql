-- PERFORMANCE OPTIMIZATION - CORRECT VERSION
-- Only fixes policies that actually exist and use correct columns

-- agents table
DROP POLICY IF EXISTS "Users can delete own agents" ON agents;
DROP POLICY IF EXISTS "Users can insert own agents" ON agents;
DROP POLICY IF EXISTS "Users can update own agents" ON agents;
DROP POLICY IF EXISTS "Users can view own agents" ON agents;

CREATE POLICY "Users can delete own agents" ON agents
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own agents" ON agents
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own agents" ON agents
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own agents" ON agents
  FOR SELECT USING (user_id = (select auth.uid()));

-- ai_consultations table
DROP POLICY IF EXISTS "Admins can update consultations" ON ai_consultations;
DROP POLICY IF EXISTS "Admins view all consultations" ON ai_consultations;

CREATE POLICY "Admins can update consultations" ON ai_consultations
  FOR UPDATE USING (is_admin((select auth.uid())));
CREATE POLICY "Admins view all consultations" ON ai_consultations
  FOR SELECT USING (is_admin((select auth.uid())));

-- integrations table
DROP POLICY IF EXISTS "Users can delete own integrations" ON integrations;
DROP POLICY IF EXISTS "Users can insert own integrations" ON integrations;
DROP POLICY IF EXISTS "Users can update own integrations" ON integrations;
DROP POLICY IF EXISTS "Users can view own integrations" ON integrations;

CREATE POLICY "Users can delete own integrations" ON integrations
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own integrations" ON integrations
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own integrations" ON integrations
  FOR UPDATE USING (user_id = (select auth.uid()) OR organization_id = user_organization_id((select auth.uid())));
CREATE POLICY "Users can view own integrations" ON integrations
  FOR SELECT USING (user_id = (select auth.uid()) OR organization_id = user_organization_id((select auth.uid())));

-- lead_chat_conversations table
DROP POLICY IF EXISTS "Users can delete own conversations" ON lead_chat_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON lead_chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON lead_chat_conversations;
DROP POLICY IF EXISTS "Users can view own conversations" ON lead_chat_conversations;

CREATE POLICY "Users can delete own conversations" ON lead_chat_conversations
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own conversations" ON lead_chat_conversations
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own conversations" ON lead_chat_conversations
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own conversations" ON lead_chat_conversations
  FOR SELECT USING (user_id = (select auth.uid()));

-- lead_chat_messages table
DROP POLICY IF EXISTS "Users can delete own chat messages" ON lead_chat_messages;
DROP POLICY IF EXISTS "Users can insert own chat messages" ON lead_chat_messages;
DROP POLICY IF EXISTS "Users can view own chat messages" ON lead_chat_messages;

CREATE POLICY "Users can delete own chat messages" ON lead_chat_messages
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own chat messages" ON lead_chat_messages
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can view own chat messages" ON lead_chat_messages
  FOR SELECT USING (user_id = (select auth.uid()));

-- REMOVE DUPLICATE POLICIES
DROP POLICY IF EXISTS "Anyone can submit AI consultation form" ON ai_consultations;
DROP POLICY IF EXISTS "Anyone can insert phone numbers" ON phone_numbers;
DROP POLICY IF EXISTS "Users can only view own phone numbers" ON phone_numbers;
DROP POLICY IF EXISTS "System can insert phone numbers" ON phone_numbers_duplicate;
DROP POLICY IF EXISTS "Users can read own webhook token" ON profiles;
DROP POLICY IF EXISTS "Users can view own analysis jobs" ON review_analysis_queue;
DROP POLICY IF EXISTS "Users access own SMS settings" ON sms_provider_settings;
DROP POLICY IF EXISTS "Service role manages webhook secrets" ON webhook_secrets;
DROP POLICY IF EXISTS "Users access own webhook secrets" ON webhook_secrets;
DROP POLICY IF EXISTS "Users can manage their own webhook secrets" ON webhook_secrets;
DROP POLICY IF EXISTS "Users can view their own webhook secrets" ON webhook_secrets;

-- REMOVE DUPLICATE INDEX
DROP INDEX IF EXISTS idx_telephony_events_user;