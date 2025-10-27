-- Create lead_chat_conversations table
CREATE TABLE IF NOT EXISTS public.lead_chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'claude-linkedin',
  title text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  message_count integer DEFAULT 0
);

-- Add conversation_id to lead_chat_messages
ALTER TABLE public.lead_chat_messages 
ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.lead_chat_conversations(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lead_chat_messages_conversation_id 
ON public.lead_chat_messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_lead_chat_conversations_user_id 
ON public.lead_chat_conversations(user_id, updated_at DESC);

-- Enable RLS on lead_chat_conversations
ALTER TABLE public.lead_chat_conversations ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_chat_conversations
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

-- Function to auto-update conversation updated_at and message_count
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update conversation on new message
DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON public.lead_chat_messages;
CREATE TRIGGER trigger_update_conversation_on_message
AFTER INSERT ON public.lead_chat_messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_on_message();

-- Enable realtime for conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.lead_chat_conversations;