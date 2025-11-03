-- Ta bort eventuella duplicates (behåll första raden per user_id)
DELETE FROM user_ai_settings a
USING user_ai_settings b
WHERE a.id > b.id 
  AND a.user_id = b.user_id;

-- Lägg till unique constraint
ALTER TABLE user_ai_settings 
DROP CONSTRAINT IF EXISTS user_ai_settings_user_id_unique;

ALTER TABLE user_ai_settings 
ADD CONSTRAINT user_ai_settings_user_id_unique UNIQUE (user_id);

-- Skapa index för prestanda
CREATE INDEX IF NOT EXISTS idx_user_ai_settings_user_id 
ON user_ai_settings(user_id);