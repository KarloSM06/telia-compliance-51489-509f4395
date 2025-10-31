-- Performance Optimization: Remove 44 unused indexes
-- These indexes are never used and only slow down INSERT/UPDATE/DELETE operations
-- Reference: Supabase Linter Report - unused_index warnings

-- Booking System Integrations (1 index)
DROP INDEX IF EXISTS public.idx_booking_system_integrations_organization_id_fkey;

-- Calendar Events (5 indexes)
DROP INDEX IF EXISTS public.idx_calendar_events_booking_system_integration_id_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_created_by_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_integration_id_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_lead_id_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_organization_id_fkey;

-- Call Events (1 index)
DROP INDEX IF EXISTS public.idx_call_events_agent_id_fkey;

-- Calls (1 index)
DROP INDEX IF EXISTS public.idx_calls_user_id_fkey;

-- Conversion Funnel Metrics (1 index)
DROP INDEX IF EXISTS public.idx_conversion_funnel_metrics_organization_id_fkey;

-- Dashboard Shares (2 indexes)
DROP INDEX IF EXISTS public.idx_dashboard_shares_dashboard_id_fkey;
DROP INDEX IF EXISTS public.idx_dashboard_shares_shared_with_user_id_fkey;

-- Dashboard Widgets (1 index)
DROP INDEX IF EXISTS public.idx_dashboard_widgets_dashboard_id_fkey;

-- Dashboards (1 index)
DROP INDEX IF EXISTS public.idx_dashboards_user_id_fkey;

-- Data Access Log (1 index)
DROP INDEX IF EXISTS public.idx_data_access_log_user_id_fkey;

-- Integrations (1 index)
DROP INDEX IF EXISTS public.idx_integrations_organization_id_fkey;

-- Lead Activities (1 index)
DROP INDEX IF EXISTS public.idx_lead_activities_user_id_fkey;

-- Lead Searches (1 index)
DROP INDEX IF EXISTS public.idx_lead_searches_organization_id_fkey;

-- Leaddesk Agent Mapping (1 index)
DROP INDEX IF EXISTS public.idx_leaddesk_agent_mapping_user_id_fkey;

-- Leads (1 index)
DROP INDEX IF EXISTS public.idx_leads_organization_id_fkey;

-- Message Logs (3 indexes)
DROP INDEX IF EXISTS public.idx_message_logs_integration_id_fkey;
DROP INDEX IF EXISTS public.idx_message_logs_scheduled_message_id_fkey;
DROP INDEX IF EXISTS public.idx_message_logs_sms_provider_settings_id_fkey;

-- Message Templates (2 indexes)
DROP INDEX IF EXISTS public.idx_message_templates_organization_id_fkey;
DROP INDEX IF EXISTS public.idx_message_templates_user_id_fkey;

-- Notification Recipients (1 index)
DROP INDEX IF EXISTS public.idx_notification_recipients_organization_id_fkey;

-- Owner Notification Settings (1 index)
DROP INDEX IF EXISTS public.idx_owner_notification_settings_organization_id_fkey;

-- Owner Notifications (1 index)
DROP INDEX IF EXISTS public.idx_owner_notifications_calendar_event_id_fkey;

-- Phone Numbers (2 indexes)
DROP INDEX IF EXISTS public.idx_phone_numbers_integration_id_fkey;
DROP INDEX IF EXISTS public.idx_phone_numbers_user_id_fkey;

-- Reminder Settings (4 indexes)
DROP INDEX IF EXISTS public.idx_reminder_settings_default_template_confirmation_fkey;
DROP INDEX IF EXISTS public.idx_reminder_settings_default_template_reminder_fkey;
DROP INDEX IF EXISTS public.idx_reminder_settings_default_template_review_fkey;
DROP INDEX IF EXISTS public.idx_reminder_settings_organization_id_fkey;

-- Review Analysis Queue (1 index)
DROP INDEX IF EXISTS public.idx_review_analysis_queue_user_id_fkey;

-- Scheduled Messages (1 index)
DROP INDEX IF EXISTS public.idx_scheduled_messages_template_id_fkey;

-- Settings Audit Log (1 index)
DROP INDEX IF EXISTS public.idx_settings_audit_log_user_id_fkey;

-- Team Members (1 index)
DROP INDEX IF EXISTS public.idx_team_members_invited_by_fkey;

-- Telephony Accounts (1 index)
DROP INDEX IF EXISTS public.idx_telephony_accounts_organization_id_fkey;

-- Telephony Events (2 indexes)
DROP INDEX IF EXISTS public.idx_telephony_events_agent_id_fkey;
DROP INDEX IF EXISTS public.idx_telephony_events_lead_id_fkey;

-- Telephony Sync Jobs (1 index)
DROP INDEX IF EXISTS public.idx_telephony_sync_jobs_user_id_fkey;

-- Telephony Webhook Logs (1 index)
DROP INDEX IF EXISTS public.idx_telephony_webhook_logs_user_id_fkey;

-- Webhooks Received (1 index)
DROP INDEX IF EXISTS public.idx_webhooks_received_user_id_fkey;

-- Widget Templates (1 index)
DROP INDEX IF EXISTS public.idx_widget_templates_creator_id_fkey;