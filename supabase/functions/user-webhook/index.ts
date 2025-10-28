import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const startTime = Date.now();

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const webhookToken = url.searchParams.get('token');
    
    if (!webhookToken) {
      throw new Error('Missing webhook token');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find user by webhook token
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('telephony_webhook_token', webhookToken)
      .single();

    if (profileError || !profile) {
      console.error('Invalid webhook token');
      throw new Error('Invalid webhook token');
    }

    const userId = profile.id;
    console.log(`✅ Webhook authenticated for user: ${userId}`);

    // Detect provider from request
    const contentType = req.headers.get('content-type') || '';
    let provider: string;
    let body: any;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      provider = formData.has('MessageSid') ? 'twilio' : 'unknown';
      body = Object.fromEntries(formData);
    } else {
      body = await req.json();
      if (body.message?.type || body.type === 'status-update') provider = 'vapi';
      else if (body.event === 'call_ended' || body.event === 'call_started') provider = 'retell';
      else if (body.data?.event_type) provider = 'telnyx';
      else provider = 'unknown';
    }

    console.log(`📥 Detected provider: ${provider}`);

    // Find telephony account
    const { data: account, error: accountError } = await supabase
      .from('telephony_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (accountError || !account) {
      throw new Error(`No active ${provider} account configured`);
    }

    // Log webhook
    await supabase.from('telephony_webhook_logs').insert({
      user_id: userId,
      provider: provider,
      request_method: req.method,
      request_headers: Object.fromEntries(req.headers),
      request_body: body,
      response_status: 200,
      processing_time_ms: Date.now() - startTime
    });

    console.log(`✅ Webhook processed in ${Date.now() - startTime}ms`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
