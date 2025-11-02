import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse query parameters
    const url = new URL(req.url);
    const daysBack = parseInt(url.searchParams.get('days') || '30');
    const useCase = url.searchParams.get('use_case');
    const model = url.searchParams.get('model');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Build query
    let query = supabase
      .from('ai_usage_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString());

    if (useCase) {
      query = query.eq('use_case', useCase);
    }

    if (model) {
      query = query.eq('model', model);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Aggregate data
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalTokens = 0;
    let totalCostSEK = 0;
    let totalCostUSD = 0;
    let totalCalls = 0;

    const modelBreakdown: Record<string, any> = {};
    const useCaseBreakdown: Record<string, any> = {};
    const dailyUsage: Record<string, any> = {};

    data.forEach((log: any) => {
      totalPromptTokens += log.prompt_tokens || 0;
      totalCompletionTokens += log.completion_tokens || 0;
      totalTokens += log.total_tokens || 0;
      totalCostSEK += parseFloat(log.cost_sek || 0);
      totalCostUSD += parseFloat(log.cost_usd || 0);
      totalCalls++;

      // Model breakdown
      if (!modelBreakdown[log.model]) {
        modelBreakdown[log.model] = {
          calls: 0,
          tokens: 0,
          cost_sek: 0
        };
      }
      modelBreakdown[log.model].calls++;
      modelBreakdown[log.model].tokens += log.total_tokens || 0;
      modelBreakdown[log.model].cost_sek += parseFloat(log.cost_sek || 0);

      // Use case breakdown
      const useCaseKey = log.use_case || 'unknown';
      if (!useCaseBreakdown[useCaseKey]) {
        useCaseBreakdown[useCaseKey] = {
          calls: 0,
          tokens: 0,
          cost_sek: 0
        };
      }
      useCaseBreakdown[useCaseKey].calls++;
      useCaseBreakdown[useCaseKey].tokens += log.total_tokens || 0;
      useCaseBreakdown[useCaseKey].cost_sek += parseFloat(log.cost_sek || 0);

      // Daily usage
      const date = new Date(log.created_at).toISOString().split('T')[0];
      if (!dailyUsage[date]) {
        dailyUsage[date] = {
          calls: 0,
          tokens: 0,
          cost_sek: 0
        };
      }
      dailyUsage[date].calls++;
      dailyUsage[date].tokens += log.total_tokens || 0;
      dailyUsage[date].cost_sek += parseFloat(log.cost_sek || 0);
    });

    return new Response(
      JSON.stringify({
        summary: {
          total_calls: totalCalls,
          total_prompt_tokens: totalPromptTokens,
          total_completion_tokens: totalCompletionTokens,
          total_tokens: totalTokens,
          total_cost_sek: Math.round(totalCostSEK * 100) / 100,
          total_cost_usd: Math.round(totalCostUSD * 100) / 100,
          period_days: daysBack,
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString()
        },
        by_model: Object.entries(modelBreakdown).map(([model, stats]) => ({
          model,
          ...stats
        })),
        by_use_case: Object.entries(useCaseBreakdown).map(([use_case, stats]) => ({
          use_case,
          ...stats
        })),
        daily: Object.entries(dailyUsage)
          .map(([date, stats]) => ({
            date,
            ...stats
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in get-user-usage:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
