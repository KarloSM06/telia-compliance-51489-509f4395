-- Optimize RLS policies for better performance by wrapping auth.uid() in subqueries
-- This prevents auth.uid() from being re-evaluated for each row

-- PROFILES TABLE
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING ((select auth.uid()) = id);

-- CALLS TABLE
DROP POLICY IF EXISTS "Users can view own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can insert own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can update own calls" ON public.calls;
DROP POLICY IF EXISTS "Users can delete own calls" ON public.calls;

CREATE POLICY "Users can view own calls"
ON public.calls FOR SELECT
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own calls"
ON public.calls FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own calls"
ON public.calls FOR UPDATE
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own calls"
ON public.calls FOR DELETE
USING (user_id = (select auth.uid()));

-- USER_ANALYSIS TABLE
DROP POLICY IF EXISTS "Users can view own analysis" ON public.user_analysis;
DROP POLICY IF EXISTS "Users can insert own analysis" ON public.user_analysis;
DROP POLICY IF EXISTS "Users can update own analysis" ON public.user_analysis;

CREATE POLICY "Users can view own analysis"
ON public.user_analysis FOR SELECT
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own analysis"
ON public.user_analysis FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own analysis"
ON public.user_analysis FOR UPDATE
USING (user_id = (select auth.uid()));

-- DATA_ACCESS_LOG TABLE
DROP POLICY IF EXISTS "Users can view own access log" ON public.data_access_log;

CREATE POLICY "Users can view own access log"
ON public.data_access_log FOR SELECT
USING (user_id = (select auth.uid()));

-- MESSAGES TABLE
DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can only access own messages" ON public.messages;

CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own messages"
ON public.messages FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own messages"
ON public.messages FOR UPDATE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own messages"
ON public.messages FOR DELETE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can only access own messages"
ON public.messages FOR ALL
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- LEADDESK_AGENT_MAPPING TABLE
DROP POLICY IF EXISTS "Users can view own agent mappings" ON public.leaddesk_agent_mapping;
DROP POLICY IF EXISTS "Users can insert own agent mappings" ON public.leaddesk_agent_mapping;
DROP POLICY IF EXISTS "Users can update own agent mappings" ON public.leaddesk_agent_mapping;
DROP POLICY IF EXISTS "Users can delete own agent mappings" ON public.leaddesk_agent_mapping;

CREATE POLICY "Users can view own agent mappings"
ON public.leaddesk_agent_mapping FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own agent mappings"
ON public.leaddesk_agent_mapping FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own agent mappings"
ON public.leaddesk_agent_mapping FOR UPDATE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own agent mappings"
ON public.leaddesk_agent_mapping FOR DELETE
USING ((select auth.uid()) = user_id);

-- SUBSCRIPTIONS TABLE
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.subscriptions;

CREATE POLICY "Users can view own subscription"
ON public.subscriptions FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own subscription"
ON public.subscriptions FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own subscription"
ON public.subscriptions FOR UPDATE
USING ((select auth.uid()) = user_id);

-- USER_PRODUCTS TABLE
DROP POLICY IF EXISTS "Users can view own products" ON public.user_products;
DROP POLICY IF EXISTS "Users can insert own products" ON public.user_products;
DROP POLICY IF EXISTS "Admins can insert any products" ON public.user_products;

CREATE POLICY "Users can view own products"
ON public.user_products FOR SELECT
USING (((select auth.uid()) = user_id) OR is_admin((select auth.uid())));

CREATE POLICY "Users can insert own products"
ON public.user_products FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Admins can insert any products"
ON public.user_products FOR INSERT
WITH CHECK (is_admin((select auth.uid())));

-- HIEMS_KUNDDATA TABLE
DROP POLICY IF EXISTS "Users can view own customer data" ON public."Hiems_Kunddata";
DROP POLICY IF EXISTS "Users can update own customer data" ON public."Hiems_Kunddata";
DROP POLICY IF EXISTS "Users can insert own customer data" ON public."Hiems_Kunddata";
DROP POLICY IF EXISTS "Users can only access own Hiems customer data" ON public."Hiems_Kunddata";

CREATE POLICY "Users can view own customer data"
ON public."Hiems_Kunddata" FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own customer data"
ON public."Hiems_Kunddata" FOR UPDATE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own customer data"
ON public."Hiems_Kunddata" FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can only access own Hiems customer data"
ON public."Hiems_Kunddata" FOR ALL
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- CALL_HISTORY TABLE
DROP POLICY IF EXISTS "Users can view own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can insert own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can update own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can delete own call history" ON public.call_history;
DROP POLICY IF EXISTS "Users can only access own call history" ON public.call_history;

