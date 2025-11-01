-- Create calendars table
CREATE TABLE calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_calendar_name UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;

-- RLS policies for calendars
CREATE POLICY "Users can view own calendars" ON calendars
  FOR SELECT USING (
    user_id = auth.uid() OR 
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can insert own calendars" ON calendars
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own calendars" ON calendars
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    organization_id = user_organization_id(auth.uid())
  );

CREATE POLICY "Users can delete own calendars" ON calendars
  FOR DELETE USING (user_id = auth.uid());

-- Trigger to ensure only one default calendar per user
CREATE OR REPLACE FUNCTION ensure_single_default_calendar()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE calendars
    SET is_default = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_ensure_single_default_calendar
  BEFORE INSERT OR UPDATE ON calendars
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_calendar();

-- Create default calendar for existing users with calendar events
INSERT INTO calendars (user_id, name, color, is_default, is_active)
SELECT DISTINCT user_id, 'Min Kalender', '#3b82f6', true, true
FROM calendar_events
ON CONFLICT (user_id, name) DO NOTHING;

-- Add calendar_id column to calendar_events
ALTER TABLE calendar_events
ADD COLUMN calendar_id UUID REFERENCES calendars(id) ON DELETE SET NULL;

-- Set default calendar for all existing events
UPDATE calendar_events ce
SET calendar_id = (
  SELECT c.id
  FROM calendars c
  WHERE c.user_id = ce.user_id
    AND c.is_default = true
  LIMIT 1
);

-- Create index for better performance
CREATE INDEX idx_calendar_events_calendar_id ON calendar_events(calendar_id);

-- Update trigger for calendars updated_at
CREATE TRIGGER update_calendars_updated_at
  BEFORE UPDATE ON calendars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();