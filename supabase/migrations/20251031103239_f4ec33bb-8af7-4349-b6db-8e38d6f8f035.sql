-- ====================================
-- REMOVE 80 UNUSED INDEXES
-- Based on Supabase Performance Linter recommendations
-- These indexes have never been used and can safely be removed
-- This improves write performance and reduces storage costs
-- ====================================

-- Calendar Events (9 indexes)
DROP INDEX IF EXISTS public.idx_calendar_events_booking_system_integration_id_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_created_by_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_lead_id_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_organization_id_fkey;
DROP INDEX IF EXISTS public.idx_calendar_events_lead_id;
DROP INDEX IF EXISTS public.idx_calendar_events_sync_state;
DROP INDEX IF EXISTS public.idx_calendar_events_source_external_id;
DROP INDEX IF EXISTS public.idx_calendar_events_integration_id;

-- Leads (5 indexes)
DROP INDEX IF EXISTS public.idx_leads_organization_id;
DROP INDEX IF EXISTS public.idx_leads_prospect_id;
DROP INDEX IF EXISTS public.idx_leads_business_id;
DROP INDEX IF EXISTS public.idx_leads_city;
DROP INDEX IF EXISTS public.idx_leads_linkedin;

-- Integrations (5 indexes)
DROP INDEX IF EXISTS public.idx_integrations_organization_id;
DROP INDEX IF EXISTS public.idx_integrations_user_id;
DROP INDEX IF EXISTS public.idx_integrations_capabilities;
DROP INDEX IF EXISTS public.idx_integrations_active;
DROP INDEX IF EXISTS public.idx_integrations_webhook_token;

-- Message Logs (6 indexes)
DROP INDEX IF EXISTS public.idx_message_logs_integration_id;
DROP INDEX IF EXISTS public.idx_message_logs_scheduled_message_id;
DROP INDEX IF EXISTS public.idx_message_logs_sms_provider_settings_id;
DROP INDEX IF EXISTS public.idx_message_logs_direction;
DROP INDEX IF EXISTS public.idx_message_logs_message_type;
DROP INDEX IF EXISTS public.idx_message_logs_message_source;

-- Telephony Events (4 indexes)
DROP INDEX IF EXISTS public.idx_telephony_events_lead_id;
DROP INDEX IF EXISTS public.idx_telephony_events_resource_type;
DROP INDEX IF EXISTS public.idx_telephony_events_processing_status;
DROP INDEX IF EXISTS public.idx_telephony_events_agent;

-- Webhooks Received (4 indexes)
DROP INDEX IF EXISTS public.idx_webhooks_received_provider_event;
DROP INDEX IF EXISTS public.idx_webhooks_received_idempotency;
DROP INDEX IF EXISTS public.idx_webhooks_received_processed;
DROP INDEX IF EXISTS public.idx_webhooks_received_user;

-- Reminder Settings (4 indexes)
DROP INDEX IF EXISTS public.idx_reminder_settings_default_template_confirmation;
DROP INDEX IF EXISTS public.idx_reminder_settings_default_template_reminder;
DROP INDEX IF EXISTS public.idx_reminder_settings_default_template_review;
DROP INDEX IF EXISTS public.idx_reminder_settings_organization_id;

-- Call Events (3 indexes)
DROP INDEX IF EXISTS public.idx_call_events_call;
DROP INDEX IF EXISTS public.idx_call_events_agent;
DROP INDEX IF EXISTS public.idx_call_events_timestamp;

-- Customer Preferences (2 indexes)
DROP INDEX IF EXISTS public.idx_customer_preferences_email;
DROP INDEX IF EXISTS public.idx_customer_preferences_token;

-- Dashboard Shares (2 indexes)
DROP INDEX IF EXISTS public.idx_dashboard_shares_dashboard_id;
DROP INDEX IF EXISTS public.idx_dashboard_shares_shared_with_user_id;

-- Message Templates (2 indexes)
DROP INDEX IF EXISTS public.idx_message_templates_organization_id;
DROP INDEX IF EXISTS public.idx_message_templates_user_id;

