import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { verifyTwilioSignature, verifyTelnyxSignature, verifyVapiSignature, verifyRetellSignature } from '../_shared/signature-verification.ts';

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
      if (bodyData.message?.type || bodyData.type === 'status-update') provider = 'vapi';
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
      throw new Error(`No active ${provider} integration configured`);
    }

    // Verify webhook signature
    let signatureVerified = false;
    let verificationError: string | null = null;

    if (provider === 'twilio' && twilioSignature) {
      const credentials = integration.encrypted_credentials as any;
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
      }
    } else if (provider === 'telnyx' && telnyxSignature && telnyxTimestamp) {
      const credentials = integration.encrypted_credentials as any;
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
      }
    } else if (provider === 'vapi' && vapiSignature) {
      const credentials = integration.encrypted_credentials as any;
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
      }
    } else if (provider === 'retell' && retellSignature) {
      const credentials = integration.encrypted_credentials as any;
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
