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

    // Get user's OpenRouter keys
    const { data: settings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('openrouter_api_key_encrypted, openrouter_provisioning_key_encrypted')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings) {
      return new Response(
        JSON.stringify({ error: 'No OpenRouter keys configured' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let totalCredits = null;
    let totalUsage = null;
    let limitRemaining = null;
    let rateLimitRequests = null;
    let rateLimitInterval = null;
    let apiKeysCount = 0;
    let apiKeysData = null;

    // If API key exists, get credits and rate limits
    if (settings.openrouter_api_key_encrypted) {
      const { data: apiKey, error: apiKeyError } = await supabase.rpc('decrypt_text', {
        encrypted_data: settings.openrouter_api_key_encrypted,
        key: encryptionKey
      });

      if (!apiKeyError && apiKey) {
        // Get credits
        try {
          const creditsResponse = await fetch('https://openrouter.ai/api/v1/credits', {
            headers: { 'Authorization': `Bearer ${apiKey}` },
          });
          if (creditsResponse.ok) {
            const creditsData = await creditsResponse.json();
            totalCredits = creditsData.data?.total_credits || 0;
            totalUsage = creditsData.data?.total_usage || 0;
          }
        } catch (e) {
          console.error('Failed to fetch credits:', e);
        }

        // Get rate limits
        try {
          const keyInfoResponse = await fetch('https://openrouter.ai/api/v1/key', {
            headers: { 'Authorization': `Bearer ${apiKey}` },
          });
          if (keyInfoResponse.ok) {
            const keyInfo = await keyInfoResponse.json();
            limitRemaining = keyInfo.data?.limit_remaining;
            rateLimitRequests = keyInfo.data?.rate_limit?.requests;
            rateLimitInterval = keyInfo.data?.rate_limit?.interval;
          }
        } catch (e) {
          console.error('Failed to fetch key info:', e);
        }
      }
    }

    // If provisioning key exists, get API keys list
    if (settings.openrouter_provisioning_key_encrypted) {
      const { data: provKey, error: provKeyError } = await supabase.rpc('decrypt_text', {
        encrypted_data: settings.openrouter_provisioning_key_encrypted,
        key: encryptionKey
      });

      if (!provKeyError && provKey) {
        try {
          const keysResponse = await fetch('https://openrouter.ai/api/v1/keys', {
            headers: { 
              'Authorization': `Bearer ${provKey}`,
              'Content-Type': 'application/json',
            },
          });
          if (keysResponse.ok) {
            const keysData = await keysResponse.json();
            apiKeysData = keysData.data;
            apiKeysCount = keysData.data?.length || 0;
          }
        } catch (e) {
          console.error('Failed to fetch keys:', e);
        }
      }
    }

    // Insert or update snapshot
    const today = new Date().toISOString().split('T')[0];
    const { error: upsertError } = await supabase
      .from('openrouter_account_snapshots')
      .upsert({
        user_id: user.id,
        snapshot_date: today,
        total_credits: totalCredits,
        total_usage: totalUsage,
        limit_remaining: limitRemaining,
        rate_limit_requests: rateLimitRequests,
        rate_limit_interval: rateLimitInterval,
        api_keys_count: apiKeysCount,
        api_keys_data: apiKeysData,
      }, {
        onConflict: 'user_id,snapshot_date'
      });

    if (upsertError) {
      throw upsertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        snapshot_date: today,
        total_credits: totalCredits,
        total_usage: totalUsage,
        api_keys_count: apiKeysCount,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in sync-openrouter-account:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
