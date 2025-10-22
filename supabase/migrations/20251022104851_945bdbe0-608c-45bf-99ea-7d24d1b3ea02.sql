-- Performance Optimization: Add missing foreign key indexes and remove unused indexes
-- Note: Standard index creation (without CONCURRENTLY) is used for migration compatibility

-- ============================================================================
-- PHASE 1: Add Missing Foreign Key Indexes (Critical for JOIN and RLS performance)
-- ============================================================================

-- Booking System Integrations
CREATE INDEX IF NOT EXISTS idx_booking_sync_queue_integration_id_fkey 
ON public.booking_sync_queue(integration_id);

CREATE INDEX IF NOT EXISTS idx_booking_system_integrations_organization_id_fkey 
ON public.booking_system_integrations(organization_id);

CREATE INDEX IF NOT EXISTS idx_booking_webhooks_integration_id_fkey 
ON public.booking_webhooks(integration_id);

-- Calendar Events (multiple foreign keys)
CREATE INDEX IF NOT EXISTS idx_calendar_events_booking_system_integration_id_fkey 
ON public.calendar_events(booking_system_integration_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by_fkey 
ON public.calendar_events(created_by);

CREATE INDEX IF NOT EXISTS idx_calendar_events_lead_id_fkey 
ON public.calendar_events(lead_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_organization_id_fkey 
ON public.calendar_events(organization_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id_fkey 
ON public.calendar_events(user_id);

-- Core Tables
CREATE INDEX IF NOT EXISTS idx_calls_user_id_fkey 
ON public.calls(user_id);

CREATE INDEX IF NOT EXISTS idx_data_access_log_user_id_fkey 
ON public.data_access_log(user_id);

CREATE INDEX IF NOT EXISTS idx_leaddesk_agent_mapping_user_id_fkey 
ON public.leaddesk_agent_mapping(user_id);

CREATE INDEX IF NOT EXISTS idx_organizations_owner_id_fkey 
ON public.organizations(owner_id);

CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id_fkey 
ON public.phone_numbers(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_fkey 
ON public.subscriptions(user_id);

-- Team Management
CREATE INDEX IF NOT EXISTS idx_team_members_invited_by_fkey 
ON public.team_members(invited_by);

CREATE INDEX IF NOT EXISTS idx_team_members_user_id_fkey 
ON public.team_members(user_id);

-- Widget Templates
CREATE INDEX IF NOT EXISTS idx_widget_templates_creator_id_fkey 
ON public.widget_templates(creator_id);

-- ============================================================================
-- PHASE 2: Remove Unused Indexes (Improve write performance and save storage)
-- ============================================================================

-- Dashboard-related unused indexes
DROP INDEX IF EXISTS public.idx_user_products_user_id;
DROP INDEX IF EXISTS public.idx_dashboards_user_id;
DROP INDEX IF EXISTS public.idx_dashboards_is_public;
DROP INDEX IF EXISTS public.idx_dashboard_widgets_dashboard_id;
DROP INDEX IF EXISTS public.idx_dashboard_shares_dashboard_id;
DROP INDEX IF EXISTS public.idx_dashboard_shares_user_id;

-- Widget templates unused indexes
DROP INDEX IF EXISTS public.idx_widget_templates_category;
DROP INDEX IF EXISTS public.idx_widget_templates_public;

-- Calls table unused indexes
DROP INDEX IF EXISTS public.idx_calls_deletion_scheduled;
DROP INDEX IF EXISTS public.idx_calls_external_id;

-- Settings and team unused indexes
DROP INDEX IF EXISTS public.idx_settings_audit_log_user;
DROP INDEX IF EXISTS public.idx_team_members_org_user;

-- Leads-related unused indexes
DROP INDEX IF EXISTS public.idx_lead_searches_organization_id;
DROP INDEX IF EXISTS public.idx_lead_searches_status;
DROP INDEX IF EXISTS public.idx_lead_searches_lead_type;
DROP INDEX IF EXISTS public.idx_leads_organization_id;
DROP INDEX IF EXISTS public.idx_leads_status;
DROP INDEX IF EXISTS public.idx_leads_adress;
DROP INDEX IF EXISTS public.idx_lead_activities_user_id;