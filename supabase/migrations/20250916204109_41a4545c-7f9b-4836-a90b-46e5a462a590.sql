-- Remove any existing check constraint on status
ALTER TABLE public.calls DROP CONSTRAINT IF EXISTS calls_status_check;

-- Add new check constraint that allows all needed status values
ALTER TABLE public.calls 
ADD CONSTRAINT calls_status_check 
CHECK (status IN ('uploaded', 'processing', 'completed', 'error'));

-- Also fix the error in edge function where req.json() is called twice
-- This will prevent the "Body already consumed" error