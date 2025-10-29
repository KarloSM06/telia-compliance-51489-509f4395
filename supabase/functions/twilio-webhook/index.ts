import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { verifyTwilioSignature } from '../user-webhook/_signature-verification.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-twilio-signature',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const webhookToken = url.searchParams.get('token');

    if (!webhookToken) {
      console.error('❌ No webhook token provided');
      return new Response('Webhook token required', { status: 400, headers: corsHeaders });
    }

    const contentType = req.headers.get('content-type') || '';
    let params: Record<string, string> = {};
    let rawBody = '';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      for (const [key, value] of formData.entries()) {
        params[key] = value.toString();
        rawBody += `${key}=${value}&`;
      }
    } else {
      rawBody = await req.text();
      try {
        params = JSON.parse(rawBody);
      } catch {
        params = {};
      }
    }

    const messageSid = params.MessageSid || params.CallSid;
    const messageStatus = params.MessageStatus || params.CallStatus;
    const errorCode = params.ErrorCode;
    
    console.log(`📥 Twilio webhook: ${messageSid} - ${messageStatus}, token: ${webhookToken}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook token exists and is active
    const { data: integration } = await supabase
      .from('integrations')
      .select('id, user_id, encrypted_credentials')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'twilio')
      .eq('is_active', true)
      .single();

    if (!integration) {
      console.log('⚠️ Invalid webhook token for Twilio');
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

    // Generate idempotency key
    const idempotencyKey = messageSid 
      ? `twilio:${messageSid}:${messageStatus}` 
      : `twilio:${Date.now()}:${Math.random()}`;

    // Check for duplicate
    const { data: existing } = await supabase
      .from('webhooks_received')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existing) {
      console.log('⚠️ Duplicate Twilio webhook:', idempotencyKey);
      return new Response('OK', { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Verify signature
    const signature = req.headers.get('x-twilio-signature') || '';
    const credentials = integration.encrypted_credentials as any;
    const authToken = credentials?.authToken || credentials?.auth_token;
    let signatureVerified = false;

    if (authToken && signature) {
      const fullUrl = `${url.protocol}//${url.host}${url.pathname}${url.search}`;
      signatureVerified = await verifyTwilioSignature(signature, fullUrl, params, authToken);
      if (!signatureVerified) {
        console.warn('⚠️ Twilio signature verification failed');
      }
    }

    // Save raw webhook
    await supabase
      .from('webhooks_received')
      .insert({
        provider: 'twilio',
        event_type: messageStatus,
        provider_event_id: messageSid,
        raw_payload: params,
        headers: Object.fromEntries(req.headers.entries()),
        signature_verified: signatureVerified,
        idempotency_key: idempotencyKey,
        user_id: integration.user_id,
      });

    // Update message status
    const updateData: any = {
      status: messageStatus === 'delivered' ? 'delivered' : 
              messageStatus === 'failed' || messageStatus === 'undelivered' ? 'failed' : 
              'sent',
    };

    if (messageStatus === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    if (errorCode) {
      updateData.error_message = `Twilio error code: ${errorCode}`;
    }

    const { error } = await supabase
      .from('message_logs')
      .update(updateData)
      .eq('provider_message_id', messageSid);

    if (error) {
      console.error('❌ Error updating message log:', error);
    }

    // Mark webhook as processed
    await supabase
      .from('webhooks_received')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('idempotency_key', idempotencyKey);

    console.log(`✅ Updated message ${messageSid} to status ${messageStatus}`);

    return new Response('OK', { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response('Error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});
