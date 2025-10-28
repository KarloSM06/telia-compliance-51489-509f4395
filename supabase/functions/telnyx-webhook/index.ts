import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const body = await req.json();
    const event = body.data;
    
    console.log(`📥 Telnyx webhook:`, event, 'token:', webhookToken);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook token exists and is active
    const { data: integration } = await supabase
      .from('integrations')
      .select('id')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'telnyx')
      .eq('is_active', true)
      .single();

    if (!integration) {
      console.log('⚠️ Invalid webhook token for Telnyx');
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

    const messageId = event.id || event.payload?.id;
    const status = event.payload?.to?.[0]?.status || event.event_type;

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

    if (error) {
      console.error('❌ Error updating message log:', error);
      throw error;
    }

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