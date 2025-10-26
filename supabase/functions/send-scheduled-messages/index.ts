import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledMessage {
  id: string;
  user_id: string;
  calendar_event_id: string;
  message_type: string;
  channel: string[];
  recipient_phone?: string;
  recipient_email?: string;
  message_body: string;
  subject?: string;
  scheduled_for: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Starting send-scheduled-messages job...');

    // Get messages that are due to be sent
    const now = new Date().toISOString();
    const { data: messages, error: fetchError } = await supabase
      .from('scheduled_messages')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error('❌ Error fetching messages:', fetchError);
      throw fetchError;
    }

    if (!messages || messages.length === 0) {
      console.log('✅ No messages to send');
      return new Response(JSON.stringify({ success: true, sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`📨 Found ${messages.length} messages to send`);

    let sentCount = 0;
    let failedCount = 0;

    for (const message of messages as ScheduledMessage[]) {
      console.log(`Processing message ${message.id} (${message.message_type})`);

      // Mark as processing
      await supabase
        .from('scheduled_messages')
        .update({ status: 'processing' })
        .eq('id', message.id);

      try {
        // Send via each channel
        for (const channel of message.channel) {
          if (channel === 'sms' && message.recipient_phone) {
            await sendSMS(message, supabase);
          } else if (channel === 'email' && message.recipient_email) {
            await sendEmail(message, supabase);
          }
        }

        // Mark as sent
        await supabase
          .from('scheduled_messages')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', message.id);

        // Create owner notification
        await supabase.from('owner_notifications').insert({
          user_id: message.user_id,
          calendar_event_id: message.calendar_event_id,
          notification_type: 'message_sent',
          title: `${message.message_type} skickad`,
          message: `Meddelande skickat via ${message.channel.join(', ')} till ${message.recipient_phone || message.recipient_email}`,
          priority: 'low',
          channel: ['email'],
          status: 'sent',
          sent_at: new Date().toISOString(),
          metadata: {
            message_type: message.message_type,
            channels: message.channel,
          },
        });

        sentCount++;
        console.log(`✅ Message ${message.id} sent successfully`);
      } catch (error) {
        console.error(`❌ Error sending message ${message.id}:`, error);
        
        // Mark as failed
        await supabase
          .from('scheduled_messages')
          .update({ 
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('id', message.id);

        failedCount++;
      }
    }

    console.log(`✅ Job complete. Sent: ${sentCount}, Failed: ${failedCount}`);

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, failed: failedCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Fatal error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function sendSMS(message: ScheduledMessage, supabase: any) {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.log('⚠️ Twilio credentials not configured, skipping SMS');
    return;
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
  const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: new URLSearchParams({
      To: message.recipient_phone!,
      From: twilioPhoneNumber,
      Body: message.message_body,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error: ${error}`);
  }

  const result = await response.json();

  // Log the message
  await supabase.from('message_logs').insert({
    user_id: message.user_id,
    scheduled_message_id: message.id,
    calendar_event_id: message.calendar_event_id,
    channel: 'sms',
    recipient: message.recipient_phone,
    message_body: message.message_body,
    provider: 'twilio',
    provider_message_id: result.sid,
    status: 'sent',
    sent_at: new Date().toISOString(),
    metadata: { twilio_status: result.status },
  });

  console.log(`📱 SMS sent via Twilio: ${result.sid}`);
}

async function sendEmail(message: ScheduledMessage, supabase: any) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');

  if (!resendApiKey) {
    console.log('⚠️ Resend API key not configured, skipping email');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: 'notifications@yourdomain.com',
      to: message.recipient_email,
      subject: message.subject || 'Påminnelse om din bokning',
      html: message.message_body.replace(/\n/g, '<br>'),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend error: ${error}`);
  }

  const result = await response.json();

  // Log the message
  await supabase.from('message_logs').insert({
    user_id: message.user_id,
    scheduled_message_id: message.id,
    calendar_event_id: message.calendar_event_id,
    channel: 'email',
    recipient: message.recipient_email,
    message_body: message.message_body,
    subject: message.subject,
    provider: 'resend',
    provider_message_id: result.id,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });

  console.log(`📧 Email sent via Resend: ${result.id}`);
}
