-- Add unique constraint to prevent duplicates
ALTER TABLE user_ai_settings 
DROP CONSTRAINT IF EXISTS user_ai_settings_user_id_unique;

ALTER TABLE user_ai_settings 
ADD CONSTRAINT user_ai_settings_user_id_unique 
UNIQUE (user_id);

-- Add updated_at column
ALTER TABLE user_ai_settings 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_user_ai_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS user_ai_settings_updated_at_trigger ON user_ai_settings;

CREATE TRIGGER user_ai_settings_updated_at_trigger
BEFORE UPDATE ON user_ai_settings
FOR EACH ROW
EXECUTE FUNCTION update_user_ai_settings_updated_at();