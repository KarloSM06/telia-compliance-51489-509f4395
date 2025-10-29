import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { verifyRetellSignature } from "../_shared/signature-verification.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-retell-signature',
};

serve(async (req) => {
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

    const signature = req.headers.get('x-retell-signature') || '';
    console.log('📞 Retell webhook received:', body.event, 'token:', webhookToken);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find integration by webhook token
    const { data: integration } = await supabase
      .from('integrations')
      .select('id, user_id, encrypted_credentials')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'retell')
      .eq('is_active', true)
      .single();

    if (!integration) {
      console.log('⚠️ No active Retell integration found for this webhook token');
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

    // Generate idempotency key
    const callId = body.call?.call_id;
    const eventType = body.event;
    const idempotencyKey = callId 
      ? `retell:${callId}:${eventType}` 
      : `retell:${Date.now()}:${Math.random()}`;

    // Check for duplicate
    const { data: existing } = await supabase
      .from('webhooks_received')
      .select('id, processed')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existing) {
      console.log('⚠️ Duplicate webhook detected:', idempotencyKey);
      
      // For call_inbound, still return agent override
      if (eventType === 'call_inbound') {
        const credentials = integration.encrypted_credentials as any;
        const defaultAgentId = credentials?.defaultAgentId || credentials?.agent_id;
        
        return new Response(JSON.stringify({ 
          call_inbound: { 
            override_agent_id: defaultAgentId || null
          } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ success: true, duplicate: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify signature if secret available
    const credentials = integration.encrypted_credentials as any;
    const webhookSecret = credentials?.webhookSecret || credentials?.api_key;
    let signatureVerified = false;
    
    if (webhookSecret && signature) {
      signatureVerified = await verifyRetellSignature(signature, rawBody, webhookSecret);
      if (!signatureVerified) {
        console.warn('⚠️ Retell signature verification failed');
      }
    }

    // Save raw webhook
    const { error: webhookError } = await supabase
      .from('webhooks_received')
      .insert({
        provider: 'retell',
        event_type: eventType,
        provider_event_id: callId,
        raw_payload: body,
        headers: Object.fromEntries(req.headers.entries()),
        signature_verified: signatureVerified,
        idempotency_key: idempotencyKey,
        user_id: integration.user_id,
      });

    if (webhookError) {
      console.error('❌ Webhook log error:', webhookError);
    }

    // Handle synchronous response for call_inbound
    if (eventType === 'call_inbound') {
      console.log('📞 Returning agent override for inbound call');
      const defaultAgentId = credentials?.defaultAgentId || credentials?.agent_id;
      
      const response = new Response(JSON.stringify({ 
        call_inbound: { 
          override_agent_id: defaultAgentId || null
        } 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
      // Process async after response
      processRetellEventAsync(supabase, integration, body, callId);
      return response;
    }

    // For async events, process and return 200
    await processRetellEvent(supabase, integration, body, callId, idempotencyKey);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Retell webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processRetellEvent(supabase: any, integration: any, body: any, callId: string, idempotencyKey?: string) {
  // Normalize data
  const normalized: any = {
    call_id: callId,
    from: body.call?.from_number,
    to: body.call?.to_number,
    duration: body.call?.end_timestamp && body.call?.start_timestamp 
      ? Math.floor((body.call.end_timestamp - body.call.start_timestamp) / 1000)
      : null,
    status: body.call?.call_status,
    transcript: body.call?.transcript,
    recording_url: body.call?.recording_url,
    cost: body.call?.cost,
  };

  let eventType = 'call.unknown';
  if (body.event === 'call_started') eventType = 'call.start';
  else if (body.event === 'call_ended') eventType = 'call.end';
  else if (body.event === 'call_analyzed') eventType = 'call.analyzed';

  // Find agent
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('integration_id', integration.id)
    .eq('provider', 'retell')
    .eq('provider_agent_id', body.call?.agent_id)
    .single();

  // Insert event
  const { data: event, error: eventError } = await supabase
    .from('telephony_events')
    .insert({
      integration_id: integration.id,
      user_id: integration.user_id,
      agent_id: agent?.id,
      provider: 'retell',
      event_type: eventType,
      direction: body.call?.call_type || 'outbound',
      from_number: normalized.from,
      to_number: normalized.to,
      status: normalized.status,
      duration_seconds: normalized.duration,
      cost_amount: normalized.cost,
      provider_event_id: normalized.call_id,
      provider_payload: body,
      normalized,
      event_timestamp: body.call?.start_timestamp 
        ? new Date(body.call.start_timestamp).toISOString()
        : new Date().toISOString(),
    })
    .select()
    .single();

  if (eventError) {
    console.error('❌ Event insert error:', eventError);
    throw eventError;
  }

  console.log('✅ Retell event created:', event.id);

  // Handle recording/transcript
  if (normalized.recording_url || normalized.transcript) {
    await supabase
      .from('telephony_attachments')
      .insert({
        event_id: event.id,
        attachment_type: normalized.recording_url ? 'recording' : 'transcript',
        file_url: normalized.recording_url,
        transcript_text: normalized.transcript,
        duration_seconds: normalized.duration,
        metadata: { provider: 'retell' },
      });
  }

  // Mark webhook as processed
  if (idempotencyKey) {
    await supabase
      .from('webhooks_received')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('idempotency_key', idempotencyKey);
  }

  console.log('✅ Retell event processed:', event.id);
}

function processRetellEventAsync(supabase: any, integration: any, body: any, callId: string) {
  // Fire and forget
  processRetellEvent(supabase, integration, body, callId).catch(err => {
    console.error('❌ Async processing error:', err);
  });
}
