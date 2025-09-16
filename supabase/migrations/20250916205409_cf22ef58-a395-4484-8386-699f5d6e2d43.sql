-- Add violations column to store detailed rule violations
ALTER TABLE public.calls 
ADD COLUMN violations JSONB DEFAULT '[]'::jsonb;