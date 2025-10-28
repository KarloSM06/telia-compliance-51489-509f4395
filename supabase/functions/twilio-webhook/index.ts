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

    const formData = await req.formData();
    const messageSid = formData.get('MessageSid') as string;
    const messageStatus = formData.get('MessageStatus') as string;
    const errorCode = formData.get('ErrorCode') as string;
    
    console.log(`📥 Twilio webhook: ${messageSid} - ${messageStatus}, token: ${webhookToken}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify webhook token exists and is active
    const { data: integration } = await supabase
      .from('integrations')
      .select('id')
      .eq('webhook_token', webhookToken)
      .eq('provider', 'twilio')
      .eq('is_active', true)
      .single();

    if (!integration) {
      console.log('⚠️ Invalid webhook token for Twilio');
      return new Response('Invalid webhook token', { status: 404, headers: corsHeaders });
    }

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

    if (error) {
      console.error('❌ Error updating message log:', error);
      throw error;
    }

    console.log(`✅ Updated message ${messageSid} to status ${messageStatus}`);

    return new Response('OK', { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response('Error', { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }
});