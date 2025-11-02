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

    const body = await req.json();
    const { model, messages, session_id, site_url, site_title, use_case = 'api_call' } = body;

    if (!model || !messages) {
      throw new Error('Missing required fields: model and messages');
    }

    // Get user's OpenRouter API key
    const { data: aiSettings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('openrouter_api_key_encrypted, ai_provider')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !aiSettings?.openrouter_api_key_encrypted) {
      throw new Error('OpenRouter not configured. Please configure OpenRouter in AI settings.');
    }

    // Decrypt API key
    const { data: decryptedKey, error: decryptError } = await supabase.rpc('decrypt_text', {
      encrypted_data: aiSettings.openrouter_api_key_encrypted,
      key: encryptionKey
    });

    if (decryptError || !decryptedKey) {
      throw new Error('Failed to decrypt OpenRouter API key');
    }

    // Call OpenRouter API
    const openRouterHeaders: Record<string, string> = {
      'Authorization': `Bearer ${decryptedKey}`,
      'Content-Type': 'application/json',
    };

    if (site_url) openRouterHeaders['HTTP-Referer'] = site_url;
    if (site_title) openRouterHeaders['X-Title'] = site_title;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: openRouterHeaders,
      body: JSON.stringify({
        model,
        messages,
        usage: { include: true }
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', openRouterResponse.status, errorText);
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    const data = await openRouterResponse.json();
    const usage = data.usage || {};
    const responseContent = data.choices?.[0]?.message?.content ?? '';

    // Log usage to ai_usage_logs
    const { error: logError } = await supabase
      .from('ai_usage_logs')
      .insert({
        user_id: user.id,
        model,
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        total_tokens: usage.total_tokens || 0,
        cost_usd: parseFloat(usage.total_cost || '0'),
        cost_sek: parseFloat(usage.total_cost || '0') * 11, // Approximate conversion
        provider: 'openrouter',
        use_case,
        generation_id: data.id || null,
        request_metadata: {
          session_id,
          site_url,
          site_title,
          messages_count: messages.length
        }
      });

    if (logError) {
      console.error('Failed to log usage:', logError);
    }

    return new Response(
      JSON.stringify({
        data,
        usage,
        response: responseContent
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in submit-prompt:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
