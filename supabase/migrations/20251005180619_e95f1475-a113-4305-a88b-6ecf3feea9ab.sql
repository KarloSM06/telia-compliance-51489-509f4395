-- Make file_path nullable since we won't store audio files permanently
ALTER TABLE public.calls 
ALTER COLUMN file_path DROP NOT NULL;

-- Add comment to clarify the new behavior
COMMENT ON COLUMN public.calls.file_path IS 'File path is null after audio file is deleted post-analysis';

-- Add index for efficient deletion scheduling queries
CREATE INDEX IF NOT EXISTS idx_calls_deletion_scheduled 
ON public.calls(deletion_scheduled_at) 
WHERE deletion_scheduled_at IS NOT NULL;