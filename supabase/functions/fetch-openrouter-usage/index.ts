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
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !encryptionKey) {
      throw new Error('Missing environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's AI settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings?.openrouter_api_key_encrypted) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenRouter API key not configured',
          usage: null 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Decrypt OpenRouter API key
    const { data: decryptedKey, error: decryptError } = await supabase.rpc('decrypt_text', {
      encrypted_data: settings.openrouter_api_key_encrypted,
      key: encryptionKey
    });

    if (decryptError || !decryptedKey) {
      throw new Error('Failed to decrypt API key');
    }

    // Fetch usage from OpenRouter API - using /activity endpoint (documented)
    const response = await fetch('https://openrouter.ai/api/v1/activity', {
      headers: {
        'Authorization': `Bearer ${decryptedKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Sync usage data to our database
    const USD_TO_SEK = 11;
    if (data.data && Array.isArray(data.data)) {
      const usageLogs = data.data.map((item: any) => ({
        user_id: user.id,
        generation_id: null, // Activity endpoint doesn't provide generation_id
        model: item.model,
        provider: 'openrouter',
        use_case: 'manual_fetch',
        prompt_tokens: item.prompt_tokens || 0,
        completion_tokens: item.completion_tokens || 0,
        total_tokens: item.total_tokens || 0,
        cost_usd: item.cost || 0,
        cost_sek: (item.cost || 0) * USD_TO_SEK,
        created_at: item.date, // Date string YYYY-MM-DD
        request_metadata: {
          endpoint: item.endpoint,
          requests_count: item.requests,
          source: 'activity_manual'
        }
      }));

      // Insert logs (may create duplicates if date already exists)
      for (const log of usageLogs) {
        await supabase
          .from('ai_usage_logs')
          .insert(log);
      }
    }

    // Calculate summary
    const totalCost = data.data.reduce((sum: number, item: any) => 
      sum + (item.cost || 0), 0
    );

    return new Response(
      JSON.stringify({
        records_fetched: data.data.length,
        cost_sek: totalCost * USD_TO_SEK,
        tokens_used: data.data.reduce((sum: number, item: any) => 
          sum + (item.total_tokens || 0), 0
        ),
        breakdown_by_model: data.data.reduce((acc: any, item: any) => {
          const model = item.model;
          if (!acc[model]) {
            acc[model] = { requests: 0, cost: 0, tokens: 0 };
          }
          acc[model].requests += item.requests || 1;
          acc[model].cost += (item.cost || 0);
          acc[model].tokens += (item.total_tokens || 0);
          return acc;
        }, {}),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in fetch-openrouter-usage:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
