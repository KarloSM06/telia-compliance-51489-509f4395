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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    console.log('Checking for scheduled messages to send...');

    // Get all pending messages that are due
    const now = new Date().toISOString();
    const { data: messages, error: fetchError } = await supabaseClient
      .from('scheduled_messages')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(50);

    if (fetchError) throw fetchError;

    console.log(`Found ${messages?.length || 0} messages to send`);

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No messages to send', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    for (const message of messages) {
      try {
        // Send via appropriate channels
        const deliveryStatus: any = {};
        let allSuccessful = true;

        // Send SMS if needed
        if ((message.channel === 'sms' || message.channel === 'both') && message.recipient_phone) {
          try {
            const smsResult = await sendSMS(message.recipient_phone, message.generated_message);
            deliveryStatus.sms_status = 'sent';
            deliveryStatus.sms_provider_id = smsResult.sid;
            
            // Log SMS
            await supabaseClient.from('message_logs').insert([{
              scheduled_message_id: message.id,
              calendar_event_id: message.calendar_event_id,
              user_id: message.user_id,
              channel: 'sms',
              recipient: message.recipient_phone,
              message_body: message.generated_message,
              status: 'delivered',
              provider: 'twilio',
              provider_message_id: smsResult.sid,
              sent_at: new Date().toISOString(),
            }]);
          } catch (smsError) {
            console.error('SMS send failed:', smsError);
            deliveryStatus.sms_status = 'failed';
            deliveryStatus.sms_error = smsError.message;
            allSuccessful = false;
          }
        }

        // Send Email if needed
        if ((message.channel === 'email' || message.channel === 'both') && message.recipient_email) {
          try {
            const emailResult = await sendEmail(
              message.recipient_email,
              message.generated_subject || 'Meddelande',
              message.generated_message,
              message.recipient_name
            );
            deliveryStatus.email_status = 'sent';
            deliveryStatus.email_provider_id = emailResult.id;
            
            // Log Email
            await supabaseClient.from('message_logs').insert([{
              scheduled_message_id: message.id,
              calendar_event_id: message.calendar_event_id,
              user_id: message.user_id,
              channel: 'email',
              recipient: message.recipient_email,
              subject: message.generated_subject,
              message_body: message.generated_message,
              status: 'delivered',
              provider: 'resend',
              provider_message_id: emailResult.id,
              sent_at: new Date().toISOString(),
            }]);
          } catch (emailError) {
            console.error('Email send failed:', emailError);
            deliveryStatus.email_status = 'failed';
            deliveryStatus.email_error = emailError.message;
            allSuccessful = false;
          }
        }

        // Update scheduled message status
        const newStatus = allSuccessful ? 'sent' : 
                         message.retry_count >= message.max_retries ? 'failed' : 'pending';
        
        await supabaseClient
          .from('scheduled_messages')
          .update({
            status: newStatus,
            sent_at: allSuccessful ? new Date().toISOString() : null,
            delivery_status: deliveryStatus,
            retry_count: message.retry_count + 1,
          })
          .eq('id', message.id);

        // Create owner notification
        await supabaseClient.from('owner_notifications').insert([{
          user_id: message.user_id,
          calendar_event_id: message.calendar_event_id,
          notification_type: allSuccessful ? 'message_sent' : 'message_failed',
          title: allSuccessful ? 'Meddelande skickat' : 'Meddelande misslyckades',
          message: allSuccessful 
            ? `${message.message_type} skickat till ${message.recipient_name}`
            : `Misslyckades att skicka ${message.message_type} till ${message.recipient_name}`,
          priority: allSuccessful ? 'low' : 'high',
          channel: ['email'],
          metadata: {
            message_id: message.id,
            delivery_status: deliveryStatus,
          },
        }]);

        results.push({
          message_id: message.id,
          status: newStatus,
          delivery_status: deliveryStatus,
        });

      } catch (error) {
        console.error(`Failed to process message ${message.id}:`, error);
        results.push({
          message_id: message.id,
          status: 'error',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: messages.length,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-scheduled-messages:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendSMS(to: string, message: string) {
  const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
  const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
  const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Twilio credentials not configured');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio API error: ${error}`);
  }

  return await response.json();
}

async function sendEmail(to: string, subject: string, message: string, name: string) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  if (!RESEND_API_KEY) {
    throw new Error('Resend API key not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Hiems <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <p style="color: #555; line-height: 1.6;">Hej ${name},</p>
          <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Detta är ett automatiskt meddelande från Hiems.
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }

  return await response.json();
}
