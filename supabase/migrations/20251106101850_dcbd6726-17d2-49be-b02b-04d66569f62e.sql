-- FAS 1: SKAPA 27 NYA FOREIGN KEY INDEX FÖR BÄTTRE JOIN PERFORMANCE

-- 1. calendar_events.created_by
CREATE INDEX IF NOT EXISTS idx_calendar_events_created_by 
ON public.calendar_events(created_by);

-- 2. calendars.organization_id
CREATE INDEX IF NOT EXISTS idx_calendars_organization_id 
ON public.calendars(organization_id);

-- 3. call_events.agent_id
CREATE INDEX IF NOT EXISTS idx_call_events_agent_id 
ON public.call_events(agent_id);

-- 4. calls.user_id
CREATE INDEX IF NOT EXISTS idx_calls_user_id 
ON public.calls(user_id);

-- 5. conversion_funnel_metrics.organization_id
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_metrics_organization_id 
ON public.conversion_funnel_metrics(organization_id);

-- 6. customer_preference_audit.preference_id
CREATE INDEX IF NOT EXISTS idx_customer_preference_audit_preference_id 
ON public.customer_preference_audit(preference_id);

-- 7. dashboard_shares.shared_with_user_id
CREATE INDEX IF NOT EXISTS idx_dashboard_shares_shared_with_user_id 
ON public.dashboard_shares(shared_with_user_id);

-- 8. dashboards.user_id
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id 
ON public.dashboards(user_id);

-- 9. lead_searches.organization_id
CREATE INDEX IF NOT EXISTS idx_lead_searches_organization_id 
ON public.lead_searches(organization_id);

-- 10. message_logs.sms_provider_settings_id
CREATE INDEX IF NOT EXISTS idx_message_logs_sms_provider_settings_id 
ON public.message_logs(sms_provider_settings_id);

-- 11. message_templates.organization_id
CREATE INDEX IF NOT EXISTS idx_message_templates_organization_id 
ON public.message_templates(organization_id);

-- 12. message_templates.user_id
CREATE INDEX IF NOT EXISTS idx_message_templates_user_id 
ON public.message_templates(user_id);

-- 13. notification_recipients.organization_id
CREATE INDEX IF NOT EXISTS idx_notification_recipients_organization_id 
ON public.notification_recipients(organization_id);

-- 14. owner_notification_settings.organization_id
CREATE INDEX IF NOT EXISTS idx_owner_notification_settings_organization_id 
ON public.owner_notification_settings(organization_id);

-- 15. owner_notifications.calendar_event_id
CREATE INDEX IF NOT EXISTS idx_owner_notifications_calendar_event_id 
ON public.owner_notifications(calendar_event_id);

-- 16. phone_numbers.user_id
CREATE INDEX IF NOT EXISTS idx_phone_numbers_user_id 
ON public.phone_numbers(user_id);

-- 17. reminder_settings.default_template_confirmation
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_confirmation 
ON public.reminder_settings(default_template_confirmation);

-- 18. reminder_settings.default_template_reminder
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_reminder 
ON public.reminder_settings(default_template_reminder);

-- 19. reminder_settings.default_template_review
CREATE INDEX IF NOT EXISTS idx_reminder_settings_default_template_review 
ON public.reminder_settings(default_template_review);

-- 20. reminder_settings.organization_id
CREATE INDEX IF NOT EXISTS idx_reminder_settings_organization_id 
ON public.reminder_settings(organization_id);

-- 21. review_analysis_queue.user_id
CREATE INDEX IF NOT EXISTS idx_review_analysis_queue_user_id 
ON public.review_analysis_queue(user_id);

-- 22. settings_audit_log.user_id
CREATE INDEX IF NOT EXISTS idx_settings_audit_log_user_id 
ON public.settings_audit_log(user_id);

-- 23. team_members.invited_by
CREATE INDEX IF NOT EXISTS idx_team_members_invited_by 
ON public.team_members(invited_by);

-- 24. telephony_accounts.organization_id
CREATE INDEX IF NOT EXISTS idx_telephony_accounts_organization_id 
ON public.telephony_accounts(organization_id);

-- 25. telephony_webhook_logs.user_id
CREATE INDEX IF NOT EXISTS idx_telephony_webhook_logs_user_id 
ON public.telephony_webhook_logs(user_id);

-- 26. webhooks_received.user_id
CREATE INDEX IF NOT EXISTS idx_webhooks_received_user_id 
ON public.webhooks_received(user_id);

-- 27. widget_templates.creator_id
CREATE INDEX IF NOT EXISTS idx_widget_templates_creator_id 
ON public.widget_templates(creator_id);