-- Migration: Konsolidera AI-inställningar
-- Säkerställ att alla users har korrekt default-värden efter flytt från Settings till Integrations

-- Uppdatera befintliga rader med default-värden
UPDATE user_ai_settings
SET 
  default_model = COALESCE(default_model, 'google/gemini-2.5-flash'),
  use_system_fallback = COALESCE(use_system_fallback, true),
  updated_at = NOW()
WHERE default_model IS NULL OR use_system_fallback IS NULL;

-- Logga migrering
DO $$ 
BEGIN 
  RAISE NOTICE 'AI settings consolidated - all users have default values';
  RAISE NOTICE 'Note: AI configuration is now exclusively in Dashboard → Integrationer → AI-tab';
END $$;