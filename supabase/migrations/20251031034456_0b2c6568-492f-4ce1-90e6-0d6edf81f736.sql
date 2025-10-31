-- Fix unindexed foreign keys for performance optimization (corrected version)

-- calendar_events indexes
CREATE INDEX IF NOT EXISTS idx_calendar_events_integration_id ON calendar_events(integration_id);

-- conversion_funnel_metrics indexes  
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_metrics_organization_id ON conversion_funnel_metrics(organization_id);

-- dashboard_shares indexes
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_dashboard_id ON dashboard_shares(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_shared_with_user_id ON dashboard_shares(shared_with_user_id);

-- dashboard_widgets indexes
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON dashboard_widgets(dashboard_id);

-- dashboards indexes
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON dashboards(user_id);

-- integrations indexes
CREATE INDEX IF NOT EXISTS idx_integrations_organization_id ON integrations(organization_id);

-- lead_activities indexes
CREATE INDEX IF NOT EXISTS idx_lead_activities_user_id ON lead_activities(user_id);

-- lead_searches indexes
CREATE INDEX IF NOT EXISTS idx_lead_searches_organization_id ON lead_searches(organization_id);

-- leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_organization_id ON leads(organization_id);

-- message_logs indexes
CREATE INDEX IF NOT EXISTS idx_message_logs_integration_id ON message_logs(integration_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_scheduled_message_id ON message_logs(scheduled_message_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_sms_provider_settings_id ON message_logs(sms_provider_settings_id);

-- message_templates indexes
CREATE INDEX IF NOT EXISTS idx_message_templates_organization_id ON message_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_user_id ON message_templates(user_id);

-- owner_notification_settings indexes
CREATE INDEX IF NOT EXISTS idx_owner_notification_settings_organization_id ON owner_notification_settings(organization_id);

-- owner_notifications indexes
CREATE INDEX IF NOT EXISTS idx_owner_notifications_calendar_event_id ON owner_notifications(calendar_event_id);

-- reminder_settings indexes
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_confirmation ON reminder_settings(default_template_confirmation);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_reminder ON reminder_settings(default_template_reminder);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_review ON reminder_settings(default_template_review);
CREATE INDEX IF NOT EXISTS idx_reminder_settings_organization_id ON reminder_settings(organization_id);

-- review_analysis_queue indexes
CREATE INDEX IF NOT EXISTS idx_review_analysis_queue_user_id ON review_analysis_queue(user_id);

-- scheduled_messages indexes
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_template_id ON scheduled_messages(template_id);

-- settings_audit_log indexes
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_user_id ON settings_audit_log(user_id);

-- telephony_accounts indexes
CREATE INDEX IF NOT EXISTS idx_telephony_accounts_organization_id ON telephony_accounts(organization_id);