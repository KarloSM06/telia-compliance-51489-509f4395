# Database Documentation

## Schema Overview

The database consists of several logical groups of tables:

1. **User & Profile**: User accounts, settings, preferences
2. **AI & Analytics**: AI usage logs, OpenRouter data
3. **Telephony**: Call logs, messages, integrations
4. **Calendar & Bookings**: Events, availability, booking systems
5. **Leads & CRM**: Lead management, activities, searches
6. **Dashboards**: Custom dashboards and widgets
7. **Reviews**: Customer reviews and insights

## Core Tables

### User Management

#### `profiles`
User profile information.
- `id` (uuid, PK): User ID (references auth.users)
- `email` (text): User email
- `created_at` (timestamptz): Account creation time
- `telephony_webhook_token` (text): Unique token for webhooks

**RLS:** Users can only access their own profile

---

#### `user_ai_settings`
AI-related settings and API keys.
- `id` (uuid, PK)
- `user_id` (uuid, FK): References profiles
- `openrouter_api_key_encrypted` (text): Encrypted API key
- `openrouter_provisioning_key_encrypted` (text): Encrypted provisioning key

**RLS:** Users can only access their own settings

---

### AI & Analytics

#### `ai_usage_logs`
Logs all AI API usage with costs.
- `id` (uuid, PK)
- `user_id` (uuid, FK): References profiles
- `provider` (text): AI provider (openrouter, etc)
- `model` (text): AI model used
- `prompt_tokens` (int): Input tokens
- `completion_tokens` (int): Output tokens
- `total_tokens` (int): Total tokens
- `cost_usd` (numeric): Cost in USD
- `cost_sek` (numeric): Cost in SEK
- `created_at` (timestamptz): Log timestamp

**Indexes:**
```sql
CREATE INDEX idx_ai_usage_logs_user_date 
  ON ai_usage_logs(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_logs_provider 
  ON ai_usage_logs(provider, created_at DESC);
```

**RLS:** Users can only view their own logs

---

### Telephony

#### `integrations`
Telephony provider integrations.
- `id` (uuid, PK)
- `user_id` (uuid, FK): References profiles
- `provider` (text): Provider name (twilio, telnyx, vapi, retell)
- `provider_type` (text): Provider type (telephony, multi)
- `capabilities` (text[]): Available capabilities
- `encrypted_credentials` (jsonb): Encrypted API credentials
- `webhook_token` (text): Unique webhook token
- `is_active` (boolean): Integration status

**RLS:** Users can only access their own integrations

---

#### `telephony_events`
All telephony events (calls, messages, etc).
- `id` (uuid, PK)
- `integration_id` (uuid, FK): References integrations
- `provider` (text): Provider name
- `event_type` (text): Event type (call, message, etc)
- `direction` (text): inbound/outbound
- `from_number` (text): Caller number
- `to_number` (text): Recipient number
- `status` (text): Event status
- `duration_seconds` (int): Call duration
- `cost_usd` (numeric): Cost in USD
- `cost_sek` (numeric): Cost in SEK
- `metadata` (jsonb): Additional data
- `event_timestamp` (timestamptz): Event time
- `parent_event_id` (uuid): Parent event reference

**Indexes:**
```sql
CREATE INDEX idx_telephony_events_user_timestamp 
  ON telephony_events(integration_id, event_timestamp DESC);
CREATE INDEX idx_telephony_events_parent 
  ON telephony_events(parent_event_id) 
  WHERE parent_event_id IS NOT NULL;
```

**RLS:** Users can only view events from their integrations

---

### Calendar & Bookings

#### `calendar_events`
All calendar events and bookings.
- `id` (uuid, PK)
- `user_id` (uuid, FK): References profiles
- `title` (text): Event title
- `start_time` (text): Start timestamp
- `end_time` (text): End timestamp
- `event_type` (text): meeting, appointment, etc
- `status` (text): scheduled, completed, cancelled
- `service_type` (text): Type of service
- `expected_revenue` (numeric): Expected revenue (SEK)
- `actual_revenue` (numeric): Actual revenue (SEK)
- `contact_person` (text): Customer name
- `contact_email` (text): Customer email
- `contact_phone` (text): Customer phone
- `external_id` (text): ID from external system
- `source` (text): Source system (simplybook, etc)

**Indexes:**
```sql
CREATE INDEX idx_calendar_events_user_time 
  ON calendar_events(user_id, start_time DESC);
CREATE INDEX idx_calendar_events_status 
  ON calendar_events(status, start_time DESC);
```

**RLS:** Users can only access their own events

---

### Leads & CRM

#### `leads`
Lead/prospect information.
- `id` (uuid, PK)
- `user_id` (uuid, FK): References profiles
- `company_name` (text): Company name
- `contact_person` (text): Contact person
- `email` (text): Email address
- `phone` (text): Phone number
- `conversion_stage` (text): Lead stage
- `lead_type` (text): business/consumer
- `provider` (text): Source provider

**RLS:** Users can only access their own leads

---

#### `lead_activities`
Activities related to leads.
- `id` (uuid, PK)
- `lead_id` (uuid, FK): References leads
- `user_id` (uuid, FK): References profiles
- `activity_type` (text): call, email, meeting, etc
- `description` (text): Activity description
- `created_at` (timestamptz): Activity timestamp

**RLS:** Users can only access activities for their leads

---

## Database Views

### `v_user_costs`
Consolidated view of all user costs.
```sql
CREATE VIEW v_user_costs AS
SELECT 
  user_id,
  DATE(created_at) as date,
  'ai' as cost_type,
  SUM(cost_sek) as cost_sek,
  COUNT(*) as event_count
FROM ai_usage_logs
GROUP BY user_id, DATE(created_at)
UNION ALL
SELECT 
  ml.user_id,
  DATE(ml.created_at) as date,
  ml.channel as cost_type,
  SUM(COALESCE((ml.metadata->>'cost_sek')::numeric, ml.cost * 10.5)) as cost_sek,
  COUNT(*) as event_count
FROM message_logs ml
GROUP BY ml.user_id, DATE(ml.created_at), ml.channel;
```

### `v_user_revenue`
Consolidated view of all user revenue.
```sql
CREATE VIEW v_user_revenue AS
SELECT
  user_id,
  DATE(start_time) as date,
  COUNT(*) as booking_count,
  service_type,
  SUM(expected_revenue) as expected_revenue,
  SUM(actual_revenue) as actual_revenue
FROM calendar_events
WHERE status = 'completed'
GROUP BY user_id, DATE(start_time), service_type;
```

## Database Functions

### `encrypt_text(data text, key text)`
Encrypts text using pgcrypto.

### `decrypt_text(encrypted_data text, key text)`
Decrypts text encrypted with encrypt_text.

### `user_organization_id(user_uuid uuid)`
Returns the organization_id for a user (for multi-tenancy).

## Triggers

### Auto-update `updated_at`
Many tables have triggers that automatically update `updated_at` on row modification.

### `notify_owner_on_booking_change`
Triggers edge function when bookings change.

### `trigger_review_analysis`
Triggers review analysis when new reviews are added.

## Performance Tips

1. **Use indexes**: All queries should leverage indexes
2. **Limit SELECT ***: Only select needed columns
3. **Use views for analytics**: Pre-aggregated data is faster
4. **Proper RLS policies**: Avoid subqueries in policies where possible

## Backup & Recovery

- Automatic daily backups by Supabase
- Point-in-time recovery available
- Regular backup testing recommended

## Migration Strategy

1. All schema changes via migrations
2. Test migrations locally first
3. Use transactions for complex changes
4. Always provide rollback migrations
