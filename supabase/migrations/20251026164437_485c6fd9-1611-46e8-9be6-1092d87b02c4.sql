-- Konvertera calendar_events start_time och end_time från TIMESTAMPTZ till TEXT med offset

-- Steg 1: Skapa temporära kolumner för lokal tid med offset
ALTER TABLE calendar_events 
  ADD COLUMN start_time_text TEXT,
  ADD COLUMN end_time_text TEXT;

-- Steg 2: Migrera befintlig data (konvertera UTC till lokal tid med offset)
-- Format: "2025-10-26T08:00:00+01:00"
UPDATE calendar_events SET
  start_time_text = to_char(
    start_time AT TIME ZONE COALESCE(timezone, 'Europe/Stockholm'),
    'YYYY-MM-DD"T"HH24:MI:SSOF'
  ),
  end_time_text = to_char(
    end_time AT TIME ZONE COALESCE(timezone, 'Europe/Stockholm'),
    'YYYY-MM-DD"T"HH24:MI:SSOF'
  );

-- Steg 3: Ta bort gamla TIMESTAMPTZ-kolumner
ALTER TABLE calendar_events 
  DROP COLUMN start_time,
  DROP COLUMN end_time;

-- Steg 4: Byt namn på nya kolumner till start_time och end_time
ALTER TABLE calendar_events 
  RENAME COLUMN start_time_text TO start_time;
ALTER TABLE calendar_events 
  RENAME COLUMN end_time_text TO end_time;

-- Steg 5: Lägg till NOT NULL constraint
ALTER TABLE calendar_events 
  ALTER COLUMN start_time SET NOT NULL,
  ALTER COLUMN end_time SET NOT NULL;