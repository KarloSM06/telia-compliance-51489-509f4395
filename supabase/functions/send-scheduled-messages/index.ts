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
  channel: 'sms' | 'email' | 'both';
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

      await supabase
        .from('scheduled_messages')
        .update({ status: 'processing' })
        .eq('id', message.id);

      try {
        // Handle channel as TEXT: 'sms', 'email', or 'both'
        const channels = message.channel === 'both' 
          ? ['sms', 'email'] 
          : [message.channel];

        for (const channel of channels) {
          if (channel === 'sms' && message.recipient_phone) {
            await sendSMS(message, supabase);
          } else if (channel === 'email' && message.recipient_email) {
            await sendEmail(message, supabase);
          }
        }

        await supabase
          .from('scheduled_messages')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString()
          })
          .eq('id', message.id);

        const channelDisplay = message.channel === 'both' ? 'sms, email' : message.channel;
        
        await supabase.from('owner_notifications').insert({
          user_id: message.user_id,
          calendar_event_id: message.calendar_event_id,
          notification_type: 'message_sent',
          title: `${message.message_type} skickad`,
          message: `Meddelande skickat via ${channelDisplay} till ${message.recipient_phone || message.recipient_email}`,
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

async function getUserSMSSettings(userId: string, supabase: any) {
  const { data, error } = await supabase
    .from('sms_provider_settings')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.log('⚠️ No user SMS settings found, will use system-wide Twilio');
    return null;
  }

  return data;
}

async function sendSMS(message: ScheduledMessage, supabase: any) {
  const userSettings = await getUserSMSSettings(message.user_id, supabase);
  
  if (userSettings) {
    const credentials = JSON.parse(userSettings.encrypted_credentials);
    
    if (userSettings.provider === 'twilio') {
      return await sendViaTwilio({
        accountSid: credentials.accountSid,
        authToken: credentials.authToken,
        fromNumber: userSettings.from_phone_number,
        toNumber: message.recipient_phone!,
        body: message.message_body,
        userId: message.user_id,
        messageId: message.id,
        calendarEventId: message.calendar_event_id,
        settingsId: userSettings.id,
        supabase,
      });
    } else if (userSettings.provider === 'telnyx') {
      return await sendViaTelnyx({
        apiKey: credentials.apiKey,
        fromNumber: userSettings.from_phone_number,
        toNumber: message.recipient_phone!,
        body: message.message_body,
        userId: message.user_id,
        messageId: message.id,
        calendarEventId: message.calendar_event_id,
        settingsId: userSettings.id,
        supabase,
      });
    }
  }
  
  return await sendViaSystemTwilio(message, supabase);
}

async function sendViaTwilio(params: {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  toNumber: string;
  body: string;
  userId: string;
  messageId: string;
  calendarEventId: string;
  settingsId: string;
  supabase: any;
}) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${params.accountSid}/Messages.json`;
  const auth = btoa(`${params.accountSid}:${params.authToken}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`,
    },
    body: new URLSearchParams({
      To: params.toNumber,
      From: params.fromNumber,
      Body: params.body,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twilio error: ${error}`);
  }

  const result = await response.json();

  await params.supabase.from('message_logs').insert({
    user_id: params.userId,
    scheduled_message_id: params.messageId,
    calendar_event_id: params.calendarEventId,
    channel: 'sms',
    recipient: params.toNumber,
    message_body: params.body,
    provider: 'twilio',
    provider_type: 'user',
    sms_provider_settings_id: params.settingsId,
    provider_message_id: result.sid,
    status: 'sent',
    sent_at: new Date().toISOString(),
    cost: 0.50,
    metadata: { twilio_status: result.status },
  });

  console.log(`📱 SMS sent via user's Twilio: ${result.sid}`);
  return result;
}

async function sendViaTelnyx(params: {
  apiKey: string;
  fromNumber: string;
  toNumber: string;
  body: string;
  userId: string;
  messageId: string;
  calendarEventId: string;
  settingsId: string;
  supabase: any;
}) {
  const response = await fetch('https://api.telnyx.com/v2/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify({
      from: params.fromNumber,
      to: params.toNumber,
      text: params.body,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telnyx error: ${error}`);
  }

  const result = await response.json();

  await params.supabase.from('message_logs').insert({
    user_id: params.userId,
    scheduled_message_id: params.messageId,
    calendar_event_id: params.calendarEventId,
    channel: 'sms',
    recipient: params.toNumber,
    message_body: params.body,
    provider: 'telnyx',
    provider_type: 'user',
    sms_provider_settings_id: params.settingsId,
    provider_message_id: result.data.id,
    status: 'sent',
    sent_at: new Date().toISOString(),
    cost: 0.50,
    metadata: { telnyx_status: result.data.status },
  });

  console.log(`📱 SMS sent via user's Telnyx: ${result.data.id}`);
  return result;
}

async function sendViaSystemTwilio(message: ScheduledMessage, supabase: any) {
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

  await supabase.from('message_logs').insert({
    user_id: message.user_id,
    scheduled_message_id: message.id,
    calendar_event_id: message.calendar_event_id,
    channel: 'sms',
    recipient: message.recipient_phone,
    message_body: message.message_body,
    provider: 'twilio',
    provider_type: 'system',
    provider_message_id: result.sid,
    status: 'sent',
    sent_at: new Date().toISOString(),
    cost: 0.50,
    metadata: { twilio_status: result.status },
  });

  console.log(`📱 SMS sent via system Twilio: ${result.sid}`);
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