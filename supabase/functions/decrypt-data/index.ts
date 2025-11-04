import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DecryptRequest {
  callId: string;
  fields: string[]; // e.g., ['customer_phone', 'customer_name', 'agent_name', 'transcript', 'analysis']
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { callId, fields }: DecryptRequest = await req.json();

    if (!callId || !fields || !Array.isArray(fields)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role client for decryption
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('Encryption key not configured');
    }

    // Check if user is admin
    const { data: isAdminUser } = await supabase.rpc('is_admin', { user_id: user.id });

    // Verify user owns this call OR is admin
    const { data: call, error: callError } = await supabase
      .from('calls')
      .select('user_id, encrypted_customer_phone, encrypted_customer_name, encrypted_agent_name, encrypted_transcript, encrypted_analysis')
      .eq('id', callId)
      .single();

    if (callError || !call) {
      return new Response(JSON.stringify({ error: 'Call not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Allow access if user owns the call OR is admin
    if (!isAdminUser && call.user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Access denied' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decrypt requested fields using Supabase's decrypt_text function
    const decrypted: Record<string, any> = {};

    for (const field of fields) {
      let encryptedData = null;
      let fieldName = '';

      switch (field) {
        case 'customer_phone':
          encryptedData = call.encrypted_customer_phone;
          fieldName = 'customer_phone';
          // Mask phone number for display
          if (encryptedData) {
            const { data: decryptedPhone } = await supabase.rpc('decrypt_text', {
              encrypted_data: encryptedData,
              key: encryptionKey
            });
            if (decryptedPhone) {
              // Show last 4 digits only
              decrypted[fieldName] = '***-***-' + decryptedPhone.slice(-4);
            }
          }
          break;

        case 'customer_name':
          encryptedData = call.encrypted_customer_name;
          fieldName = 'customer_name';
          if (encryptedData) {
            const { data } = await supabase.rpc('decrypt_text', {
              encrypted_data: encryptedData,
              key: encryptionKey
            });
            decrypted[fieldName] = data;
          }
          break;

        case 'agent_name':
          encryptedData = call.encrypted_agent_name;
          fieldName = 'agent_name';
          if (encryptedData) {
            const { data } = await supabase.rpc('decrypt_text', {
              encrypted_data: encryptedData,
              key: encryptionKey
            });
            decrypted[fieldName] = data;
          }
          break;

        case 'transcript':
          encryptedData = call.encrypted_transcript;
          fieldName = 'transcript';
          if (encryptedData) {
            const { data } = await supabase.rpc('decrypt_text', {
              encrypted_data: encryptedData,
              key: encryptionKey
            });
            decrypted[fieldName] = data;
          }
          break;

        case 'analysis':
          // Analysis is stored as JSONB, not encrypted with decrypt_text
          decrypted[field] = call.encrypted_analysis;
          break;

        default:
          console.warn(`Unknown field requested: ${field}`);
      }
    }

    // Log access for audit trail
    await supabase.from('data_access_log').insert({
      user_id: user.id,
      action: 'DECRYPT_DATA',
      resource_type: 'call',
      resource_id: callId,
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
    });

    return new Response(JSON.stringify({ success: true, data: decrypted }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Decryption error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
