-- Aktivera Realtime för ai_usage_logs tabellen
ALTER TABLE public.ai_usage_logs REPLICA IDENTITY FULL;

-- Lägg till tabellen i realtime publikation
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_usage_logs;

-- Aktivera pg_cron och pg_net extensions om de inte redan är aktiverade
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schemalägg OpenRouter sync-funktionen att köra varje timme
SELECT cron.schedule(
  'sync-openrouter-usage-hourly',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1/sync-openrouter-usage-cron',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoc2trbmtpdnVld3Vxb25qZGpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDI1MTMsImV4cCI6MjA3NDk3ODUxM30.nipfL31N9clspDeEyfgTQZKynCKvlO-bECGBBV7Kzbg"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);