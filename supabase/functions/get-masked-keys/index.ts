// @ts-nocheck
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Fetch user's AI settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('openrouter_api_key_encrypted, openrouter_provisioning_key_encrypted')
      .eq('user_id', user.id)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }

    let apiKeyMasked = null;
    let apiKeyExists = false;
    let provisioningKeyMasked = null;
    let provisioningKeyExists = false;

    // Decrypt and mask API key
    if (settings?.openrouter_api_key_encrypted) {
      try {
        const { data: decryptedApiKey, error: decryptError } = await supabase.rpc('decrypt_text', {
          encrypted_data: settings.openrouter_api_key_encrypted,
          key: encryptionKey
        });

        if (!decryptError && decryptedApiKey) {
          apiKeyExists = true;
          // Mask: show first 8 chars + '****' + last 6 chars
          if (decryptedApiKey.length > 14) {
            const start = decryptedApiKey.substring(0, 8);
            const end = decryptedApiKey.substring(decryptedApiKey.length - 6);
            apiKeyMasked = `${start}...****...${end}`;
          } else {
            apiKeyMasked = 'sk-or-***';
          }
        }
      } catch (error) {
        console.error('Error decrypting API key:', error);
      }
    }

    // Decrypt and mask provisioning key
    if (settings?.openrouter_provisioning_key_encrypted) {
      try {
        const { data: decryptedProvKey, error: decryptError } = await supabase.rpc('decrypt_text', {
          encrypted_data: settings.openrouter_provisioning_key_encrypted,
          key: encryptionKey
        });

        if (!decryptError && decryptedProvKey) {
          provisioningKeyExists = true;
          // Mask: show first 8 chars + '****' + last 6 chars
          if (decryptedProvKey.length > 14) {
            const start = decryptedProvKey.substring(0, 8);
            const end = decryptedProvKey.substring(decryptedProvKey.length - 6);
            provisioningKeyMasked = `${start}...****...${end}`;
          } else {
            provisioningKeyMasked = 'pk-or-***';
          }
        }
      } catch (error) {
        console.error('Error decrypting provisioning key:', error);
      }
    }

    return new Response(
      JSON.stringify({
        api_key_masked: apiKeyMasked,
        api_key_exists: apiKeyExists,
        provisioning_key_masked: provisioningKeyMasked,
        provisioning_key_exists: provisioningKeyExists,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-masked-keys:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
