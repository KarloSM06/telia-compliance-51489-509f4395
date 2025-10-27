-- Uppdatera trigger-funktionen för att anropa edge function
CREATE OR REPLACE FUNCTION public.notify_new_chat_message()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  function_url text;
  payload jsonb;
BEGIN
  -- Bygg webhook URL till edge function
  function_url := 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1/send-chat-webhook';
  
  -- Bygg payload med all info från raden
  payload := jsonb_build_object(
    'id', NEW.id,
    'user_id', NEW.user_id,
    'conversation_id', NEW.conversation_id,
    'role', NEW.role,
    'content', NEW.content,
    'provider', NEW.provider,
    'metadata', NEW.metadata,
    'created_at', NEW.created_at
  );
  
  -- Anropa edge function asynkront via pg_net
  PERFORM net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoc2trbmtpdnVld3Vxb25qZGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDI1MTMsImV4cCI6MjA3NDk3ODUxM30.nipfL31N9clspDeEyfgTQZKynCKvlO-bECGBBV7Kzbg'
    ),
    body := payload
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Logga error men låt inte triggern faila insert-operationen
  RAISE WARNING 'Failed to send webhook for message %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Återskapa triggern för att säkerställa att den är aktiv
DROP TRIGGER IF EXISTS on_new_chat_message ON public.lead_chat_messages;
CREATE TRIGGER on_new_chat_message
  AFTER INSERT ON public.lead_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_chat_message();