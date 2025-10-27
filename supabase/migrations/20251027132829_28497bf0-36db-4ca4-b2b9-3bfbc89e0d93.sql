-- Create function to send webhook on new chat message
CREATE OR REPLACE FUNCTION public.notify_new_chat_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  -- Send webhook to n8n asynchronously
  PERFORM net.http_post(
    url := 'https://n8n.srv1053222.hstgr.cloud/webhook-test/8c46d3ab-14aa-4535-be9b-9619866305aa',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'id', NEW.id,
      'user_id', NEW.user_id,
      'conversation_id', NEW.conversation_id,
      'role', NEW.role,
      'content', NEW.content,
      'provider', NEW.provider,
      'metadata', NEW.metadata,
      'created_at', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_new_chat_message ON public.lead_chat_messages;

-- Create trigger that fires after each new message insert
CREATE TRIGGER on_new_chat_message
  AFTER INSERT ON public.lead_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_chat_message();