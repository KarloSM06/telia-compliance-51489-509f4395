import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-vapi-signature',
};

serve(async (req) => {
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

    const body = await req.json();
    const signature = req.headers.get('x-vapi-signature');
    
    console.log('📞 Vapi webhook received:', body.type, 'token:', webhookToken);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find account by webhook token
    const { data: account } = await supabase
      .from('telephony_accounts')
      .select('id, user_id, encrypted_credentials')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'vapi')
      .eq('is_active', true)
      .single();

    if (!account) {
      console.log('⚠️ No active Vapi account found for this webhook token');
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

    // Normalize data based on event type
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

    // Insert event
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

    if (eventError) {
      console.error('❌ Event insert error:', eventError);
      throw eventError;
    }

    console.log('✅ Vapi event created:', event.id);

    // Handle recording/transcript
    if (normalized.recording_url || normalized.transcript) {
      const { error: attachError } = await supabase
        .from('telephony_attachments')
        .insert({
          event_id: event.id,
          attachment_type: normalized.recording_url ? 'recording' : 'transcript',
          file_url: normalized.recording_url,
          transcript_text: normalized.transcript,
          duration_seconds: normalized.duration,
          metadata: { provider: 'vapi' },
        });

      if (attachError) {
        console.error('❌ Attachment insert error:', attachError);
      }
    }

    console.log('✅ Vapi event processed:', event.id);
    return new Response(JSON.stringify({ success: true, event_id: event.id }), {
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
