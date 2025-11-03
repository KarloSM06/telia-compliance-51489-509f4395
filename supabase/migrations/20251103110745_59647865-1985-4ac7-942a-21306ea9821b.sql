-- Add provisioning key column to user_ai_settings
ALTER TABLE user_ai_settings 
ADD COLUMN IF NOT EXISTS openrouter_provisioning_key_encrypted TEXT;

-- Add comment explaining the column
COMMENT ON COLUMN user_ai_settings.openrouter_provisioning_key_encrypted 
IS 'Encrypted OpenRouter provisioning key for accessing /api/v1/activity endpoint';