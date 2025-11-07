-- Add source column to bookings table to track form origin
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'website_form';

-- Add comment for documentation
COMMENT ON COLUMN bookings.source IS 'Tracks which form/source created the booking: enterprise_contact, krono_quote, ai_consultation, website_form';

-- Update existing records based on bokningstyp
UPDATE bookings 
SET source = CASE 
  WHEN bokningstyp = 'enterprise_quote' THEN 'enterprise_contact'
  WHEN bokningstyp = 'krono_quote' THEN 'krono_quote'
  ELSE 'website_form'
END
WHERE source = 'website_form';