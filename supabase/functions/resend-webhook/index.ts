import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    const { type, data } = body;

    console.log('Resend webhook received:', type, data);

    // Get the message ID from Resend
    const resendMessageId = data.email_id;

    if (!resendMessageId) {
      console.error('No email_id in webhook data');
      return new Response(JSON.stringify({ error: 'No email_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle different event types
    switch (type) {
      case 'email.opened':
        // Update message_logs with opened_at timestamp
        const { error: openError } = await supabaseAdmin
          .from('message_logs')
          .update({ opened_at: new Date().toISOString() })
          .eq('provider_message_id', resendMessageId)
          .is('opened_at', null); // Only update if not already opened

        if (openError) {
          console.error('Error updating opened_at:', openError);
        }
        break;

      case 'email.clicked':
        // Update message_logs with clicked_at timestamp
        const { error: clickError } = await supabaseAdmin
          .from('message_logs')
          .update({ clicked_at: new Date().toISOString() })
          .eq('provider_message_id', resendMessageId)
          .is('clicked_at', null); // Only update if not already clicked

        if (clickError) {
          console.error('Error updating clicked_at:', clickError);
        }
        break;

      case 'email.bounced':
      case 'email.complained':
        // Update message_logs status to failed
        const { error: failError } = await supabaseAdmin
          .from('message_logs')
          .update({ 
            status: 'failed',
            error_message: data.bounce?.message || data.complaint?.type || 'Email bounced or complained'
          })
          .eq('provider_message_id', resendMessageId);

        if (failError) {
          console.error('Error updating failed status:', failError);
        }
        break;

      case 'email.delivered':
        // Update message_logs with delivered_at timestamp
        const { error: deliverError } = await supabaseAdmin
          .from('message_logs')
          .update({ 
            delivered_at: new Date().toISOString(),
            status: 'delivered'
          })
          .eq('provider_message_id', resendMessageId);

        if (deliverError) {
          console.error('Error updating delivered_at:', deliverError);
        }
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in resend-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