CREATE POLICY "Users can view own call history"
ON public.call_history FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own call history"
ON public.call_history FOR INSERT
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own call history"
ON public.call_history FOR UPDATE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own call history"
ON public.call_history FOR DELETE
USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can only access own call history"
ON public.call_history FOR ALL
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- USER_ROLES TABLE
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (is_admin((select auth.uid())));

-- OFFERS TABLE
DROP POLICY IF EXISTS "Users can view own offers" ON public.offers;

CREATE POLICY "Users can view own offers"
ON public.offers FOR SELECT
USING ((email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = (select auth.uid()))))) OR (phone_number IN ( SELECT phone_numbers.phone_number
   FROM phone_numbers
  WHERE ((phone_numbers.created_at)::date = CURRENT_DATE))));

-- DASHBOARD_WIDGETS TABLE
DROP POLICY IF EXISTS "Users can view widgets of accessible dashboards" ON public.dashboard_widgets;
DROP POLICY IF EXISTS "Users can insert widgets to own dashboards" ON public.dashboard_widgets;
DROP POLICY IF EXISTS "Users can update widgets in own dashboards" ON public.dashboard_widgets;
DROP POLICY IF EXISTS "Users can delete widgets from own dashboards" ON public.dashboard_widgets;

CREATE POLICY "Users can view widgets of accessible dashboards"
ON public.dashboard_widgets FOR SELECT
USING (dashboard_id IN ( SELECT dashboards.id
   FROM dashboards
  WHERE ((dashboards.user_id = (select auth.uid())) OR (dashboards.is_public = true) OR (dashboards.id IN ( SELECT dashboard_shares.dashboard_id
           FROM dashboard_shares
          WHERE (dashboard_shares.shared_with_user_id = (select auth.uid())))))));

CREATE POLICY "Users can insert widgets to own dashboards"
ON public.dashboard_widgets FOR INSERT
WITH CHECK (dashboard_id IN ( SELECT dashboards.id
   FROM dashboards
  WHERE (dashboards.user_id = (select auth.uid()))));

CREATE POLICY "Users can update widgets in own dashboards"
ON public.dashboard_widgets FOR UPDATE
USING (dashboard_id IN ( SELECT dashboards.id
   FROM dashboards
  WHERE (dashboards.user_id = (select auth.uid()))));

CREATE POLICY "Users can delete widgets from own dashboards"
ON public.dashboard_widgets FOR DELETE
USING (dashboard_id IN ( SELECT dashboards.id
   FROM dashboards
  WHERE (dashboards.user_id = (select auth.uid()))));

-- WIDGET_TEMPLATES TABLE
DROP POLICY IF EXISTS "Users can view public templates" ON public.widget_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON public.widget_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON public.widget_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON public.widget_templates;

CREATE POLICY "Users can view public templates"
ON public.widget_templates FOR SELECT
USING ((is_public = true) OR (creator_id = (select auth.uid())));

CREATE POLICY "Users can insert own templates"
ON public.widget_templates FOR INSERT
WITH CHECK (creator_id = (select auth.uid()));

CREATE POLICY "Users can update own templates"
ON public.widget_templates FOR UPDATE
USING (creator_id = (select auth.uid()));

CREATE POLICY "Users can delete own templates"
ON public.widget_templates FOR DELETE
USING (creator_id = (select auth.uid()));

-- ORGANIZATIONS TABLE
DROP POLICY IF EXISTS "Users can view own organization" ON public.organizations;
DROP POLICY IF EXISTS "Users can update own organization" ON public.organizations;
DROP POLICY IF EXISTS "Users can insert own organization" ON public.organizations;

CREATE POLICY "Users can view own organization"
ON public.organizations FOR SELECT
USING ((owner_id = (select auth.uid())) OR (id IN ( SELECT team_members.organization_id
   FROM team_members
  WHERE ((team_members.user_id = (select auth.uid())) AND (team_members.status = 'active'::text)))) OR is_admin((select auth.uid())));

CREATE POLICY "Users can update own organization"
ON public.organizations FOR UPDATE
USING ((owner_id = (select auth.uid())) OR (id IN ( SELECT team_members.organization_id
   FROM team_members
  WHERE ((team_members.user_id = (select auth.uid())) AND (team_members.status = 'active'::text) AND (team_members.role = ANY (ARRAY['owner'::text, 'admin'::text]))))) OR is_admin((select auth.uid())));

CREATE POLICY "Users can insert own organization"
ON public.organizations FOR INSERT
WITH CHECK (owner_id = (select auth.uid()));

-- SETTINGS_AUDIT_LOG TABLE
DROP POLICY IF EXISTS "Users can view own audit log" ON public.settings_audit_log;

