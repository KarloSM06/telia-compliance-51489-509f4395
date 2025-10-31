-- ============================================
-- COMPLETE PERFORMANCE OPTIMIZATION - CORRECTED
-- Fixes all 59 performance issues
-- ============================================

-- 1. ai_consultations - Optimize auth.uid() in subquery
DROP POLICY IF EXISTS "Users view own consultations" ON ai_consultations;
CREATE POLICY "Users view own consultations" ON ai_consultations
  FOR SELECT USING (
    email = (SELECT users.email FROM auth.users WHERE users.id = (select auth.uid()))::text
  );

-- Remove redundant policy
DROP POLICY IF EXISTS "Users can view AI consultations" ON ai_consultations;

-- 2. sync_logs
DROP POLICY IF EXISTS "Users can view their own sync logs" ON sync_logs;
CREATE POLICY "Users can view their own sync logs" ON sync_logs
  FOR SELECT USING (
    calendar_event_id IN (
      SELECT id FROM calendar_events WHERE user_id = (select auth.uid())
    )
  );

-- 3. message_templates
DROP POLICY IF EXISTS "Users can delete own templates" ON message_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON message_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON message_templates;
DROP POLICY IF EXISTS "Users can view own templates" ON message_templates;

CREATE POLICY "Users can delete own templates" ON message_templates
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own templates" ON message_templates
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own templates" ON message_templates
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own templates" ON message_templates
  FOR SELECT USING (user_id = (select auth.uid()));

-- 4. scheduled_messages
DROP POLICY IF EXISTS "Users can delete own scheduled messages" ON scheduled_messages;
DROP POLICY IF EXISTS "Users can insert own scheduled messages" ON scheduled_messages;
DROP POLICY IF EXISTS "Users can update own scheduled messages" ON scheduled_messages;
DROP POLICY IF EXISTS "Users can view own scheduled messages" ON scheduled_messages;

CREATE POLICY "Users can delete own scheduled messages" ON scheduled_messages
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own scheduled messages" ON scheduled_messages
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own scheduled messages" ON scheduled_messages
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own scheduled messages" ON scheduled_messages
  FOR SELECT USING (user_id = (select auth.uid()));

-- 5. message_logs
DROP POLICY IF EXISTS "System can insert message logs" ON message_logs;
DROP POLICY IF EXISTS "Users can view own message logs" ON message_logs;

CREATE POLICY "System can insert message logs" ON message_logs
  FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);
CREATE POLICY "Users can view own message logs" ON message_logs
  FOR SELECT USING (user_id = (select auth.uid()));

-- 6. reminder_settings
DROP POLICY IF EXISTS "Users can insert own reminder settings" ON reminder_settings;
DROP POLICY IF EXISTS "Users can update own reminder settings" ON reminder_settings;
DROP POLICY IF EXISTS "Users can view own reminder settings" ON reminder_settings;

CREATE POLICY "Users can insert own reminder settings" ON reminder_settings
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own reminder settings" ON reminder_settings
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own reminder settings" ON reminder_settings
  FOR SELECT USING (user_id = (select auth.uid()));

-- 7. owner_notifications
DROP POLICY IF EXISTS "System can insert notifications" ON owner_notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON owner_notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON owner_notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON owner_notifications;

CREATE POLICY "System can insert notifications" ON owner_notifications
  FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);
CREATE POLICY "Users can delete own notifications" ON owner_notifications
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update own notifications" ON owner_notifications
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own notifications" ON owner_notifications
  FOR SELECT USING (user_id = (select auth.uid()));

-- 8. reviews
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own reviews" ON reviews
  FOR SELECT USING (user_id = (select auth.uid()));

-- 9. owner_notification_settings
DROP POLICY IF EXISTS "Users can delete own notification settings" ON owner_notification_settings;
DROP POLICY IF EXISTS "Users can insert own notification settings" ON owner_notification_settings;
DROP POLICY IF EXISTS "Users can update own notification settings" ON owner_notification_settings;
DROP POLICY IF EXISTS "Users can view own notification settings" ON owner_notification_settings;

CREATE POLICY "Users can delete own notification settings" ON owner_notification_settings
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own notification settings" ON owner_notification_settings
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own notification settings" ON owner_notification_settings
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own notification settings" ON owner_notification_settings
  FOR SELECT USING (user_id = (select auth.uid()));

-- 10. notification_recipients
DROP POLICY IF EXISTS "Users can delete own recipients" ON notification_recipients;
DROP POLICY IF EXISTS "Users can insert own recipients" ON notification_recipients;
DROP POLICY IF EXISTS "Users can update own recipients" ON notification_recipients;
DROP POLICY IF EXISTS "Users can view own recipients" ON notification_recipients;

CREATE POLICY "Users can delete own recipients" ON notification_recipients
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own recipients" ON notification_recipients
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own recipients" ON notification_recipients
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own recipients" ON notification_recipients
  FOR SELECT USING (user_id = (select auth.uid()));

