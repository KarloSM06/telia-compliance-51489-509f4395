-- Enable realtime for message_logs table
ALTER TABLE message_logs REPLICA IDENTITY FULL;

-- Add message_logs to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE message_logs;