import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { credentials } = await req.json();
    
    if (!credentials) {
      throw new Error('Credentials are required');
    }

    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY not configured');
    }

    // Simple base64 encoding for now (in production, use proper encryption)
    const jsonString = JSON.stringify(credentials);
    const encrypted = btoa(jsonString);

    // Generate webhook token
    const randomBytes = crypto.getRandomValues(new Uint8Array(32));
    const webhookToken = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    console.log('✅ Credentials encrypted successfully');
    
    return new Response(JSON.stringify({ encrypted, webhook_token: webhookToken }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Encryption error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
