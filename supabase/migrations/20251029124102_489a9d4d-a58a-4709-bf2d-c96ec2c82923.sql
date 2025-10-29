-- Migration: Replace account_id with user_id as primary reference
-- This migration simplifies the telephony data model to use user_id consistently

-- ============================================
-- STEP 1: Drop ALL dependent policies first
-- ============================================

-- Drop policies from telephony_events
DROP POLICY IF EXISTS "Users can view own events" ON telephony_events;
DROP POLICY IF EXISTS "Users can view own call events" ON telephony_events;

-- Drop policies from telephony_attachments
DROP POLICY IF EXISTS "Users can view own attachments" ON telephony_attachments;

-- Drop policies from telephony_media
DROP POLICY IF EXISTS "Users can view their own media" ON telephony_media;

-- Drop policies from telephony_sync_jobs
DROP POLICY IF EXISTS "Users can view their own sync jobs" ON telephony_sync_jobs;
DROP POLICY IF EXISTS "Users can view own sync jobs" ON telephony_sync_jobs;

-- ============================================
-- STEP 2: Update telephony_events table
-- ============================================

-- Drop account_id column now that dependencies are removed
ALTER TABLE telephony_events DROP COLUMN IF EXISTS account_id;

-- Ensure user_id is NOT NULL and indexed
ALTER TABLE telephony_events 
  ALTER COLUMN user_id SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_telephony_events_user_id 
  ON telephony_events(user_id);

CREATE INDEX IF NOT EXISTS idx_telephony_events_integration_id 
  ON telephony_events(integration_id);

-- ============================================
-- STEP 3: Update telephony_sync_jobs table
-- ============================================

-- Copy any data from account_id to integration_id if integration_id is null
UPDATE telephony_sync_jobs
SET integration_id = account_id
WHERE integration_id IS NULL AND account_id IS NOT NULL;

-- Drop account_id column from telephony_sync_jobs
ALTER TABLE telephony_sync_jobs DROP COLUMN IF EXISTS account_id;

-- Add user_id column if it doesn't exist
ALTER TABLE telephony_sync_jobs 
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Populate user_id from integrations table
UPDATE telephony_sync_jobs tsj
SET user_id = i.user_id
FROM integrations i
WHERE tsj.integration_id = i.id
AND tsj.user_id IS NULL;

-- Make user_id NOT NULL after data is populated (only if there is data)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM telephony_sync_jobs WHERE user_id IS NOT NULL) 
     OR NOT EXISTS (SELECT 1 FROM telephony_sync_jobs) THEN
    ALTER TABLE telephony_sync_jobs ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_user_id 
  ON telephony_sync_jobs(user_id);

CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_integration_id 
  ON telephony_sync_jobs(integration_id);

-- ============================================
-- STEP 4: Create new RLS Policies
-- ============================================

-- Enable RLS on telephony_sync_jobs if not already enabled
ALTER TABLE telephony_sync_jobs ENABLE ROW LEVEL SECURITY;

-- Create new policies for telephony_events (based on user_id)
CREATE POLICY "Users can view own telephony events"
  ON telephony_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own telephony events"
  ON telephony_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can manage all telephony events"
  ON telephony_events
  FOR ALL
  TO service_role
  USING (true);

-- Create new policies for telephony_attachments (join through telephony_events using user_id)
CREATE POLICY "Users can view own attachments"
  ON telephony_attachments
  FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM telephony_events WHERE user_id = auth.uid()
    )
  );

-- Create new policies for telephony_media (join through telephony_events using user_id)
CREATE POLICY "Users can view their own media"
  ON telephony_media
  FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM telephony_events WHERE user_id = auth.uid()
    )
  );

-- Create policies for telephony_sync_jobs (based on user_id)
CREATE POLICY "Users can view own sync jobs"
  ON telephony_sync_jobs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all sync jobs"
  ON telephony_sync_jobs
  FOR ALL
  TO service_role
  USING (true);