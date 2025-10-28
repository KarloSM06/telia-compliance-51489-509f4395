import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-retell-signature',
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

    // Normalize data
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

    // Insert event
    const { data: event, error: eventError } = await supabase
      .from('telephony_events')
      .insert({
        integration_id: integration.id,
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

    console.log('✅ Retell event processed:', event.id);
    return new Response(JSON.stringify({ success: true, event_id: event.id }), {
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
