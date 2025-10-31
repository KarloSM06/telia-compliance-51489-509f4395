-- Strategic Foreign Key Index Implementation
-- Note: CONCURRENTLY removed to allow execution in transaction block (standard for Supabase)
-- Tier 1: Critical for performance (12 indexes)

-- Integration lookups (used in ALL telephony/calendar/message queries)
CREATE INDEX IF NOT EXISTS idx_calendar_events_integration_id 
ON public.calendar_events (integration_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_booking_system_integration_id 
ON public.calendar_events (booking_system_integration_id);

CREATE INDEX IF NOT EXISTS idx_telephony_events_integration_id 
ON public.telephony_events (integration_id);

CREATE INDEX IF NOT EXISTS idx_message_logs_integration_id 
ON public.message_logs (integration_id);

CREATE INDEX IF NOT EXISTS idx_phone_numbers_integration_id 
ON public.phone_numbers (integration_id);

-- Lead connections (used in event filtering and JOIN operations)
CREATE INDEX IF NOT EXISTS idx_calendar_events_lead_id 
ON public.calendar_events (lead_id);

CREATE INDEX IF NOT EXISTS idx_telephony_events_lead_id 
ON public.telephony_events (lead_id);

CREATE INDEX IF NOT EXISTS idx_telephony_events_agent_id 
ON public.telephony_events (agent_id);

-- Organization filtering (used in RLS policies and multi-tenant queries)
CREATE INDEX IF NOT EXISTS idx_leads_organization_id 
ON public.leads (organization_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_organization_id 
ON public.calendar_events (organization_id);

CREATE INDEX IF NOT EXISTS idx_integrations_organization_id 
ON public.integrations (organization_id);

CREATE INDEX IF NOT EXISTS idx_booking_system_integrations_organization_id 
ON public.booking_system_integrations (organization_id);

-- Tier 2: Parent-child enforcement (8 indexes)

-- Dashboard hierarchy (used during dashboard DELETE)
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id 
ON public.dashboard_widgets (dashboard_id);

CREATE INDEX IF NOT EXISTS idx_dashboard_shares_dashboard_id 
ON public.dashboard_shares (dashboard_id);

-- User relations (used in RLS and during user cleanup)
CREATE INDEX IF NOT EXISTS idx_data_access_log_user_id 
ON public.data_access_log (user_id);

CREATE INDEX IF NOT EXISTS idx_lead_activities_user_id 
ON public.lead_activities (user_id);

CREATE INDEX IF NOT EXISTS idx_leaddesk_agent_mapping_user_id 
ON public.leaddesk_agent_mapping (user_id);

CREATE INDEX IF NOT EXISTS idx_telephony_sync_jobs_user_id 
ON public.telephony_sync_jobs (user_id);

-- Message chain (used during template DELETE and scheduling)
CREATE INDEX IF NOT EXISTS idx_message_logs_scheduled_message_id 
ON public.message_logs (scheduled_message_id);

CREATE INDEX IF NOT EXISTS idx_scheduled_messages_template_id 
ON public.scheduled_messages (template_id);

-- Tier 3: Composite indexes for common query patterns (4 indexes)

-- Used in queries: WHERE organization_id = X AND status = Y
CREATE INDEX IF NOT EXISTS idx_leads_org_status 
ON public.leads (organization_id, status);

-- Used in queries: WHERE user_id = X ORDER BY start_time
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_time 
ON public.calendar_events (user_id, start_time);

-- Used in queries: WHERE integration_id = X AND event_type = Y
CREATE INDEX IF NOT EXISTS idx_telephony_events_int_type 
ON public.telephony_events (integration_id, event_type);

-- Used in queries: WHERE user_id = X AND lead_type = Y
CREATE INDEX IF NOT EXISTS idx_leads_user_type 
ON public.leads (user_id, lead_type);