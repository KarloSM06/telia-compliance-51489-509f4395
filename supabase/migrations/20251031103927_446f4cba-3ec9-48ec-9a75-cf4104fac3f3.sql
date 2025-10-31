-- Add indexes for all unindexed foreign keys to improve query performance
-- Based on Supabase Performance Linter recommendations
-- This migration adds 44 indexes for foreign key columns

-- booking_system_integrations
CREATE INDEX IF NOT EXISTS idx_booking_system_integrations_organization_id_fkey 
  ON booking_system_integrations(organization_id);

-- calendar_events (5 indexes)
CREATE INDEX IF NOT EXISTS idx_calendar_events_booking_system_integration_id_fkey 
  ON calendar_events(booking_system_integration_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by_fkey 
  ON calendar_events(created_by);
CREATE INDEX IF NOT EXISTS idx_calendar_events_integration_id_fkey 
  ON calendar_events(integration_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_lead_id_fkey 
  ON calendar_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_organization_id_fkey 
  ON calendar_events(organization_id);

-- call_events
CREATE INDEX IF NOT EXISTS idx_call_events_agent_id_fkey 
  ON call_events(agent_id);

-- calls
CREATE INDEX IF NOT EXISTS idx_calls_user_id_fkey 
  ON calls(user_id);

-- conversion_funnel_metrics
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_metrics_organization_id_fkey 
  ON conversion_funnel_metrics(organization_id);

-- dashboard_shares
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_dashboard_id_fkey 
  ON dashboard_shares(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_shared_with_user_id_fkey 
  ON dashboard_shares(shared_with_user_id);

-- dashboard_widgets
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id_fkey 
  ON dashboard_widgets(dashboard_id);

-- dashboards
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id_fkey 
  ON dashboards(user_id);

-- data_access_log
CREATE INDEX IF NOT EXISTS idx_data_access_log_user_id_fkey 
  ON data_access_log(user_id);

-- integrations
CREATE INDEX IF NOT EXISTS idx_integrations_organization_id_fkey 
  ON integrations(organization_id);

-- lead_activities
CREATE INDEX IF NOT EXISTS idx_lead_activities_user_id_fkey 
  ON lead_activities(user_id);

-- lead_searches
CREATE INDEX IF NOT EXISTS idx_lead_searches_organization_id_fkey 
  ON lead_searches(organization_id);

-- leaddesk_agent_mapping
CREATE INDEX IF NOT EXISTS idx_leaddesk_agent_mapping_user_id_fkey 
  ON leaddesk_agent_mapping(user_id);

-- leads
CREATE INDEX IF NOT EXISTS idx_leads_organization_id_fkey 
  ON leads(organization_id);

-- message_logs (3 indexes)
CREATE INDEX IF NOT EXISTS idx_message_logs_integration_id_fkey 
  ON message_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_scheduled_message_id_fkey 
  ON message_logs(scheduled_message_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_sms_provider_settings_id_fkey 
  ON message_logs(sms_provider_settings_id);

-- message_templates
CREATE INDEX IF NOT EXISTS idx_message_templates_organization_id_fkey 
  ON message_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_user_id_fkey 
  ON message_templates(user_id);

-- notification_recipients
CREATE INDEX IF NOT EXISTS idx_notification_recipients_organization_id_fkey 
  ON notification_recipients(organization_id);

-- owner_notification_settings
CREATE INDEX IF NOT EXISTS idx_owner_notification_settings_organization_id_fkey 
  ON owner_notification_settings(organization_id);

-- owner_notifications
CREATE INDEX IF NOT EXISTS idx_owner_notifications_calendar_event_id_fkey 
  ON owner_notifications(calendar_event_id);

-- phone_numbers
CREATE INDEX IF NOT EXISTS idx_phone_numbers_integration_id_fkey 
  ON phone_numbers(integration_id);
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id_fkey 
  ON phone_numbers(user_id);

-- reminder_settings (4 indexes)
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_confirmation_fkey 
  ON reminder_settings(default_template_confirmation);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_reminder_fkey 
  ON reminder_settings(default_template_reminder);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_review_fkey 
  ON reminder_settings(default_template_review);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_organization_id_fkey 
  ON reminder_settings(organization_id);

-- review_analysis_queue
CREATE INDEX IF NOT EXISTS idx_review_analysis_queue_user_id_fkey 
  ON review_analysis_queue(user_id);

-- scheduled_messages
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_template_id_fkey 
  ON scheduled_messages(template_id);

-- settings_audit_log
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_user_id_fkey 
  ON settings_audit_log(user_id);

-- team_members
CREATE INDEX IF NOT EXISTS idx_team_members_invited_by_fkey 
  ON team_members(invited_by);

-- telephony_accounts
CREATE INDEX IF NOT EXISTS idx_telephony_accounts_organization_id_fkey 
  ON telephony_accounts(organization_id);

-- telephony_events
CREATE INDEX IF NOT EXISTS idx_telephony_events_agent_id_fkey 
  ON telephony_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_telephony_events_lead_id_fkey 
  ON telephony_events(lead_id);

-- telephony_sync_jobs
CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_user_id_fkey 
  ON telephony_sync_jobs(user_id);

-- telephony_webhook_logs
CREATE INDEX IF NOT EXISTS idx_telephony_webhook_logs_user_id_fkey 
  ON telephony_webhook_logs(user_id);

-- webhooks_received
CREATE INDEX IF NOT EXISTS idx_webhooks_received_user_id_fkey 
  ON webhooks_received(user_id);

-- widget_templates
CREATE INDEX IF NOT EXISTS idx_widget_templates_creator_id_fkey 
  ON widget_templates(creator_id);