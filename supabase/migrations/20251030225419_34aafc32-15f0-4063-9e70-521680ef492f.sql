-- Enable Realtime for review_insights and review_analysis_queue tables
ALTER TABLE review_insights REPLICA IDENTITY FULL;
ALTER TABLE review_analysis_queue REPLICA IDENTITY FULL;

-- Add tables to Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE review_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE review_analysis_queue;