-- Notification Recipients (2 indexes)
DROP INDEX IF EXISTS public.idx_notification_recipients_organization_id;
DROP INDEX IF EXISTS public.idx_notification_recipients_active;

-- Phone Numbers (2 indexes)
DROP INDEX IF EXISTS public.idx_phone_numbers_user_id_fkey;
DROP INDEX IF EXISTS public.idx_phone_numbers_integration;

-- Profiles (2 indexes)
DROP INDEX IF EXISTS public.idx_profiles_timezone;
DROP INDEX IF EXISTS public.idx_profiles_webhook;

-- Provider Sync Status (2 indexes)
DROP INDEX IF EXISTS public.idx_provider_sync_status_health;
DROP INDEX IF EXISTS public.idx_provider_sync_status_next_retry;

-- Review Analysis Queue (2 indexes)
DROP INDEX IF EXISTS public.idx_analysis_queue_pending;
DROP INDEX IF EXISTS public.idx_review_analysis_queue_user_id;

-- Telephony Sync Jobs (2 indexes)
DROP INDEX IF EXISTS public.idx_telephony_sync_jobs_status;
DROP INDEX IF EXISTS public.idx_telephony_sync_jobs_user_id;

-- Booking System Integrations (1 index)
DROP INDEX IF EXISTS public.idx_booking_system_integrations_organization_id_fkey;

-- Calls (1 index)
DROP INDEX IF EXISTS public.idx_calls_user_id_fkey;

-- Data Access Log (1 index)
DROP INDEX IF EXISTS public.idx_data_access_log_user_id_fkey;

-- Leaddesk Agent Mapping (1 index)
DROP INDEX IF EXISTS public.idx_leaddesk_agent_mapping_user_id_fkey;

-- Team Members (1 index)
DROP INDEX IF EXISTS public.idx_team_members_invited_by_fkey;

-- Widget Templates (1 index)
DROP INDEX IF EXISTS public.idx_widget_templates_creator_id_fkey;

-- Availability Slots (1 index)
DROP INDEX IF EXISTS public.idx_availability_slots_timezone;

-- Reviews (1 index)
DROP INDEX IF EXISTS public.idx_reviews_topics;

-- Sync Logs (1 index)
DROP INDEX IF EXISTS public.idx_sync_logs_status;

-- Booking Sync Queue (1 index)
DROP INDEX IF EXISTS public.idx_sync_queue_next_retry;

-- Conversion Funnel Metrics (1 index)
DROP INDEX IF EXISTS public.idx_conversion_funnel_metrics_organization_id;

-- Dashboard Widgets (1 index)
DROP INDEX IF EXISTS public.idx_dashboard_widgets_dashboard_id;

-- Dashboards (1 index)
DROP INDEX IF EXISTS public.idx_dashboards_user_id;

-- Lead Activities (1 index)
DROP INDEX IF EXISTS public.idx_lead_activities_user_id;

-- Lead Searches (1 index)
DROP INDEX IF EXISTS public.idx_lead_searches_organization_id;

-- Owner Notification Settings (1 index)
DROP INDEX IF EXISTS public.idx_owner_notification_settings_organization_id;

-- Owner Notifications (1 index)
DROP INDEX IF EXISTS public.idx_owner_notifications_calendar_event_id;

-- Scheduled Messages (1 index)
DROP INDEX IF EXISTS public.idx_scheduled_messages_template_id;

-- Settings Audit Log (1 index)
DROP INDEX IF EXISTS public.idx_settings_audit_log_user_id;

-- Telephony Accounts (1 index)
DROP INDEX IF EXISTS public.idx_telephony_accounts_organization_id;

-- Telephony Metrics Snapshots (1 index)
DROP INDEX IF EXISTS public.idx_telephony_metrics_date;

-- Telephony Webhook Logs (1 index)
DROP INDEX IF EXISTS public.idx_webhook_logs_user;

-- Telephony Media (1 index)
DROP INDEX IF EXISTS public.idx_telephony_media_download_status;