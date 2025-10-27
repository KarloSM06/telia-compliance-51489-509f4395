-- Create lead_chat_conversations table if not exists
CREATE TABLE IF NOT EXISTS public.lead_chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL DEFAULT 'claude-linkedin',
  title text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  message_count integer DEFAULT 0
);

-- Add conversation_id to lead_chat_messages if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lead_chat_messages' 
    AND column_name = 'conversation_id'
  ) THEN
    ALTER TABLE public.lead_chat_messages 
    ADD COLUMN conversation_id uuid;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_lead_chat_messages_conversation_id 
ON public.lead_chat_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_lead_chat_conversations_user_id 
ON public.lead_chat_conversations(user_id, updated_at DESC);

-- Enable RLS
ALTER TABLE public.lead_chat_conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own conversations" ON public.lead_chat_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.lead_chat_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.lead_chat_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON public.lead_chat_conversations;

-- Create RLS policies
CREATE POLICY "Users can view own conversations"
ON public.lead_chat_conversations
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own conversations"
ON public.lead_chat_conversations
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own conversations"
ON public.lead_chat_conversations
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own conversations"
ON public.lead_chat_conversations
FOR DELETE
USING (user_id = auth.uid());

-- Function to auto-update conversation
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.conversation_id IS NOT NULL THEN
    UPDATE public.lead_chat_conversations
    SET 
      updated_at = now(),
      message_count = message_count + 1,
      title = CASE 
        WHEN title IS NULL AND NEW.role = 'user' THEN 
          left(NEW.content, 50) || CASE WHEN length(NEW.content) > 50 THEN '...' ELSE '' END
        ELSE title
      END
    WHERE id = NEW.conversation_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON public.lead_chat_messages;
CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON public.lead_chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message();