import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const { key_name, expires_in_days } = await req.json();

    // Generate unique API key with format: hms_live_xxxxxxxxxxxxx
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const apiKey = 'hms_live_' + Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    const expiresAt = expires_in_days 
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    const { data, error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        key_name: key_name || 'Default Key',
        api_key: apiKey,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Insert error:', error);
      throw error;
    }

    console.log('✅ API key generated for user:', user.id);

    return new Response(JSON.stringify({ 
      api_key: apiKey,
      id: data.id,
      key_name: data.key_name,
      created_at: data.created_at,
      expires_at: data.expires_at,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Generate API key error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
