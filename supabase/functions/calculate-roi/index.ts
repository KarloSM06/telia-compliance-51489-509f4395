import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { authenticateRequest } from '../_shared/auth.ts';
import { corsResponse } from '../_shared/cors.ts';
import { createError, errorToResponse, handleUnexpectedError } from '../_shared/errors.ts';
import { corsHeaders } from '../_shared/cors.ts';

/**
 * Calculate ROI Edge Function
 * Performs heavy ROI calculations on the backend using database views
 * Returns cached or freshly calculated ROI metrics
 */

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authResult = await authenticateRequest(req);
    if ('error' in authResult) {
      return errorToResponse(authResult.error, corsHeaders);
    }

    const { user, supabase } = authResult;

    // Parse request body
    const { start_date, end_date } = await req.json();

    if (!start_date || !end_date) {
      return errorToResponse(
        createError('BAD_REQUEST', 'start_date and end_date are required'),
        corsHeaders
      );
    }

    // Fetch costs from v_user_costs view
    const { data: costs, error: costsError } = await supabase
      .from('v_user_costs')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start_date)
      .lte('date', end_date);

    if (costsError) throw costsError;

    // Fetch revenue from v_user_revenue view
    const { data: revenue, error: revenueError } = await supabase
      .from('v_user_revenue')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start_date)
      .lte('date', end_date);

    if (revenueError) throw revenueError;

    // Calculate totals
    const totalCosts = costs?.reduce((sum, item) => sum + (item.cost_sek || 0), 0) || 0;
    const totalRevenue = revenue?.reduce((sum, item) => sum + (item.actual_revenue || 0), 0) || 0;
    const roi = totalCosts > 0 ? ((totalRevenue - totalCosts) / totalCosts) * 100 : 0;

    // Group costs by type
    const costsByType: Record<string, number> = {};
    costs?.forEach((item) => {
      if (item.cost_type) {
        costsByType[item.cost_type] = (costsByType[item.cost_type] || 0) + (item.cost_sek || 0);
      }
    });

    return corsResponse({
      success: true,
      data: {
        total_costs: totalCosts,
        total_revenue: totalRevenue,
        roi_percentage: roi,
        costs_by_type: costsByType,
        period: {
          start: start_date,
          end: end_date,
        },
      },
    });
  } catch (error) {
    return handleUnexpectedError('calculate-roi', error, corsHeaders);
  }
});
