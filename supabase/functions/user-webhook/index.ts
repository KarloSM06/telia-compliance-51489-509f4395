import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vapi-signature, x-retell-signature',
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
    const vapiSignature = req.headers.get('x-vapi-signature');
    const retellSignature = req.headers.get('x-retell-signature');

    console.log(`📥 MCP Webhook received, token: ${webhookToken}, content-type: ${contentType}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Detect provider and route to appropriate handler
    let provider: string | null = null;
    let body: any = null;

    // Twilio uses FormData
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      const messageSid = formData.get('MessageSid');
      if (messageSid) {
        provider = 'twilio';
        body = formData;
        console.log('🔵 Detected Twilio webhook');
      }
    } else if (contentType.includes('application/json')) {
      body = await req.json();
      
      // Vapi detection
      if (vapiSignature || body.type || body.call?.phoneNumber) {
        provider = 'vapi';
        console.log('🟢 Detected Vapi webhook');
      }
      // Retell detection
      else if (retellSignature || body.event || body.call?.call_id) {
        provider = 'retell';
        console.log('🟡 Detected Retell webhook');
      }
      // Telnyx detection
      else if (body.data?.event_type || body.data?.payload) {
        provider = 'telnyx';
        console.log('🟣 Detected Telnyx webhook');
      }
    }

    if (!provider) {
      console.error('❌ Could not detect provider from webhook');
      return new Response('Could not detect provider', { status: 400, headers: corsHeaders });
    }

    // Verify webhook token for detected provider
    const { data: account } = await supabase
      .from('telephony_accounts')
      .select('id, user_id, encrypted_credentials')
      .eq('webhook_token', webhookToken)
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (!account) {
      console.log(`⚠️ No active ${provider} account found for this webhook token`);
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

    console.log(`✅ Verified webhook token for ${provider}, account: ${account.id}`);

    // Route to appropriate handler based on provider
    if (provider === 'vapi') {
      return await handleVapiWebhook(body, account, supabase);
    } else if (provider === 'retell') {
      return await handleRetellWebhook(body, account, supabase);
    } else if (provider === 'twilio') {
      return await handleTwilioWebhook(body, account, supabase);
    } else if (provider === 'telnyx') {
      return await handleTelnyxWebhook(body, account, supabase);
    }

    return new Response('Provider handler not implemented', { status: 500, headers: corsHeaders });

  } catch (error) {
    console.error('❌ MCP Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Vapi Handler
async function handleVapiWebhook(body: any, account: any, supabase: any) {
  const normalized: any = {
    call_id: body.call?.id,
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

  const { data: event, error: eventError } = await supabase
    .from('telephony_events')
    .insert({
      account_id: account.id,
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

  if (eventError) throw eventError;

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

  console.log('✅ Vapi event processed:', event.id);
  return new Response(JSON.stringify({ success: true, event_id: event.id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Retell Handler
async function handleRetellWebhook(body: any, account: any, supabase: any) {
  const normalized: any = {
    call_id: body.call?.call_id,
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

  const { data: event, error: eventError } = await supabase
    .from('telephony_events')
    .insert({
      account_id: account.id,
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

  if (eventError) throw eventError;

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

  console.log('✅ Retell event processed:', event.id);
  return new Response(JSON.stringify({ success: true, event_id: event.id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Twilio Handler
async function handleTwilioWebhook(formData: FormData, account: any, supabase: any) {
  const messageSid = formData.get('MessageSid') as string;
  const messageStatus = formData.get('MessageStatus') as string;
  const errorCode = formData.get('ErrorCode') as string;
  
  console.log(`📥 Twilio: ${messageSid} - ${messageStatus}`);

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

  if (error) throw error;

  console.log(`✅ Updated Twilio message ${messageSid} to status ${messageStatus}`);
  return new Response('OK', { 
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
  });
}

// Telnyx Handler
async function handleTelnyxWebhook(body: any, account: any, supabase: any) {
  const event = body.data;
  const messageId = event.id || event.payload?.id;
  const status = event.payload?.to?.[0]?.status || event.event_type;

  console.log(`📥 Telnyx: ${messageId} - ${status}`);

  const updateData: any = {
    status: status === 'delivered' ? 'delivered' : 
            status === 'failed' || status === 'sending_failed' ? 'failed' : 
            'sent',
  };

  if (status === 'delivered') {
    updateData.delivered_at = new Date().toISOString();
  }

  if (event.payload?.errors) {
    updateData.error_message = JSON.stringify(event.payload.errors);
  }

  const { error } = await supabase
    .from('message_logs')
    .update(updateData)
    .eq('provider_message_id', messageId);

  if (error) throw error;

  console.log(`✅ Updated Telnyx message ${messageId} to status ${status}`);
  return new Response('OK', { 
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
  });
}
