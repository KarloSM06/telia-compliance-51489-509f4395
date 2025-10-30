-- Create review analysis queue table
CREATE TABLE IF NOT EXISTS review_analysis_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  trigger_source TEXT CHECK (trigger_source IN ('manual', 'database', 'scheduled')),
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_queue_pending 
  ON review_analysis_queue(status, scheduled_for)
  WHERE status = 'pending';

-- RLS policies for analysis queue
ALTER TABLE review_analysis_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analysis jobs"
  ON review_analysis_queue FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all analysis jobs"
  ON review_analysis_queue FOR ALL
  USING (auth.role() = 'service_role');

-- Function to trigger review analysis
CREATE OR REPLACE FUNCTION trigger_review_analysis()
RETURNS TRIGGER AS $$
DECLARE
  last_analysis_time TIMESTAMPTZ;
  should_analyze BOOLEAN;
  queue_exists BOOLEAN;
BEGIN
  -- Check when last analysis was run for this user
  SELECT MAX(created_at) INTO last_analysis_time
  FROM review_insights
  WHERE user_id = NEW.user_id;
  
  -- Only run analysis if:
  -- 1. No analysis has been run before, OR
  -- 2. More than 1 hour has passed since last analysis
  should_analyze := (
    last_analysis_time IS NULL OR 
    (NOW() - last_analysis_time) > INTERVAL '1 hour'
  );
  
  IF should_analyze THEN
    -- Check if there's already a pending job for this user
    SELECT EXISTS(
      SELECT 1 FROM review_analysis_queue
      WHERE user_id = NEW.user_id 
        AND status IN ('pending', 'processing')
    ) INTO queue_exists;
    
    -- Only create new job if none exists
    IF NOT queue_exists THEN
      INSERT INTO review_analysis_queue (
        user_id,
        trigger_source,
        scheduled_for,
        status
      ) VALUES (
        NEW.user_id,
        'database',
        NOW() + INTERVAL '2 minutes', -- Wait 2 minutes to batch multiple changes
        'pending'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for reviews table
DROP TRIGGER IF EXISTS after_review_insert ON reviews;
CREATE TRIGGER after_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION trigger_review_analysis();

-- Trigger for message_logs (SMS/Email with review classification)
DROP TRIGGER IF EXISTS after_message_review_insert ON message_logs;
CREATE TRIGGER after_message_review_insert
  AFTER INSERT ON message_logs
  FOR EACH ROW
  WHEN (
    NEW.message_type = 'review' OR 
    (NEW.ai_classification IS NOT NULL AND NEW.ai_classification->>'category' = 'feedback')
  )
  EXECUTE FUNCTION trigger_review_analysis();

-- Trigger for telephony_events (with sentiment in metadata)
DROP TRIGGER IF EXISTS after_telephony_sentiment_insert ON telephony_events;
CREATE TRIGGER after_telephony_sentiment_insert
  AFTER INSERT ON telephony_events
  FOR EACH ROW
  WHEN (NEW.normalized IS NOT NULL AND NEW.normalized->>'sentiment' IS NOT NULL)
  EXECUTE FUNCTION trigger_review_analysis();