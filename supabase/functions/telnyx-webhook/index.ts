import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { verifyTelnyxSignature } from '../user-webhook/_signature-verification.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, telnyx-signature-ed25519, telnyx-timestamp',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const rawBody = await req.text();
  let body: any;
  
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const webhookToken = url.searchParams.get('token');

    if (!webhookToken) {
      console.error('❌ No webhook token provided');
      return new Response('Webhook token required', { status: 400, headers: corsHeaders });
    }

    const event = body.data;
    const eventType = event?.event_type || body.event_type;
    const eventId = event?.id || body.id;
    
    console.log(`📥 Telnyx webhook: ${eventType}`, 'token:', webhookToken);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook token exists and is active
    const { data: integration } = await supabase
      .from('integrations')
      .select('id, user_id, encrypted_credentials')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'telnyx')
      .eq('is_active', true)
      .single();

    if (!integration) {
      console.log('⚠️ Invalid webhook token for Telnyx');
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

    // Generate idempotency key
    const messageId = event?.payload?.id || eventId;
    const idempotencyKey = messageId 
      ? `telnyx:${messageId}:${eventType}` 
      : `telnyx:${Date.now()}:${Math.random()}`;

    // Check for duplicate
    const { data: existing } = await supabase
      .from('webhooks_received')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existing) {
      console.log('⚠️ Duplicate Telnyx webhook:', idempotencyKey);
      return new Response('OK', { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Verify signature
    const signature = req.headers.get('telnyx-signature-ed25519') || '';
    const timestamp = req.headers.get('telnyx-timestamp') || '';
    const credentials = integration.encrypted_credentials as any;
    const publicKey = credentials?.publicKey || credentials?.public_key;
    let signatureVerified = false;

    if (publicKey && signature && timestamp) {
      signatureVerified = await verifyTelnyxSignature(signature, timestamp, rawBody, publicKey);
      if (!signatureVerified) {
        console.warn('⚠️ Telnyx signature verification failed');
      }
    }

    // Save raw webhook
    await supabase
      .from('webhooks_received')
      .insert({
        provider: 'telnyx',
        event_type: eventType,
        provider_event_id: eventId,
        raw_payload: body,
        headers: Object.fromEntries(req.headers.entries()),
        signature_verified: signatureVerified,
        idempotency_key: idempotencyKey,
        user_id: integration.user_id,
      });

    // Update message status
    const status = event?.payload?.to?.[0]?.status || eventType;

    const updateData: any = {
      status: status === 'delivered' ? 'delivered' : 
              status === 'failed' || status === 'sending_failed' ? 'failed' : 
              'sent',
    };

    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    if (event?.payload?.errors) {
      updateData.error_message = JSON.stringify(event.payload.errors);
    }

    const { error } = await supabase
      .from('message_logs')
      .update(updateData)
      .eq('provider_message_id', messageId);

    if (error) {
      console.error('❌ Error updating message log:', error);
    }

    // Mark webhook as processed
    await supabase
      .from('webhooks_received')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('idempotency_key', idempotencyKey);

    console.log(`✅ Updated Telnyx message ${messageId} to status ${status}`);

    return new Response('OK', { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('❌ Telnyx webhook error:', error);
    return new Response('Error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});
