import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { verifyVapiSignature } from "../_shared/signature-verification.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vapi-signature',
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

    const signature = req.headers.get('x-vapi-signature') || '';
    
    console.log('📞 Vapi webhook received:', body.message?.type || body.type, 'token:', webhookToken);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find integration by webhook token
    const { data: integration } = await supabase
      .from('integrations')
      .select('id, user_id, encrypted_credentials')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'vapi')
      .eq('is_active', true)
      .single();

    if (!integration) {
      console.error('❌ No active Vapi integration found for webhook token:', webhookToken);
      console.log('📋 Debug info:', {
        provider: 'vapi',
        is_active: true,
        message_type: body.message?.type || body.type,
        hint: 'Verify that webhook_token matches the token in integrations table'
      });
      return new Response(JSON.stringify({ 
        error: 'Invalid webhook token',
        hint: 'Verify token matches integration.webhook_token in database',
        provider: 'vapi'
      }), { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Generate idempotency key
    const callId = body.call?.id || body.message?.call?.id;
    const messageId = body.message?.id;
    const idempotencyKey = callId && messageId 
      ? `vapi:${callId}:${messageId}` 
      : `vapi:${Date.now()}:${Math.random()}`;

    // Check for duplicate
    const { data: existing } = await supabase
      .from('webhooks_received')
      .select('id, processed')
      .eq('idempotency_key', idempotencyKey)
      .single();

    if (existing) {
      console.log('⚠️ Duplicate webhook detected:', idempotencyKey);
      
      // For synchronous events, still return expected response
      const messageType = body.message?.type;
      if (messageType === 'assistant-request') {
        return new Response(JSON.stringify({ 
          assistant: { firstMessage: "Hej! Hur kan jag hjälpa dig?" } 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else if (messageType === 'tool-calls') {
        return new Response(JSON.stringify({ 
          results: (body.message.toolCalls || []).map((tc: any) => ({
            toolCallId: tc.id,
            result: "Processed"
          }))
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else if (messageType === 'transfer-destination-request') {
        return new Response(JSON.stringify({ 
          destination: { type: "number", number: "+46000000000" } 
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
    const webhookSecret = credentials?.webhookSecret || credentials?.webhook_secret;
    let signatureVerified = false;
    
    if (webhookSecret && signature) {
      signatureVerified = await verifyVapiSignature(signature, rawBody, webhookSecret);
      if (!signatureVerified) {
        console.warn('⚠️ Vapi signature verification failed');
      }
    }

    // Save raw webhook
    const { error: webhookError } = await supabase
      .from('webhooks_received')
      .insert({
        provider: 'vapi',
        event_type: body.message?.type || body.type,
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

    // Handle synchronous responses FIRST
    const messageType = body.message?.type;
    
    if (messageType === 'assistant-request') {
      console.log('🤖 Returning assistant configuration');
      const response = new Response(JSON.stringify({ 
        assistant: {
          firstMessage: "Hej! Hur kan jag hjälpa dig idag?",
          model: { provider: "openai", model: "gpt-4" }
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
      // Process async after response
      processVapiEventAsync(supabase, integration, body, callId);
      return response;
    }
    
    if (messageType === 'tool-calls') {
      console.log('🔧 Returning tool call results');
      const results = (body.message.toolCalls || []).map((tc: any) => ({
        toolCallId: tc.id,
        result: `Tool ${tc.function.name} executed successfully`
      }));
      
      const response = new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
      processVapiEventAsync(supabase, integration, body, callId);
      return response;
    }
    
    if (messageType === 'transfer-destination-request') {
      console.log('📞 Returning transfer destination');
      const response = new Response(JSON.stringify({ 
        destination: { 
          type: "number", 
          number: "+46000000000" 
        } 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
      processVapiEventAsync(supabase, integration, body, callId);
      return response;
    }

    // For async events, process and return 200
    await processVapiEvent(supabase, integration, body, callId, idempotencyKey);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Vapi webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processVapiEvent(supabase: any, integration: any, body: any, callId: string, idempotencyKey?: string) {
  // Normalize data based on event type
  const normalized: any = {
    call_id: callId,
    from: body.call?.customer?.number,
    to: body.call?.phoneNumber?.number,
    duration: body.call?.duration,
    status: body.call?.status,
    transcript: body.transcript?.text || body.message?.transcript,
    cost: body.call?.cost,
    recording_url: body.call?.recordingUrl,
  };

  let eventType = 'call.unknown';
  if (body.type === 'call-started') eventType = 'call.start';
  else if (body.type === 'call-ended') eventType = 'call.end';
  else if (body.type === 'transcript') eventType = 'transcript.ready';
  else if (body.type === 'recording-available') eventType = 'recording.ready';

  // Find agent
  const { data: agent } = await supabase
    .from('agents')
    .select('id')
    .eq('integration_id', integration.id)
    .eq('provider', 'vapi')
    .eq('provider_agent_id', body.call?.assistantId)
    .single();

  // Insert event
  const { data: event, error: eventError } = await supabase
    .from('telephony_events')
    .insert({
      integration_id: integration.id,
      user_id: integration.user_id,
      agent_id: agent?.id,
      provider: 'vapi',
      event_type: eventType,
      direction: body.call?.direction || 'outbound',
      from_number: normalized.from,
      to_number: normalized.to,
      status: normalized.status,
      duration_seconds: normalized.duration,
      cost_amount: normalized.cost,
      provider_event_id: normalized.call_id,
      provider_payload: body,
      normalized,
      event_timestamp: body.timestamp || new Date().toISOString(),
    })
    .select()
    .single();

  if (eventError) {
    console.error('❌ Event insert error:', eventError);
    throw eventError;
  }

  console.log('✅ Vapi event created:', event.id);

  // Save speech events to call_events
  if (body.message?.type === 'speech-update' || body.message?.type === 'transcript') {
    await supabase.from('call_events').insert({
      call_id: event.id,
      agent_id: agent?.id,
      event_type: body.message.role === 'user' ? 'user_speech' : 'agent_response',
      timestamp: body.timestamp || new Date().toISOString(),
      text: body.message.transcript || body.message.text,
      data: {
        role: body.message.role,
        duration: body.message.duration,
        isFinal: body.message.isFinal
      }
    });
  }

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
        metadata: { provider: 'vapi' },
      });
  }

  // Mark webhook as processed
  if (idempotencyKey) {
    await supabase
      .from('webhooks_received')
      .update({ processed: true, processed_at: new Date().toISOString() })
      .eq('idempotency_key', idempotencyKey);
  }

  console.log('✅ Vapi event processed:', event.id);
}

function processVapiEventAsync(supabase: any, integration: any, body: any, callId: string) {
  // Fire and forget
  processVapiEvent(supabase, integration, body, callId).catch(err => {
    console.error('❌ Async processing error:', err);
  });
}