CREATE POLICY "Users can view own audit log"
ON public.settings_audit_log FOR SELECT
USING ((user_id = (select auth.uid())) OR is_admin((select auth.uid())));

-- TEAM_MEMBERS TABLE
DROP POLICY IF EXISTS "Members can view own organization team" ON public.team_members;
DROP POLICY IF EXISTS "Org admins can invite members" ON public.team_members;
DROP POLICY IF EXISTS "Org admins can update members" ON public.team_members;
DROP POLICY IF EXISTS "Org admins can delete members" ON public.team_members;

CREATE POLICY "Members can view own organization team"
ON public.team_members FOR SELECT
USING ((organization_id = user_organization_id((select auth.uid()))) OR is_admin((select auth.uid())));

CREATE POLICY "Org admins can invite members"
ON public.team_members FOR INSERT
WITH CHECK (has_org_role((select auth.uid()), ARRAY['owner'::text, 'admin'::text]) AND (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Org admins can update members"
ON public.team_members FOR UPDATE
USING (has_org_role((select auth.uid()), ARRAY['owner'::text, 'admin'::text]) AND (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Org admins can delete members"
ON public.team_members FOR DELETE
USING (has_org_role((select auth.uid()), ARRAY['owner'::text, 'admin'::text]) AND (organization_id = user_organization_id((select auth.uid()))));

-- DASHBOARDS TABLE
DROP POLICY IF EXISTS "Users can view own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can insert own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can update own dashboards" ON public.dashboards;
DROP POLICY IF EXISTS "Users can delete own dashboards" ON public.dashboards;

CREATE POLICY "Users can view own dashboards"
ON public.dashboards FOR SELECT
USING ((user_id = (select auth.uid())) OR (is_public = true) OR user_can_access_dashboard(id, (select auth.uid())));

CREATE POLICY "Users can insert own dashboards"
ON public.dashboards FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own dashboards"
ON public.dashboards FOR UPDATE
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own dashboards"
ON public.dashboards FOR DELETE
USING (user_id = (select auth.uid()));

-- LEAD_SEARCHES TABLE
DROP POLICY IF EXISTS "Users can view own lead searches" ON public.lead_searches;
DROP POLICY IF EXISTS "Users can insert own lead searches" ON public.lead_searches;
DROP POLICY IF EXISTS "Users can update own lead searches" ON public.lead_searches;
DROP POLICY IF EXISTS "Users can delete own lead searches" ON public.lead_searches;

CREATE POLICY "Users can view own lead searches"
ON public.lead_searches FOR SELECT
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can insert own lead searches"
ON public.lead_searches FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own lead searches"
ON public.lead_searches FOR UPDATE
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can delete own lead searches"
ON public.lead_searches FOR DELETE
USING (user_id = (select auth.uid()));

-- DASHBOARD_SHARES TABLE
DROP POLICY IF EXISTS "Users can view shares of own dashboards" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can insert shares" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can update shares" ON public.dashboard_shares;
DROP POLICY IF EXISTS "Dashboard owners can delete shares" ON public.dashboard_shares;

CREATE POLICY "Users can view shares of own dashboards"
ON public.dashboard_shares FOR SELECT
USING ((shared_with_user_id = (select auth.uid())) OR (EXISTS ( SELECT 1
   FROM dashboards
  WHERE ((dashboards.id = dashboard_shares.dashboard_id) AND (dashboards.user_id = (select auth.uid()))))));

CREATE POLICY "Dashboard owners can insert shares"
ON public.dashboard_shares FOR INSERT
WITH CHECK (EXISTS ( SELECT 1
   FROM dashboards
  WHERE ((dashboards.id = dashboard_shares.dashboard_id) AND (dashboards.user_id = (select auth.uid())))));

CREATE POLICY "Dashboard owners can update shares"
ON public.dashboard_shares FOR UPDATE
USING (EXISTS ( SELECT 1
   FROM dashboards
  WHERE ((dashboards.id = dashboard_shares.dashboard_id) AND (dashboards.user_id = (select auth.uid())))));

CREATE POLICY "Dashboard owners can delete shares"
ON public.dashboard_shares FOR DELETE
USING (EXISTS ( SELECT 1
   FROM dashboards
  WHERE ((dashboards.id = dashboard_shares.dashboard_id) AND (dashboards.user_id = (select auth.uid())))));

-- PHONE_NUMBERS TABLE
DROP POLICY IF EXISTS "Users can insert own phone numbers" ON public.phone_numbers;
DROP POLICY IF EXISTS "Users can only view own phone numbers" ON public.phone_numbers;

CREATE POLICY "Users can insert own phone numbers"
ON public.phone_numbers FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can only view own phone numbers"
ON public.phone_numbers FOR SELECT
USING (user_id = (select auth.uid()));

-- LEADS TABLE
DROP POLICY IF EXISTS "Users can view own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON public.leads;

CREATE POLICY "Users can view own leads"
ON public.leads FOR SELECT
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can insert own leads"
ON public.leads FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own leads"
ON public.leads FOR UPDATE
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can delete own leads"
ON public.leads FOR DELETE
USING (user_id = (select auth.uid()));

-- LEAD_ACTIVITIES TABLE
DROP POLICY IF EXISTS "Users can view activities for own leads" ON public.lead_activities;
DROP POLICY IF EXISTS "Users can insert activities for own leads" ON public.lead_activities;

CREATE POLICY "Users can view activities for own leads"
ON public.lead_activities FOR SELECT
USING (lead_id IN ( SELECT leads.id
   FROM leads
  WHERE (leads.user_id = (select auth.uid()))));

CREATE POLICY "Users can insert activities for own leads"
ON public.lead_activities FOR INSERT
WITH CHECK ((user_id = (select auth.uid())) AND (lead_id IN ( SELECT leads.id
   FROM leads
  WHERE (leads.user_id = (select auth.uid())))));

-- CALENDAR_EVENTS TABLE
DROP POLICY IF EXISTS "Users can view own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can insert own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can delete own events" ON public.calendar_events;

CREATE POLICY "Users can view own events"
ON public.calendar_events FOR SELECT
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can insert own events"
ON public.calendar_events FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own events"
ON public.calendar_events FOR UPDATE
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can delete own events"
ON public.calendar_events FOR DELETE
USING (user_id = (select auth.uid()));

-- BOOKING_SYSTEM_INTEGRATIONS TABLE
DROP POLICY IF EXISTS "Users can view own integrations" ON public.booking_system_integrations;
DROP POLICY IF EXISTS "Users can insert own integrations" ON public.booking_system_integrations;
DROP POLICY IF EXISTS "Users can update own integrations" ON public.booking_system_integrations;
DROP POLICY IF EXISTS "Users can delete own integrations" ON public.booking_system_integrations;

CREATE POLICY "Users can view own integrations"
ON public.booking_system_integrations FOR SELECT
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can insert own integrations"
ON public.booking_system_integrations FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own integrations"
ON public.booking_system_integrations FOR UPDATE
USING ((user_id = (select auth.uid())) OR (organization_id = user_organization_id((select auth.uid()))));

CREATE POLICY "Users can delete own integrations"
ON public.booking_system_integrations FOR DELETE
USING (user_id = (select auth.uid()));

-- BOOKING_WEBHOOKS TABLE
DROP POLICY IF EXISTS "Users can view own webhooks" ON public.booking_webhooks;
DROP POLICY IF EXISTS "Users can manage own webhooks" ON public.booking_webhooks;

CREATE POLICY "Users can view own webhooks"
ON public.booking_webhooks FOR SELECT
USING (integration_id IN ( SELECT booking_system_integrations.id
   FROM booking_system_integrations
  WHERE (booking_system_integrations.user_id = (select auth.uid()))));

CREATE POLICY "Users can manage own webhooks"
ON public.booking_webhooks FOR ALL
USING (integration_id IN ( SELECT booking_system_integrations.id
   FROM booking_system_integrations
  WHERE (booking_system_integrations.user_id = (select auth.uid()))));

-- BOOKING_SYNC_QUEUE TABLE
DROP POLICY IF EXISTS "Users can view own sync queue" ON public.booking_sync_queue;

CREATE POLICY "Users can view own sync queue"
ON public.booking_sync_queue FOR SELECT
USING (integration_id IN ( SELECT booking_system_integrations.id
   FROM booking_system_integrations
  WHERE (booking_system_integrations.user_id = (select auth.uid()))));

-- AVAILABILITY_SLOTS TABLE
DROP POLICY IF EXISTS "Users can view own availability slots" ON public.availability_slots;
DROP POLICY IF EXISTS "Users can insert own availability slots" ON public.availability_slots;
DROP POLICY IF EXISTS "Users can update own availability slots" ON public.availability_slots;
DROP POLICY IF EXISTS "Users can delete own availability slots" ON public.availability_slots;

CREATE POLICY "Users can view own availability slots"
ON public.availability_slots FOR SELECT
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own availability slots"
ON public.availability_slots FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own availability slots"
ON public.availability_slots FOR UPDATE
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own availability slots"
ON public.availability_slots FOR DELETE
USING (user_id = (select auth.uid()));

-- AI_CONSULTATIONS TABLE
DROP POLICY IF EXISTS "Users can view AI consultations" ON public.ai_consultations;

CREATE POLICY "Users can view AI consultations"
ON public.ai_consultations FOR SELECT
USING ((select auth.uid()) IS NOT NULL);