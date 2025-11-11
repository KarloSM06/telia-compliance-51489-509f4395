// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get API key from header or body
    const apiKeyHeader = req.headers.get('X-API-Key');
    let apiKeyFromBody = null;
    
    if (req.method === 'POST') {
      const body = await req.json();
      apiKeyFromBody = body.api_key;
    }
    
    const apiKey = apiKeyHeader || apiKeyFromBody;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ valid: false, error: 'API key required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate API key format
    if (!apiKey.startsWith('hms_live_')) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid API key format' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch all active API keys for comparison
    const { data: keys, error } = await supabase
      .from('user_api_keys')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }

    // Check each key with bcrypt comparison
    for (const key of keys || []) {
      // Check if key is expired
      if (key.expires_at && new Date(key.expires_at) < new Date()) {
        continue; // Skip expired keys
      }

      // Compare hashed key
      const isMatch = await bcrypt.compare(apiKey, key.api_key);
      
      if (isMatch) {
        // Valid key found
        console.log('✅ Valid API key for user:', key.user_id);
        
        // Update last_used_at
        await supabase
          .from('user_api_keys')
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', key.id);
        
        return new Response(
          JSON.stringify({ 
            valid: true, 
            user_id: key.user_id,
            key_name: key.key_name,
            key_id: key.id,
          }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // No matching key found
    console.log('❌ Invalid API key provided');
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid API key' }), 
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Validate API key error:', error);
    return new Response(
      JSON.stringify({ valid: false, error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
