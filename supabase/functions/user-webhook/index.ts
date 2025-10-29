import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { verifyTwilioSignature, verifyTelnyxSignature, verifyVapiSignature, verifyRetellSignature } from '../_shared/signature-verification.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to convert Unix milliseconds timestamp to ISO 8601 format
function convertTimestamp(timestamp?: number | string): string {
  if (!timestamp) return new Date().toISOString();
  
  // If already ISO string, return as is
  if (typeof timestamp === 'string') return timestamp;
  
  // If Unix timestamp (milliseconds), convert to ISO
  return new Date(timestamp).toISOString();
}

// Helper to format phone numbers to E.164 format
function formatPhone(value?: string): string | null {
  if (!value) return null;
  
  const trimmed = value.trim();
  if (!trimmed) return null;
  
  // Already in E.164 format
  if (trimmed.startsWith('+')) return trimmed;
  
  // International format with 00 prefix
  if (trimmed.startsWith('00')) {
    return '+' + trimmed.slice(2);
  }
  
  // Swedish number starting with 0
  if (trimmed.startsWith('0')) {
    return '+46' + trimmed.slice(1);
  }
  
  // Return as-is if unknown format
  return trimmed;
}

// Helper to parse phone number from SIP header
function parseNumberFromHeader(header?: string): string | null {
  if (!header) return null;
  
  // Extract number from SIP URI or header format
  // Examples: "sip:+46702312271@...", "<sip:0702312271@...>", "\"0702312271\" <sip:...>"
  const match = header.match(/["\s<]*(?:sip:)?(\+?\d+)[@>\s]/);
  return match ? match[1] : null;
}

// Helper to find related event within time window with X-Call-Sid priority
async function findRelatedEvent(
  supabase: any,
  userId: string,
  fromNumber: string | null,
  toNumber: string | null,
  eventTimestamp: string,
  provider: string,
  xCallSid?: string  // Optional X-Call-Sid for exact matching
): Promise<any | null> {
  // PRIORITY 1: If we have X-Call-Sid, try exact match first
  if (xCallSid) {
    console.log(`🔍 Searching for call with X-Call-Sid: ${xCallSid}`);
    
    // Search directly on x_call_sid column (indexed, reliable)
    const { data: exactMatch } = await supabase
      .from('telephony_events')
      .select('*')
      .eq('user_id', userId)
      .neq('provider', provider)
      .is('parent_event_id', null)
      .eq('x_call_sid', xCallSid)
      .limit(1)
      .maybeSingle();
    
    if (exactMatch) {
      console.log(`✅ Found exact match via X-Call-Sid: ${exactMatch.id} (${exactMatch.provider})`);
      return exactMatch;
    }
    
    console.log(`⚠️ No exact X-Call-Sid match found, falling back to phone + time window`);
  }
  
  // PRIORITY 2: Fallback to phone number + time window matching
  if (!fromNumber && !toNumber) {
    console.log('⚠️ No phone numbers or X-Call-Sid available for matching');
    return null;
  }
  
  const timeWindow = 30000; // 30 seconds
  const eventTime = new Date(eventTimestamp);
  const startTime = new Date(eventTime.getTime() - timeWindow);
  const endTime = new Date(eventTime.getTime() + timeWindow);
  
  console.log(`🔍 Searching with phone numbers: from=${fromNumber}, to=${toNumber}, window=±30s`);
  
  // Build phone number filter - check if either from or to matches
  let phoneFilter = '';
  if (fromNumber && toNumber) {
    phoneFilter = `from_number.eq.${fromNumber},to_number.eq.${fromNumber},from_number.eq.${toNumber},to_number.eq.${toNumber}`;
  } else if (fromNumber) {
    phoneFilter = `from_number.eq.${fromNumber},to_number.eq.${fromNumber}`;
  } else if (toNumber) {
    phoneFilter = `from_number.eq.${toNumber},to_number.eq.${toNumber}`;
  }
  
  if (!phoneFilter) return null;
  
  const { data } = await supabase
    .from('telephony_events')
    .select('*')
    .eq('user_id', userId)
    .neq('provider', provider)
    .is('parent_event_id', null)
    .or(phoneFilter)
    .gte('event_timestamp', startTime.toISOString())
    .lte('event_timestamp', endTime.toISOString())
    .order('event_timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (data) {
    console.log(`✅ Found match via phone + time: ${data.id} (${data.provider})`);
  } else {
    console.log(`❌ No matching event found`);
  }
  
  return data;
}

// Helper to normalize costs to SEK for aggregation
function normalizeCostToSEK(amount: number, currency: string): number {
  const SEK_TO_USD = 10.5;
  
  if (currency === 'USD') {
    return amount * SEK_TO_USD; // Convert USD to SEK
  }
  return amount; // Already SEK
}

// Helper to aggregate costs and link events
async function aggregateCosts(
  supabase: any,
  parentEventId: string,
  childEvent: any
): Promise<void> {
  const { data: parentEvent } = await supabase
    .from('telephony_events')
    .select('*')
    .eq('id', parentEventId)
    .single();
  
  if (!parentEvent) return;
  
  const currentCostBreakdown = parentEvent.cost_breakdown || {};
  const currentRelatedEvents = parentEvent.related_events || [];
  
  // Add child provider to cost breakdown (keep original currency)
  const newCostBreakdown = {
    ...currentCostBreakdown,
    [childEvent.provider]: {
      amount: childEvent.cost_amount || 0,
      currency: childEvent.cost_currency || 'USD',
      layer: childEvent.provider_layer || 'telephony'
    }
  };
  
  // Calculate total cost in SEK by normalizing all currencies
  const totalCostSEK = Object.values(newCostBreakdown).reduce(
    (sum: number, item: any) => {
      const normalizedAmount = normalizeCostToSEK(Number(item.amount) || 0, item.currency);
      return sum + normalizedAmount;
    }, 
    0
  );
  
  console.log(`💰 Updating parent event ${parentEventId} with aggregated cost: ${totalCostSEK.toFixed(2)} SEK (≈ $${(totalCostSEK / 10.5).toFixed(4)} USD)`);
  
  // Update parent event
  await supabase
    .from('telephony_events')
    .update({
      aggregate_cost_amount: totalCostSEK,
      cost_currency: 'SEK',
      cost_breakdown: newCostBreakdown,
      related_events: [...currentRelatedEvents, childEvent.id]
    })
    .eq('id', parentEventId);
  
  console.log(`   Breakdown:`, Object.entries(newCostBreakdown).map(([p, d]: [string, any]) => 
    `${p}: ${d.amount} ${d.currency}`
  ).join(', '));
}

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

// Helper to calculate Twilio SMS cost
async function calculateTwilioSmsCost(
  supabase: any,
  fromNumber: string,
  toNumber: string,
  numSegments: number,
  integrationId: string
): Promise<{ usd: number; direction: string }> {
  console.log(`📊 Twilio SMS cost calculation:
    - From: ${fromNumber}
    - To: ${toNumber}
    - Segments: ${numSegments}`);
  
  // Verify direction against owned numbers
  const { data: toNumberOwned } = await supabase
    .from('phone_numbers')
    .select('phone_number')
    .eq('integration_id', integrationId)
    .eq('phone_number', toNumber)
    .maybeSingle();
  
  const { data: fromNumberOwned } = await supabase
    .from('phone_numbers')
    .select('phone_number')
    .eq('integration_id', integrationId)
    .eq('phone_number', fromNumber)
    .maybeSingle();
  
  let finalDirection: string;
  if (toNumberOwned) {
    finalDirection = 'inbound';
    console.log(`🔍 Ownership: To (${toNumber}) is OWNED → inbound`);
  } else if (fromNumberOwned) {
    finalDirection = 'outbound';
    console.log(`🔍 Ownership: From (${fromNumber}) is OWNED → outbound`);
  } else {
    finalDirection = 'outbound'; // default
    console.log(`🔍 Ownership: Neither owned → defaulting to outbound`);
  }
  
  // Twilio SMS pricing (Sweden):
  // Inbound: $0.0075/segment
  // Outbound: $0.0445/segment
  const usdPerSegment = finalDirection === 'inbound' ? 0.0075 : 0.0445;
  const usdCost = numSegments * usdPerSegment;
  
  console.log(`💵 SMS Cost: ${numSegments} segments × $${usdPerSegment}/segment = $${usdCost.toFixed(4)} USD (${finalDirection})`);
  
  return { usd: usdCost, direction: finalDirection };
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
      // Vapi: detect message wrapper or direct call/assistant data
      if (
        bodyData.message?.type || 
        bodyData.message?.call || 
        bodyData.call?.assistantId || 
        bodyData.assistant?.id ||
        bodyData.type === 'call-started' ||
        bodyData.type === 'call-ended'
      ) {
        provider = 'vapi';
      } else if (bodyData.event === 'call_ended' || bodyData.event === 'call_started') {
        provider = 'retell';
      } else if (bodyData.data?.event_type) {
        provider = 'telnyx';
      } else {
        provider = 'unknown';
      }
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

    // Vapi-specific two-step handling
    if (provider === 'vapi') {
      const messageType = bodyData.message?.type;
      const callId = bodyData.message?.call?.id;
      
      if (!callId) {
        console.warn('⚠️ No call ID in Vapi webhook');
      }

      const isStatusUpdate = messageType === 'status-update';
      const isEndOfCallReport = messageType === 'end-of-call-report';

      if (isStatusUpdate) {
        // CREATE new call event
        const idempotencyKey = `vapi:status-update:${callId}:${bodyData.message?.timestamp || Date.now()}`;
        
        // Check if call already exists
        const { data: existingCall } = await supabase
          .from('telephony_events')
          .select('id')
          .eq('provider_event_id', callId)
          .maybeSingle();

        if (existingCall) {
          console.log('✅ Status update already processed for call:', callId);
          return new Response(JSON.stringify({ success: true, message: 'Already processed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const callData = bodyData.message?.call || {};
        const direction = callData.type === 'inboundPhoneCall' ? 'inbound' : 'outbound';
        
        // Extract phone number (only from_number, to_number is always null)
        const fromRaw = callData.customer?.number || 
                        bodyData.message?.customer?.number || 
                        parseNumberFromHeader(callData.phoneCallProviderDetails?.sip?.headers?.['p-asserted-identity']);
        
        const fromNumber = formatPhone(fromRaw);
        
        // Extract X-Call-Sid from Vapi transport
        const xCallSid = callData.transport?.callSid || bodyData.message?.call?.transport?.callSid;
        
        console.log('📞 Phone number:', { fromRaw, from: fromNumber });
        console.log('🔑 X-Call-Sid:', xCallSid);

        // Store initial call data
        const { data: newEvent, error: createError } = await supabase
          .from('telephony_events')
          .insert({
            user_id: userId,
            integration_id: integration.id,
            provider: 'vapi',
            provider_event_id: callId,
            event_type: 'call.start',
            direction: direction,
            from_number: fromNumber,
            to_number: null,
            status: callData.status || 'in-progress',
            provider_layer: 'agent',
            x_call_sid: xCallSid,
            cost_breakdown: {},
            normalized: {
              callId: callId,
              xCallSid: xCallSid,
              messageType: messageType,
              call: callData,
              phoneNumber: bodyData.message?.phoneNumber,
              customer: bodyData.message?.customer,
              assistant: bodyData.message?.assistant,
              timestamp: bodyData.message?.timestamp
            },
            event_timestamp: convertTimestamp(bodyData.message?.call?.createdAt || bodyData.message?.timestamp),
            idempotency_key: idempotencyKey,
            provider_payload: bodyData
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Error creating Vapi call event:', createError);
        } else {
          console.log('✅ Vapi call created with ID:', callId);
          
          // Try to find and link related Telnyx/Twilio event
          if (newEvent && (fromNumber || xCallSid)) {
            const relatedEvent = await findRelatedEvent(
              supabase,
              userId,
              fromNumber,
              null,
              convertTimestamp(bodyData.message?.timestamp),
              'vapi',
              xCallSid  // Pass X-Call-Sid for exact matching
            );
            
            if (relatedEvent) {
              console.log(`🔗 Found related ${relatedEvent.provider} event, linking...`);
              
              // Update related event to point to this Vapi event as parent
              await supabase
                .from('telephony_events')
                .update({
                  parent_event_id: newEvent.id,
                  provider_layer: 'telephony'
                })
                .eq('id', relatedEvent.id);
              
              // Aggregate costs
              await aggregateCosts(supabase, newEvent.id, relatedEvent);
            }
          }
        }

      } else if (isEndOfCallReport) {
        // UPDATE existing call event
        const idempotencyKey = `vapi:end-of-call-report:${callId}`;

        // Find existing event
        const { data: existingEvent } = await supabase
          .from('telephony_events')
          .select('*')
          .eq('provider_event_id', callId)
          .maybeSingle();

        if (!existingEvent) {
          console.warn('⚠️ No existing call found for end-of-call-report:', callId);
          // Fallback: Create new event with full data
          const callData = bodyData.message?.call || {};
          const direction = callData.type === 'inboundPhoneCall' ? 'inbound' : 'outbound';
          
          const fromRaw = callData.customer?.number || 
                          bodyData.message?.customer?.number || 
                          parseNumberFromHeader(callData.phoneCallProviderDetails?.sip?.headers?.['p-asserted-identity']);
          
          const fromNumber = formatPhone(fromRaw);
          
          console.log('📞 Phone number (fallback):', { fromRaw, from: fromNumber });

          await supabase
            .from('telephony_events')
            .insert({
              user_id: userId,
              integration_id: integration.id,
              provider: 'vapi',
              provider_event_id: callId,
              event_type: 'call.end',
              direction: direction,
              from_number: fromNumber,
              to_number: null,
              status: bodyData.message?.endedReason || 'completed',
              normalized: {
                callId: callId,
                messageType: messageType,
                transcript: bodyData.message?.transcript,
                summary: bodyData.message?.analysis?.summary,
                successEvaluation: bodyData.message?.analysis?.successEvaluation,
                cost: bodyData.message?.cost,
                costBreakdown: bodyData.message?.costBreakdown,
                durationMs: bodyData.message?.durationMs,
                durationSeconds: bodyData.message?.durationSeconds,
                durationMinutes: bodyData.message?.durationMinutes,
                recordingUrl: bodyData.message?.recordingUrl,
                stereoRecordingUrl: bodyData.message?.stereoRecordingUrl,
                startedAt: convertTimestamp(bodyData.message?.startedAt),
                endedAt: convertTimestamp(bodyData.message?.endedAt),
                endedReason: bodyData.message?.endedReason,
                messages: bodyData.message?.artifact?.messages || bodyData.message?.messages,
                assistant: bodyData.message?.assistant,
                call: bodyData.message?.call,
                analysis: bodyData.message?.analysis
              },
              duration_seconds: Math.round(Number(bodyData.message?.durationSeconds) || 0),
              cost_amount: Number(bodyData.message?.cost ?? bodyData.message?.costBreakdown?.total ?? 0),
              cost_currency: 'USD',
              event_timestamp: convertTimestamp(bodyData.message?.endedAt),
              idempotency_key: idempotencyKey,
              provider_payload: bodyData
            });
        } else {
          // Update existing event with end-of-call data
          const updatedNormalized = {
            ...existingEvent.normalized,
            transcript: bodyData.message?.transcript,
            summary: bodyData.message?.analysis?.summary,
            successEvaluation: bodyData.message?.analysis?.successEvaluation,
            cost: bodyData.message?.cost,
            costBreakdown: bodyData.message?.costBreakdown,
            durationMs: bodyData.message?.durationMs,
            durationSeconds: bodyData.message?.durationSeconds,
            durationMinutes: bodyData.message?.durationMinutes,
            recordingUrl: bodyData.message?.recordingUrl,
            stereoRecordingUrl: bodyData.message?.stereoRecordingUrl,
            startedAt: convertTimestamp(bodyData.message?.startedAt),
            endedAt: convertTimestamp(bodyData.message?.endedAt),
            endedReason: bodyData.message?.endedReason,
            messages: bodyData.message?.artifact?.messages || bodyData.message?.messages,
            analysis: bodyData.message?.analysis,
            costs: bodyData.message?.costs
          };

          const durationSeconds = Math.round(Number(bodyData.message?.durationSeconds) || 0);
          const costAmount = Number(bodyData.message?.cost ?? bodyData.message?.costBreakdown?.total ?? 0);
          
          // Update cost breakdown for Vapi
          const currentCostBreakdown = existingEvent.cost_breakdown || {};
          const updatedCostBreakdown = {
            ...currentCostBreakdown,
            vapi: {
              amount: costAmount,
              currency: 'USD',
              layer: 'agent'
            }
          };
          
          // Recalculate aggregate cost
          const aggregateCost = Object.values(updatedCostBreakdown).reduce(
            (sum: number, item: any) => sum + (Number(item.amount) || 0), 
            0
          );
          
          const { error: updateError } = await supabase
            .from('telephony_events')
            .update({
              event_type: 'call.end',
              status: bodyData.message?.endedReason || 'completed',
              normalized: updatedNormalized,
              duration_seconds: durationSeconds,
              cost_amount: costAmount,
              cost_currency: 'USD',
              cost_breakdown: updatedCostBreakdown,
              aggregate_cost_amount: aggregateCost,
              event_timestamp: convertTimestamp(bodyData.message?.endedAt),
              provider_payload: bodyData
            })
            .eq('id', existingEvent.id);

          if (updateError) {
            console.error('❌ Error updating Vapi call event:', updateError);
            console.error('Update details:', { 
              callId, 
              durationRaw: bodyData.message?.durationSeconds, 
              durationParsed: durationSeconds,
              costRaw: bodyData.message?.cost,
              costParsed: costAmount
            });
          } else {
            console.log('✅ Vapi call updated:', existingEvent.id);
          }
        }
      }
    } else {
      // Non-Vapi providers: Use original logic
      
      // Special handling for Telnyx: only process call.hangup, ignore initiated/answered
      if (provider === 'telnyx') {
        const telnyxEventType = bodyData.data?.event_type;
        const callSessionId = bodyData.data?.payload?.call_session_id || bodyData.data?.id;
        
        // Ignore call.initiated and call.answered - we only want call.hangup
        if (telnyxEventType === 'call.initiated' || telnyxEventType === 'call.answered') {
          console.log(`⏭️ Skipping Telnyx ${telnyxEventType} event - waiting for call.hangup`);
          return new Response(JSON.stringify({ status: 'skipped', reason: 'waiting_for_hangup' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        // Only process call.hangup
        if (telnyxEventType === 'call.hangup') {
          const idempotencyKey = `telnyx:${callSessionId}:hangup`;
          
          // Check if already processed
          const { data: existing } = await supabase
            .from('telephony_events')
            .select('id')
            .eq('idempotency_key', idempotencyKey)
            .maybeSingle();

          if (existing) {
            console.log(`✅ Duplicate Telnyx call.hangup ignored: ${idempotencyKey}`);
            return new Response(JSON.stringify({ status: 'duplicate' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          
          // Extract call data
          const payload = bodyData.data?.payload;
          const fromNumber = payload?.from;
          const toNumber = payload?.to;
          const direction = payload?.direction === 'incoming' ? 'inbound' : 'outbound';
          
          // Extract X-Call-Sid from custom_headers
          const customHeaders = payload?.custom_headers || [];
          const xCallSidHeader = customHeaders.find((h: any) => h.name === 'X-Call-Sid');
          const xCallSid = xCallSidHeader?.value;
          
          console.log('🔑 Telnyx X-Call-Sid:', xCallSid);
          
          // Calculate duration from start_time and end_time
          let durationSeconds = 0;
          if (payload?.start_time && payload?.end_time) {
            const startTime = new Date(payload.start_time);
            const endTime = new Date(payload.end_time);
            durationSeconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
          }
          
          // Calculate Telnyx cost based on direction and duration
          const calculateTelnyxCost = async (
            durationSec: number, 
            directionFromPayload: string | null,
            fromNumber: string,
            toNumber: string,
            integrationId: string
          ): Promise<{ usd: number; direction: string }> => {
            const minutes = durationSec / 60;
            
            console.log(`📊 Telnyx cost calculation START:
    - Duration: ${durationSec}s (${minutes.toFixed(4)} min)
    - From: ${fromNumber}
    - To: ${toNumber}
    - Direction from payload: ${directionFromPayload || 'MISSING'}`);
            
            // ALWAYS verify direction against owned numbers (don't trust payload blindly)
            const { data: toNumberOwned } = await supabase
              .from('phone_numbers')
              .select('phone_number, integration_id')
              .eq('integration_id', integrationId)
              .eq('phone_number', toNumber)
              .maybeSingle();
            
            const { data: fromNumberOwned } = await supabase
              .from('phone_numbers')
              .select('phone_number, integration_id')
              .eq('integration_id', integrationId)
              .eq('phone_number', fromNumber)
              .maybeSingle();
            
            console.log(`🔍 Ownership check:
    - To (${toNumber}): ${toNumberOwned ? '✅ OWNED' : '❌ NOT OWNED'}
    - From (${fromNumber}): ${fromNumberOwned ? '✅ OWNED' : '❌ NOT OWNED'}`);
            
            // Logic:
            // - If toNumber is owned => INBOUND (someone called our number)
            // - Else if fromNumber is owned => OUTBOUND (we called someone)
            // - Else => use payload direction or default to 'outbound'
            let finalDirection: string;
            if (toNumberOwned) {
              finalDirection = 'inbound';
              if (directionFromPayload !== 'inbound') {
                console.log(`⚠️ Direction mismatch! Payload says '${directionFromPayload}' but toNumber is owned → forcing 'inbound'`);
              }
            } else if (fromNumberOwned) {
              finalDirection = 'outbound';
              if (directionFromPayload !== 'outbound') {
                console.log(`⚠️ Direction mismatch! Payload says '${directionFromPayload}' but fromNumber is owned → forcing 'outbound'`);
              }
            } else {
              finalDirection = directionFromPayload || 'outbound';
              console.log(`⚠️ Neither number is owned! Using payload direction: ${finalDirection}`);
            }
            
            // Pricing: inbound $0.006/min, outbound $0.02/min (Swedish rates)
            const usdPerMin = finalDirection === 'inbound' ? 0.006 : 0.02;
            const usdCost = minutes * usdPerMin;
            
            console.log(`💵 Final calculation: ${minutes.toFixed(4)} min × $${usdPerMin}/min = $${usdCost.toFixed(6)} USD (${finalDirection})`);
            
            return { usd: usdCost, direction: finalDirection };
          };
          
          const { usd: costAmount, direction: finalDirection } = await calculateTelnyxCost(
            durationSeconds,
            direction,
            fromNumber,
            toNumber,
            integration.id
          );
          const costCurrency = 'USD'; // Store in USD for easier aggregation with Vapi
          
          console.log(`📞 Processing Telnyx call.hangup: ${durationSeconds}s, direction: ${finalDirection}, cost: ${costAmount.toFixed(4)} ${costCurrency}`);
          
          // Try to find related Vapi/Retell event with X-Call-Sid priority
          const relatedAgentEvent = await findRelatedEvent(
            supabase,
            integration.user_id,
            fromNumber,
            toNumber,
            payload?.end_time || new Date().toISOString(),
            provider,
            xCallSid  // Pass X-Call-Sid for exact matching
          );
          
          let parentEventId = null;
          let providerLayer = 'standalone';
          
          if (relatedAgentEvent && ['vapi', 'retell'].includes(relatedAgentEvent.provider)) {
            parentEventId = relatedAgentEvent.id;
            providerLayer = 'telephony';
            console.log(`🔗 Linking Telnyx call to ${relatedAgentEvent.provider} event ${parentEventId}`);
            
            // Update parent event duration with Telnyx duration if greater
            const currentNormalized = relatedAgentEvent.normalized as any || {};
            const parentDuration = relatedAgentEvent.duration_seconds || 0;
            
            if (durationSeconds > parentDuration) {
              await supabase
                .from('telephony_events')
                .update({
                  duration_seconds: durationSeconds,
                  normalized: {
                    ...currentNormalized,
                    telnyxDurationSeconds: durationSeconds,
                  }
                })
                .eq('id', relatedAgentEvent.id);
              
              console.log(`⏱️ Updated parent duration: ${parentDuration}s → ${durationSeconds}s`);
            }
          }
          
          // Create the aggregated Telnyx event
          const { data: newEvent, error: eventError } = await supabase
            .from('telephony_events')
            .insert({
              integration_id: integration.id,
              user_id: integration.user_id,
              provider: 'telnyx',
              event_type: 'call.end',
              direction: finalDirection,
              from_number: fromNumber,
              to_number: toNumber,
              status: payload?.hangup_cause || 'completed',
              provider_event_id: callSessionId,
              x_call_sid: xCallSid,
              provider_payload: bodyData,
              normalized: {
                call_session_id: callSessionId,
                xCallSid: xCallSid,
                start_time: payload?.start_time,
                end_time: payload?.end_time,
                duration_seconds: durationSeconds,
                hangup_source: payload?.hangup_source,
                hangup_cause: payload?.hangup_cause,
                call_quality: payload?.call_quality_stats,
                from: fromNumber,
                to: toNumber,
                direction: finalDirection
              },
              duration_seconds: durationSeconds,
              event_timestamp: payload?.end_time || new Date().toISOString(),
              idempotency_key: idempotencyKey,
              parent_event_id: parentEventId,
              provider_layer: providerLayer,
              cost_amount: costAmount,
              cost_currency: costCurrency,
              cost_breakdown: {
                telnyx: {
                  amount: costAmount,
                  currency: costCurrency,
                  layer: providerLayer
                }
              },
              aggregate_cost_amount: costAmount,
            })
            .select()
            .single();

          if (eventError) {
            console.error('❌ Failed to create Telnyx event:', eventError);
          } else {
            console.log('✅ Telnyx call.hangup event created successfully');
            
            // If we linked to a parent, aggregate costs
            if (newEvent && parentEventId) {
              await aggregateCosts(supabase, parentEventId, newEvent);
            }
          }
          
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
      
      // Original logic for other providers (Twilio, Retell standalone)
      const providerEventId = 
        bodyData.id || 
        bodyData.MessageSid || 
        bodyData.data?.id || 
        `${provider}-${Date.now()}`;
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

      const eventType = 
        bodyData.CallStatus === 'in-progress' ? 'call.start' :
        bodyData.CallStatus === 'completed' ? 'call.end' :
        (bodyData.MessageStatus || bodyData.SmsStatus) ? 'message' :
        bodyData.event === 'call_started' ? 'call.start' :
        bodyData.event === 'call_ended' ? 'call.end' :
        bodyData.data?.event_type || 
        'event.other';

      const direction = 
        bodyData.Direction || 
        bodyData.direction ||
        (bodyData.data?.direction === 'incoming' ? 'inbound' : 'outbound') ||
        'unknown';

      const fromNumber = 
        bodyData.From || 
        bodyData.from || 
        bodyData.data?.from?.phone_number;

      const toNumber = 
        bodyData.To || 
        bodyData.to || 
        bodyData.data?.to?.[0]?.phone_number;

      const status = 
        bodyData.CallStatus || 
        bodyData.MessageStatus || 
        bodyData.SmsStatus ||
        bodyData.status ||
        bodyData.data?.status ||
        'received';

      const eventTimestamp = 
        bodyData.timestamp || 
        bodyData.data?.occurred_at || 
        new Date().toISOString();
      
      // Extract cost for Twilio/Retell
      let costAmount = bodyData.price ? Math.abs(Number(bodyData.price)) : 0;
      let costCurrency = bodyData.price_unit || 'USD';
      let finalDirection = direction;

      // Special handling for Twilio SMS (no price field in webhook)
      if (provider === 'twilio' && (bodyData.SmsStatus || bodyData.MessageStatus)) {
        const numSegments = parseInt(bodyData.NumSegments || '1');
        const smsCalculation = await calculateTwilioSmsCost(
          supabase,
          fromNumber,
          toNumber,
          numSegments,
          integration.id
        );
        costAmount = smsCalculation.usd;
        finalDirection = smsCalculation.direction;
        console.log(`📱 Twilio SMS: ${finalDirection} with ${numSegments} segments = $${costAmount.toFixed(4)} USD`);
      }

      // Try to find related Vapi/Retell event first
      const relatedAgentEvent = await findRelatedEvent(
        supabase,
        integration.user_id,
        fromNumber,
        toNumber,
        eventTimestamp,
        provider
      );
      
      let parentEventId = null;
      let providerLayer = 'standalone';
      
      if (relatedAgentEvent && ['vapi', 'retell'].includes(relatedAgentEvent.provider)) {
        // Found a matching agent event, link to it
        parentEventId = relatedAgentEvent.id;
        providerLayer = 'telephony';
        console.log(`🔗 Linking ${provider} event to ${relatedAgentEvent.provider} event ${parentEventId}`);
      }

      const { data: newEvent, error: eventError } = await supabase
        .from('telephony_events')
        .insert({
          integration_id: integration.id,
          user_id: integration.user_id,
          provider: provider,
          event_type: eventType,
          direction: finalDirection,
          from_number: fromNumber,
          to_number: toNumber,
          status: status,
          provider_event_id: providerEventId,
          provider_payload: bodyData,
          normalized: {
            ...bodyData,
            numSegments: bodyData.NumSegments ? parseInt(bodyData.NumSegments) : 1,
            calculatedDirection: finalDirection
          },
          event_timestamp: eventTimestamp,
          idempotency_key: idempotencyKey,
          parent_event_id: parentEventId,
          provider_layer: providerLayer,
          cost_amount: costAmount,
          cost_currency: costCurrency,
          cost_breakdown: {
            [provider]: {
              amount: costAmount,
              currency: costCurrency,
              layer: providerLayer
            }
          },
          aggregate_cost_amount: costAmount,
        })
        .select()
        .single();

      if (eventError) {
        console.error('❌ Failed to create telephony_event:', eventError);
      } else {
        console.log('✅ Telephony event created successfully');
        
        // If we linked to a parent, aggregate costs
        if (newEvent && parentEventId) {
          await aggregateCosts(supabase, parentEventId, newEvent);
        }

        // If this is an SMS, also save to message_logs for SMS-specific tracking
        console.log(`🔍 Checking SMS save conditions: eventType="${eventType}", newEvent=${!!newEvent}`);
        if (eventType === 'message' && newEvent) {
          console.log('✅ Conditions met, saving to message_logs...');
          const messageLogData = {
            user_id: integration.user_id,
            integration_id: integration.id,
            channel: 'sms' as const,
            recipient: finalDirection === 'outbound' ? toNumber : fromNumber,
            message_body: bodyData.Body || bodyData.text || '',
            provider: provider,
            provider_type: integration.provider_type, // Fixed: use integration.provider_type
            provider_message_id: bodyData.MessageSid || bodyData.SmsSid || externalCallId,
            status: bodyData.SmsStatus === 'received' ? 'delivered' : 
                    bodyData.SmsStatus === 'sent' ? 'sent' :
                    bodyData.MessageStatus === 'delivered' ? 'delivered' :
                    bodyData.MessageStatus === 'failed' || bodyData.MessageStatus === 'undelivered' ? 'failed' :
                    'sent',
            sent_at: new Date().toISOString(),
            delivered_at: (bodyData.SmsStatus === 'received' || bodyData.MessageStatus === 'delivered') 
              ? new Date().toISOString() 
              : null,
            cost: costAmount,
            metadata: {
              from: fromNumber,
              to: toNumber,
              direction: finalDirection,
              numSegments: bodyData.NumSegments ? parseInt(bodyData.NumSegments) : 1,
              provider_status: bodyData.SmsStatus || bodyData.MessageStatus,
              event_id: newEvent.id,
            },
          };

          const { error: messageLogError } = await supabase
            .from('message_logs')
            .insert(messageLogData);

          if (messageLogError) {
            console.error('❌ Failed to insert message_log:', messageLogError);
          } else {
            console.log(`📨 Saved SMS to message_logs: ${messageLogData.provider_message_id}`);
          }
        }
      }
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
