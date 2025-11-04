-- Create RPC function to get aggregated data from all users (admin only)
CREATE OR REPLACE FUNCTION public.get_admin_aggregated_data(
  p_date_from timestamptz DEFAULT NULL,
  p_date_to timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
  admin_check boolean;
BEGIN
  -- Verify admin status
  SELECT public.is_admin(auth.uid()) INTO admin_check;
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Access denied: Admin only';
  END IF;

  -- Aggregate data from all users
  SELECT jsonb_build_object(
    'telephony', (
      SELECT jsonb_build_object(
        'total_calls', COUNT(*) FILTER (WHERE event_type IN ('call_initiated', 'call_completed', 'call_failed')),
        'total_sms', COUNT(*) FILTER (WHERE event_type IN ('sms_sent', 'sms_received')),
        'total_duration_seconds', COALESCE(SUM(duration_seconds), 0),
        'total_cost', COALESCE(SUM(cost_amount), 0),
        'unique_users', COUNT(DISTINCT user_id),
        'by_provider', (
          SELECT jsonb_object_agg(provider, count)
          FROM (
            SELECT provider, COUNT(*) as count
            FROM telephony_events
            WHERE (p_date_from IS NULL OR event_timestamp >= p_date_from)
              AND (p_date_to IS NULL OR event_timestamp <= p_date_to)
            GROUP BY provider
          ) provider_counts
        )
      )
      FROM telephony_events
      WHERE (p_date_from IS NULL OR event_timestamp >= p_date_from)
        AND (p_date_to IS NULL OR event_timestamp <= p_date_to)
    ),
    'meetings', (
      SELECT jsonb_build_object(
        'total_meetings', COUNT(*),
        'scheduled', COUNT(*) FILTER (WHERE status = 'scheduled'),
        'completed', COUNT(*) FILTER (WHERE status = 'completed'),
        'cancelled', COUNT(*) FILTER (WHERE status = 'cancelled'),
        'total_revenue', COALESCE(SUM(actual_revenue), 0)
      )
      FROM calendar_events
      WHERE event_type = 'meeting'
        AND (p_date_from IS NULL OR created_at >= p_date_from)
        AND (p_date_to IS NULL OR created_at <= p_date_to)
    ),
    'leads', (
      SELECT jsonb_build_object(
        'total_leads', COUNT(*),
        'by_status', (
          SELECT jsonb_object_agg(status, count)
          FROM (
            SELECT status, COUNT(*) as count
            FROM leads
            WHERE (p_date_from IS NULL OR created_at >= p_date_from)
              AND (p_date_to IS NULL OR created_at <= p_date_to)
            GROUP BY status
          ) status_counts
        )
      )
      FROM leads
      WHERE (p_date_from IS NULL OR created_at >= p_date_from)
        AND (p_date_to IS NULL OR created_at <= p_date_to)
    ),
    'users', (
      SELECT jsonb_build_object(
        'total_users', COUNT(*),
        'active_users', COUNT(*) FILTER (WHERE last_sign_in_at >= NOW() - INTERVAL '30 days')
      )
      FROM auth.users
    ),
    'calls', (
      SELECT jsonb_build_object(
        'total_calls', COUNT(*),
        'avg_score', ROUND(AVG(score), 2),
        'with_transcripts', COUNT(*) FILTER (WHERE encrypted_transcript IS NOT NULL)
      )
      FROM calls
      WHERE (p_date_from IS NULL OR created_at >= p_date_from)
        AND (p_date_to IS NULL OR created_at <= p_date_to)
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Add RLS policy for admins to view all calls
DROP POLICY IF EXISTS "Admins can view all calls" ON public.calls;
CREATE POLICY "Admins can view all calls"
ON public.calls FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add RLS policy for admins to view all telephony events
DROP POLICY IF EXISTS "Admins can view all telephony_events" ON public.telephony_events;
CREATE POLICY "Admins can view all telephony_events"
ON public.telephony_events FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Add RLS policy for admins to view all calendar events
DROP POLICY IF EXISTS "Admins can view all calendar_events" ON public.calendar_events;
CREATE POLICY "Admins can view all calendar_events"
ON public.calendar_events FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));