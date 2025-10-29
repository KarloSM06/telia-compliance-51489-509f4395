import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { verifyTwilioSignature, verifyTelnyxSignature, verifyVapiSignature, verifyRetellSignature } from '../_shared/signature-verification.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inline AES-GCM decryption helper
async function decryptCredentials(encryptedData: any): Promise<any> {
  const ENCRYPTION_KEY = Deno.env.get('ENCRYPTION_KEY');
  if (!ENCRYPTION_KEY) throw new Error('ENCRYPTION_KEY not configured');
  
  const keyData = new TextEncoder().encode(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );
  
  const encryptedString = typeof encryptedData === 'string' 
    ? encryptedData 
    : JSON.stringify(encryptedData);
  const encryptedBytes = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));
  
  const iv = encryptedBytes.slice(0, 12);
  const ciphertext = encryptedBytes.slice(12);
  
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    ciphertext
  );
  
  const decryptedString = new TextDecoder().decode(decryptedBuffer);
  return JSON.parse(decryptedString);
}

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

    // Get request body and headers
    const body = await req.text();
    const contentType = req.headers.get('content-type') || '';
    const allHeaders: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });

    // Detect provider from request
    let provider: string;
    let bodyData: any;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = new URLSearchParams(body);
      provider = formData.has('MessageSid') ? 'twilio' : 'unknown';
      bodyData = Object.fromEntries(formData);
    } else {
      try {
        bodyData = JSON.parse(body);
      } catch {
        bodyData = {};
      }
      // Vapi: check for message.type or call.* events
      if (bodyData.message?.type === 'status-update' || (typeof bodyData.type === 'string' && bodyData.type.startsWith('call.'))) provider = 'vapi';
      else if (bodyData.event === 'call_ended' || bodyData.event === 'call_started') provider = 'retell';
      else if (bodyData.data?.event_type) provider = 'telnyx';
      else provider = 'unknown';
    }

    console.log(`📥 Detected provider: ${provider}`);

    // Extract signature headers
    const twilioSignature = allHeaders['x-twilio-signature'] || null;
    const telnyxSignature = allHeaders['telnyx-signature-ed25519'] || null;
    const telnyxTimestamp = allHeaders['telnyx-timestamp'] || null;
    const vapiSignature = allHeaders['x-vapi-signature'] || null;
    const retellSignature = allHeaders['x-retell-signature'] || null;

    // Find telephony integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.log(`⚠️ No active ${provider} integration configured for user ${userId}`);
      // Return 200 to avoid webhook errors during testing
      return new Response(JSON.stringify({ status: 'no_active_integration', provider }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Integration found:', integration?.provider);

    // Decrypt credentials for signature verification
    let credentials: any = {};
    try {
      credentials = await decryptCredentials(integration.encrypted_credentials);
    } catch (error) {
      console.error('⚠️ Failed to decrypt credentials:', error);
      // Continue without verification if decryption fails
    }

    // Verify webhook signature
    let signatureVerified = false;
    let verificationError: string | null = null;

    if (provider === 'twilio' && twilioSignature) {
      const authToken = credentials?.authToken;
      
      if (authToken) {
        signatureVerified = await verifyTwilioSignature(
          twilioSignature,
          req.url,
          bodyData,
          authToken
        );
        if (!signatureVerified) {
          verificationError = 'Twilio signature verification failed';
        }
      } else {
        console.log('⚠️ No authToken found, accepting without verification');
      }
    } else if (provider === 'telnyx' && telnyxSignature && telnyxTimestamp) {
      const publicKey = credentials?.webhookPublicKey;
      
      if (publicKey) {
        signatureVerified = await verifyTelnyxSignature(
          telnyxSignature,
          telnyxTimestamp,
          body,
          publicKey
        );
        if (!signatureVerified) {
          verificationError = 'Telnyx signature verification failed';
        }
      } else {
        console.log('⚠️ No webhookPublicKey found, accepting without verification');
      }
    } else if (provider === 'vapi' && vapiSignature) {
      const webhookSecret = credentials?.webhookSecret;
      
      if (webhookSecret) {
        signatureVerified = await verifyVapiSignature(
          vapiSignature,
          body,
          webhookSecret
        );
        if (!signatureVerified) {
          verificationError = 'Vapi signature verification failed';
        }
      } else {
        console.log('⚠️ No webhookSecret found, accepting without verification');
      }
    } else if (provider === 'retell' && retellSignature) {
      const webhookKey = credentials?.webhookKey;
      
      if (webhookKey) {
        signatureVerified = await verifyRetellSignature(
          retellSignature,
          body,
          webhookKey
        );
        if (!signatureVerified) {
          verificationError = 'Retell signature verification failed';
        }
      } else {
        console.log('⚠️ No webhookKey found, accepting without verification');
      }
    } else {
      // No signature to verify or provider doesn't require it
      signatureVerified = true;
    }

    const processingTime = Date.now() - startTime;

    // Log webhook with signature verification
    await supabase.from('telephony_webhook_logs').insert({
      user_id: userId,
      provider: provider,
      request_method: req.method,
      request_headers: allHeaders,
      request_body: bodyData,
      response_status: signatureVerified ? 200 : 401,
      processing_time_ms: processingTime,
      webhook_signature: twilioSignature || telnyxSignature || vapiSignature || retellSignature,
      signature_verified: signatureVerified,
      verification_error: verificationError,
    });

    // If signature verification failed, reject the webhook
    if (!signatureVerified && verificationError) {
      console.error(`❌ Webhook signature verification failed: ${verificationError}`);
      return new Response(JSON.stringify({ error: verificationError }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process webhook event (create telephony_event with idempotency)
    const providerEventId = bodyData.id || bodyData.MessageSid || bodyData.data?.id || `${provider}-${Date.now()}`;
    const idempotencyKey = `${provider}:${providerEventId}`;

    // Check if already processed
    const { data: existing } = await supabase
      .from('telephony_events')
      .select('id')
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();

    if (existing) {
      console.log(`✅ Duplicate webhook ignored: ${idempotencyKey}`);
      return new Response(JSON.stringify({ status: 'duplicate' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create telephony_event for UI visibility
    console.log(`📝 Creating telephony_event with provider_event_id: ${providerEventId}`);
    
    const eventType = 
      body.type === 'call.started' || bodyData.CallStatus === 'in-progress' ? 'call.start' :
      body.type === 'call.ended' || bodyData.CallStatus === 'completed' ? 'call.end' :
      bodyData.event === 'call_started' ? 'call.start' :
      bodyData.event === 'call_ended' ? 'call.end' :
      bodyData.MessageStatus ? 'message.status' :
      bodyData.data?.event_type || 'event.other';

    const direction = 
      bodyData.call?.direction || 
      bodyData.Direction || 
      bodyData.direction ||
      (bodyData.data?.direction === 'incoming' ? 'inbound' : 'outbound') ||
      'unknown';

    const fromNumber = 
      bodyData.call?.customer?.number || 
      bodyData.From || 
      bodyData.from || 
      bodyData.data?.from?.phone_number;

    const toNumber = 
      bodyData.call?.phoneNumber?.number || 
      bodyData.To || 
      bodyData.to || 
      bodyData.data?.to?.[0]?.phone_number;

    const status = 
      bodyData.call?.status || 
      bodyData.CallStatus || 
      bodyData.MessageStatus || 
      bodyData.status ||
      bodyData.data?.status ||
      'received';

    const eventTimestamp = 
      bodyData.timestamp || 
      bodyData.data?.occurred_at || 
      new Date().toISOString();

    const { error: eventError } = await supabase
      .from('telephony_events')
      .upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: provider,
        event_type: eventType,
        direction: direction,
        from_number: fromNumber,
        to_number: toNumber,
        status: status,
        provider_event_id: providerEventId,
        provider_payload: bodyData,
        event_timestamp: eventTimestamp,
        idempotency_key: idempotencyKey,
      }, {
        onConflict: 'provider_event_id',
        ignoreDuplicates: false
      });

    if (eventError) {
      console.error('❌ Failed to create telephony_event:', eventError);
    } else {
      console.log('✅ Telephony event created successfully');
    }

    console.log(`✅ Webhook processed successfully in ${processingTime}ms`);
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
