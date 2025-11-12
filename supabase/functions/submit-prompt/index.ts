import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inline minimal AI gateway logic to avoid import issues
async function callAI(supabase: any, userId: string, messages: any[], useCase: string = 'api_call') {
  // Get user AI settings
  const { data: settings } = await supabase
    .from('user_ai_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  const encryptionKey = Deno.env.get('ENCRYPTION_KEY')!;
  let provider = 'lovable';
  let model = 'google/gemini-2.5-flash';
  let apiKey = Deno.env.get('LOVABLE_API_KEY');
  let apiUrl = 'https://ai.gateway.lovable.dev/v1/chat/completions';

  // Try OpenRouter if configured
  if (settings?.openrouter_api_key_encrypted) {
    try {
      const { data: decryptedKey } = await supabase.rpc('decrypt_text', {
        encrypted_data: settings.openrouter_api_key_encrypted,
        key: encryptionKey
      });

      if (decryptedKey) {
        provider = 'openrouter';
        model = settings.openrouter_default_model || 'anthropic/claude-3.5-sonnet';
        apiKey = decryptedKey;
        apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      }
    } catch (error) {
      console.error('Failed to decrypt OpenRouter key, falling back to Lovable AI:', error);
    }
  }

  // Make AI call
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API error (${provider}): ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const usage = data.usage || {};
  const content = data.choices?.[0]?.message?.content || '';

  // Log usage
  await supabase.from('ai_usage_logs').insert({
    user_id: userId,
    model,
    provider,
    use_case: useCase,
    prompt_tokens: usage.prompt_tokens || 0,
    completion_tokens: usage.completion_tokens || 0,
    total_tokens: usage.total_tokens || 0,
    cost_usd: usage.cost || 0,
    cost_sek: (usage.cost || 0) * 11,
    generation_id: data.id || null,
    status: 'success',
  });

  return { content, model, provider, usage, data };
}

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

    // Authenticate user
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
    const { messages, use_case = 'api_call' } = body;

    if (!messages) {
      throw new Error('Missing required field: messages');
    }

    // Use AI gateway for consistent handling
    const result = await callAI(supabase, user.id, messages, use_case);

    return new Response(
      JSON.stringify({
        data: result.data,
        usage: result.usage,
        response: result.content,
        model: result.model,
        provider: result.provider,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in submit-prompt:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
