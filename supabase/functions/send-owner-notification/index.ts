import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  event_type: 'new_booking' | 'booking_updated' | 'booking_cancelled' | 'new_review' | 'message_failed' | 'test';
  booking_id: string;
  title: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  start_time: string;
  end_time: string;
  user_id: string;
}

const isQuietHours = (startTime?: string, endTime?: string): boolean => {
  if (!startTime || !endTime) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const quietStart = startHour * 60 + startMin;
  const quietEnd = endHour * 60 + endMin;
  
  if (quietStart < quietEnd) {
    return currentTime >= quietStart && currentTime < quietEnd;
  } else {
    return currentTime >= quietStart || currentTime < quietEnd;
  }
};

const getNotificationContent = (eventType: string, data: NotificationRequest) => {
  const startTime = new Date(data.start_time).toLocaleString('sv-SE');
  
  switch (eventType) {
    case 'new_booking':
      return {
        title: '🎉 Ny bokning!',
        message: `${data.customer_name || 'En kund'} har bokat ${data.title} den ${startTime}`,
        emailSubject: 'Ny bokning mottagen',
        emailBody: `
          <h2>Ny bokning!</h2>
          <p>Du har fått en ny bokning:</p>
          <ul>
            <li><strong>Tjänst:</strong> ${data.title}</li>
            <li><strong>Kund:</strong> ${data.customer_name || 'Ej angiven'}</li>
            <li><strong>Email:</strong> ${data.customer_email || 'Ej angiven'}</li>
            <li><strong>Telefon:</strong> ${data.customer_phone || 'Ej angiven'}</li>
            <li><strong>Tid:</strong> ${startTime}</li>
          </ul>
          <p>Logga in i ditt Hiems-konto för att se mer information.</p>
        `,
      };
    case 'booking_cancelled':
      return {
        title: '❌ Bokning avbokad',
        message: `Bokningen ${data.title} den ${startTime} har avbokats`,
        emailSubject: 'Bokning avbokad',
        emailBody: `
          <h2>Bokning avbokad</h2>
          <p>Följande bokning har avbokats:</p>
          <ul>
            <li><strong>Tjänst:</strong> ${data.title}</li>
            <li><strong>Tid:</strong> ${startTime}</li>
          </ul>
        `,
      };
    case 'booking_updated':
      return {
        title: '📝 Bokning ändrad',
        message: `Bokningen ${data.title} har uppdaterats`,
        emailSubject: 'Bokning uppdaterad',
        emailBody: `
          <h2>Bokning uppdaterad</h2>
          <p>En bokning har ändrats:</p>
          <ul>
            <li><strong>Tjänst:</strong> ${data.title}</li>
            <li><strong>Ny tid:</strong> ${startTime}</li>
          </ul>
        `,
      };
    case 'test':
      return {
        title: '✅ Testnotifikation',
        message: 'Detta är en testnotifikation från Hiems. Allt fungerar!',
        emailSubject: 'Testnotifikation från Hiems',
        emailBody: `
          <h2>Testnotifikation</h2>
          <p>Detta är en testnotifikation för att bekräfta att dina notifikationsinställningar fungerar korrekt.</p>
          <p>Du kommer att få notiser på detta sätt när händelser inträffar i ditt Hiems-konto.</p>
        `,
      };
    default:
      return {
        title: '🔔 Notifikation',
        message: `Händelse: ${eventType}`,
        emailSubject: 'Notifikation från Hiems',
        emailBody: `<p>En händelse har inträffat: ${eventType}</p>`,
      };
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: NotificationRequest = await req.json();
    console.log('Processing notification:', requestData);

    // Get owner notification settings
    const { data: settings, error: settingsError } = await supabase
      .from('owner_notification_settings')
      .select('*')
      .eq('user_id', requestData.user_id)
      .single();

    if (settingsError || !settings) {
      console.log('No notification settings found for user:', requestData.user_id);
      return new Response(
        JSON.stringify({ message: 'No notification settings configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Get additional notification recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from('notification_recipients')
      .select('*')
      .eq('user_id', requestData.user_id)
      .eq('is_active', true);

    if (recipientsError) {
      console.error('Error fetching recipients:', recipientsError);
    }

    const allRecipients = recipients || [];

    // Check if this event type should trigger notification
    const eventTypeKey = `notify_on_${requestData.event_type}` as keyof typeof settings;
    if (requestData.event_type !== 'test' && !settings[eventTypeKey]) {
      console.log(`Notifications disabled for event type: ${requestData.event_type}`);
      return new Response(
        JSON.stringify({ message: 'Notification disabled for this event type' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    const content = getNotificationContent(requestData.event_type, requestData);
    const metadata = {
      customer_name: requestData.customer_name,
      customer_email: requestData.customer_email,
      customer_phone: requestData.customer_phone,
    };

    // Send in-app notification
    if (settings.enable_inapp_notifications) {
      const { error: inappError } = await supabase
        .from('owner_notifications')
        .insert({
          user_id: requestData.user_id,
          calendar_event_id: requestData.event_type !== 'test' ? requestData.booking_id : null,
          notification_type: requestData.event_type,
          title: content.title,
          message: content.message,
          priority: requestData.event_type === 'booking_cancelled' ? 'high' : 'medium',
          channel: ['in-app'],
          status: 'sent',
          metadata,
          sent_at: new Date().toISOString(),
        });

      if (inappError) {
        console.error('Failed to create in-app notification:', inappError);
      } else {
        console.log('In-app notification created');
      }
    }

    // Send email notification
    if (settings.enable_email_notifications && settings.notification_email) {
      console.log('Sending email to:', settings.notification_email);
      // TODO: Implement email sending via Resend
      // This would require the RESEND_API_KEY secret
    }

    // Send SMS notification (only if not quiet hours)
    if (settings.enable_sms_notifications && settings.notification_phone) {
      const inQuietHours = isQuietHours(settings.quiet_hours_start, settings.quiet_hours_end);
      
      if (!inQuietHours) {
        console.log('Sending SMS to:', settings.notification_phone);
        // TODO: Implement SMS sending via Twilio/Telnyx
        // This would require SMS provider credentials
      } else {
        console.log('Skipping SMS - quiet hours active');
      }
    }

    // Send notifications to additional recipients
    for (const recipient of allRecipients) {
      // Check if this event should notify this recipient
      const eventTypeKey = `notify_on_${requestData.event_type}` as keyof typeof recipient;
      if (requestData.event_type !== 'test' && !recipient[eventTypeKey]) {
        console.log(`Skipping recipient ${recipient.name} for event ${requestData.event_type}`);
        continue;
      }

      // Send email to recipient
      if (recipient.enable_email_notifications && recipient.email) {
        console.log(`Would send email to recipient: ${recipient.name} (${recipient.email})`);
        // TODO: Implement email sending
      }

      // Send SMS to recipient (check quiet hours)
      if (recipient.enable_sms_notifications && recipient.phone) {
        const inQuietHours = isQuietHours(recipient.quiet_hours_start, recipient.quiet_hours_end);
        if (!inQuietHours) {
          console.log(`Would send SMS to recipient: ${recipient.name} (${recipient.phone})`);
          // TODO: Implement SMS sending
        } else {
          console.log(`Skipping SMS for ${recipient.name} - quiet hours active`);
        }
      }
    }

    console.log(`Processed notifications for ${allRecipients.length + 1} recipients`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications processed',
        recipients_notified: allRecipients.length + 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('Error processing notification:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
