// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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

    // SECURITY: Hash the API key before storing
    console.log('🔐 Hashing API key before storage...');
    const hashedKey = await bcrypt.hash(apiKey);
    console.log('✅ API key hashed successfully');

    const expiresAt = expires_in_days 
      ? new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
      : null;

    // Store HASHED key in database
    const { data, error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        key_name: key_name || 'Default Key',
        api_key: hashedKey,  // Store hashed, not plain text
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Insert error:', error);
      throw error;
    }

    console.log('✅ API key generated and hashed for user:', user.id);

    // SECURITY: Return plain text key ONLY ONCE during generation
    // User must save this key - it cannot be retrieved later
    return new Response(JSON.stringify({ 
      api_key: apiKey,  // Plain text - shown only once
      id: data.id,
      key_name: data.key_name,
      created_at: data.created_at,
      expires_at: data.expires_at,
      warning: 'Save this key now - you won\'t be able to see it again',
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