-- 11. telephony_accounts
DROP POLICY IF EXISTS "Users can delete own accounts" ON telephony_accounts;
DROP POLICY IF EXISTS "Users can insert own accounts" ON telephony_accounts;
DROP POLICY IF EXISTS "Users can update own accounts" ON telephony_accounts;
DROP POLICY IF EXISTS "Users can view own accounts" ON telephony_accounts;

CREATE POLICY "Users can delete own accounts" ON telephony_accounts
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own accounts" ON telephony_accounts
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own accounts" ON telephony_accounts
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own accounts" ON telephony_accounts
  FOR SELECT USING (user_id = (select auth.uid()));

-- 12. telephony_events (använder user_id direkt)
DROP POLICY IF EXISTS "Users can insert own telephony events" ON telephony_events;
DROP POLICY IF EXISTS "Users can view own telephony events" ON telephony_events;

CREATE POLICY "Users can insert own telephony events" ON telephony_events
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can view own telephony events" ON telephony_events
  FOR SELECT USING (user_id = (select auth.uid()));

-- 13. telephony_attachments
DROP POLICY IF EXISTS "Users can view own attachments" ON telephony_attachments;
CREATE POLICY "Users can view own attachments" ON telephony_attachments
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM telephony_events WHERE user_id = (select auth.uid())
    )
  );

-- 14. telephony_metrics_snapshots
DROP POLICY IF EXISTS "Users can view own metrics" ON telephony_metrics_snapshots;
CREATE POLICY "Users can view own metrics" ON telephony_metrics_snapshots
  FOR SELECT USING (
    account_id IN (SELECT id FROM telephony_accounts WHERE user_id = (select auth.uid()))
  );

-- 15. user_api_keys
DROP POLICY IF EXISTS "Users can create own API keys" ON user_api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON user_api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON user_api_keys;
DROP POLICY IF EXISTS "Users can view own API keys" ON user_api_keys;

CREATE POLICY "Users can create own API keys" ON user_api_keys
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can delete own API keys" ON user_api_keys
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can update own API keys" ON user_api_keys
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own API keys" ON user_api_keys
  FOR SELECT USING (user_id = (select auth.uid()));

-- 16. telephony_webhook_logs
DROP POLICY IF EXISTS "Users can view own webhook logs" ON telephony_webhook_logs;
CREATE POLICY "Users can view own webhook logs" ON telephony_webhook_logs
  FOR SELECT USING (user_id = (select auth.uid()));

-- 17. telephony_sync_jobs
DROP POLICY IF EXISTS "Users can view own sync jobs" ON telephony_sync_jobs;
CREATE POLICY "Users can view own sync jobs" ON telephony_sync_jobs
  FOR SELECT USING (user_id = (select auth.uid()));

-- 18. telephony_media
DROP POLICY IF EXISTS "Users can view their own media" ON telephony_media;
CREATE POLICY "Users can view their own media" ON telephony_media
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM telephony_events WHERE user_id = (select auth.uid())
    )
  );

-- 19. call_events
DROP POLICY IF EXISTS "Users can view own call events" ON call_events;
CREATE POLICY "Users can view own call events" ON call_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM telephony_events te
      JOIN integrations i ON te.integration_id = i.id
      WHERE te.id = call_events.call_id
      AND i.user_id = (select auth.uid())
    )
  );

-- 20. provider_sync_status
DROP POLICY IF EXISTS "Users can delete own sync status" ON provider_sync_status;
DROP POLICY IF EXISTS "Users can insert own sync status" ON provider_sync_status;
DROP POLICY IF EXISTS "Users can update own sync status" ON provider_sync_status;
DROP POLICY IF EXISTS "Users can view own sync status" ON provider_sync_status;

CREATE POLICY "Users can delete own sync status" ON provider_sync_status
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own sync status" ON provider_sync_status
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own sync status" ON provider_sync_status
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own sync status" ON provider_sync_status
  FOR SELECT USING (user_id = (select auth.uid()));

-- 21. webhooks_received
DROP POLICY IF EXISTS "Users can view own webhook logs" ON webhooks_received;
CREATE POLICY "Users can view own webhook logs" ON webhooks_received
  FOR SELECT USING (user_id = (select auth.uid()));

-- 22. phone_numbers_duplicate
DROP POLICY IF EXISTS "Users can delete own phone numbers" ON phone_numbers_duplicate;
DROP POLICY IF EXISTS "Users can insert own phone numbers" ON phone_numbers_duplicate;
DROP POLICY IF EXISTS "Users can update own phone numbers" ON phone_numbers_duplicate;
DROP POLICY IF EXISTS "Users can view own phone numbers" ON phone_numbers_duplicate;

CREATE POLICY "Users can delete own phone numbers" ON phone_numbers_duplicate
  FOR DELETE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can insert own phone numbers" ON phone_numbers_duplicate
  FOR INSERT WITH CHECK (user_id = (select auth.uid()));
CREATE POLICY "Users can update own phone numbers" ON phone_numbers_duplicate
  FOR UPDATE USING (user_id = (select auth.uid()));
CREATE POLICY "Users can view own phone numbers" ON phone_numbers_duplicate
  FOR SELECT USING (user_id = (select auth.uid()));