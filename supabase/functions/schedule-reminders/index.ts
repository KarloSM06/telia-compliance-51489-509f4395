// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { formatInTimeZone, sv } from "../_shared/timezoneUtils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Normalizes a phone number to international format
 * Assumes Swedish phone numbers if no country code is provided
 */
function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;
  
  // Remove all spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  
  // If it starts with 0, assume it's Swedish and convert to +46
  if (normalized.startsWith('0')) {
    normalized = '+46' + normalized.substring(1);
  }
  // If it doesn't start with +, assume Swedish and add +46
  else if (!normalized.startsWith('+')) {
    normalized = '+46' + normalized;
  }
  
  return normalized;
}

interface ScheduleRemindersRequest {
  calendarEventId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { calendarEventId }: ScheduleRemindersRequest = await req.json();

    console.log('Scheduling reminders for event:', calendarEventId);

    // Get calendar event
    const { data: event, error: eventError } = await supabaseClient
      .from('calendar_events')
      .select('*')
      .eq('id', calendarEventId)
      .single();

    if (eventError) throw new Error(`Failed to fetch event: ${eventError.message}`);

    // Get user's reminder settings
    const { data: settings } = await supabaseClient
      .from('reminder_settings')
      .select('*')
      .eq('user_id', event.user_id)
      .single();

    // Use defaults if no settings found
    const reminderSettings = settings || {
      booking_confirmation_enabled: true,
      booking_confirmation_channel: ['email'],
      reminder_1_enabled: true,
      reminder_1_hours_before: 48,
      reminder_1_channel: ['sms', 'email'],
      reminder_2_enabled: true,
      reminder_2_hours_before: 2,
      reminder_2_channel: ['sms'],
      review_request_enabled: true,
      review_request_hours_after: 2,
      review_request_channel: ['email'],
    };

    const scheduledMessages = [];
    const eventStartTime = new Date(event.start_time);
    const eventEndTime = new Date(event.end_time);

    // 1. Booking Confirmation (send immediately)
    if (reminderSettings.booking_confirmation_enabled && event.status !== 'cancelled') {
      const confirmationMessage = await generateMessage(supabaseClient, event, 'booking_confirmation', reminderSettings.default_template_confirmation);
      
      const channel = reminderSettings.booking_confirmation_channel.length > 1 ? 'both' : 
                     reminderSettings.booking_confirmation_channel[0] as 'sms' | 'email';

      const { data: confirmation, error } = await supabaseClient
        .from('scheduled_messages')
        .insert([{
          calendar_event_id: event.id,
          user_id: event.user_id,
          template_id: reminderSettings.default_template_confirmation,
          message_type: 'booking_confirmation',
          channel,
          recipient_name: event.contact_person || 'Kund',
          recipient_email: event.contact_email,
          recipient_phone: event.contact_phone ? normalizePhoneNumber(event.contact_phone) : null,
          scheduled_for: new Date().toISOString(),
          generated_subject: confirmationMessage.subject,
          generated_message: confirmationMessage.message,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create confirmation:', error);
      } else if (confirmation) {
        scheduledMessages.push(confirmation);
        console.log('✅ Created confirmation message:', confirmation.id);
      }
    }

    // 2. First Reminder (e.g., 48 hours before)
    if (reminderSettings.reminder_1_enabled && event.status !== 'cancelled') {
      const reminder1Time = new Date(eventStartTime.getTime() - reminderSettings.reminder_1_hours_before * 60 * 60 * 1000);
      
      if (reminder1Time > new Date()) {
        const reminderMessage = await generateMessage(supabaseClient, event, 'reminder', reminderSettings.default_template_reminder);
        
        const channel = reminderSettings.reminder_1_channel.length > 1 ? 'both' : 
                       reminderSettings.reminder_1_channel[0] as 'sms' | 'email';

        const { data: reminder1, error } = await supabaseClient
          .from('scheduled_messages')
          .insert([{
            calendar_event_id: event.id,
            user_id: event.user_id,
            template_id: reminderSettings.default_template_reminder,
            message_type: 'reminder',
            channel,
            recipient_name: event.contact_person || 'Kund',
            recipient_email: event.contact_email,
            recipient_phone: event.contact_phone ? normalizePhoneNumber(event.contact_phone) : null,
            scheduled_for: reminder1Time.toISOString(),
            generated_subject: reminderMessage.subject,
            generated_message: reminderMessage.message,
          }])
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to create reminder 1:', error);
        } else if (reminder1) {
          scheduledMessages.push(reminder1);
          console.log('✅ Created reminder 1:', reminder1.id);
        }
      }
    }

    // 3. Second Reminder (e.g., 2 hours before)
    if (reminderSettings.reminder_2_enabled && event.status !== 'cancelled') {
      const reminder2Time = new Date(eventStartTime.getTime() - reminderSettings.reminder_2_hours_before * 60 * 60 * 1000);
      
      if (reminder2Time > new Date()) {
        const reminderMessage = await generateMessage(supabaseClient, event, 'reminder', reminderSettings.default_template_reminder);
        
        const channel = reminderSettings.reminder_2_channel.length > 1 ? 'both' : 
                       reminderSettings.reminder_2_channel[0] as 'sms' | 'email';

        const { data: reminder2, error } = await supabaseClient
          .from('scheduled_messages')
          .insert([{
            calendar_event_id: event.id,
            user_id: event.user_id,
            template_id: reminderSettings.default_template_reminder,
            message_type: 'reminder',
            channel,
            recipient_name: event.contact_person || 'Kund',
            recipient_email: event.contact_email,
            recipient_phone: event.contact_phone ? normalizePhoneNumber(event.contact_phone) : null,
            scheduled_for: reminder2Time.toISOString(),
            generated_subject: reminderMessage.subject,
            generated_message: reminderMessage.message,
          }])
          .select()
          .single();

        if (error) {
          console.error('❌ Failed to create reminder 2:', error);
        } else if (reminder2) {
          scheduledMessages.push(reminder2);
          console.log('✅ Created reminder 2:', reminder2.id);
        }
      }
    }

    // 4. Review Request (after meeting)
    if (reminderSettings.review_request_enabled && event.status !== 'cancelled') {
      const reviewTime = new Date(eventEndTime.getTime() + reminderSettings.review_request_hours_after * 60 * 60 * 1000);
      
      const reviewMessage = await generateMessage(supabaseClient, event, 'review_request', reminderSettings.default_template_review);
      
      const channel = reminderSettings.review_request_channel.length > 1 ? 'both' : 
                     reminderSettings.review_request_channel[0] as 'sms' | 'email';

      const { data: review, error } = await supabaseClient
        .from('scheduled_messages')
        .insert([{
          calendar_event_id: event.id,
          user_id: event.user_id,
          template_id: reminderSettings.default_template_review,
          message_type: 'review_request',
          channel,
          recipient_name: event.contact_person || 'Kund',
          recipient_email: event.contact_email,
          recipient_phone: event.contact_phone ? normalizePhoneNumber(event.contact_phone) : null,
          scheduled_for: reviewTime.toISOString(),
          generated_subject: reviewMessage.subject,
          generated_message: reviewMessage.message,
        }])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create review request:', error);
      } else if (review) {
        scheduledMessages.push(review);
        console.log('✅ Created review request:', review.id);
      }
    }

    // Create owner notification
    await supabaseClient
      .from('owner_notifications')
      .insert([{
        user_id: event.user_id,
        calendar_event_id: event.id,
        notification_type: 'new_booking',
        title: 'Ny bokning skapad',
        message: `Bokning för ${event.contact_person || 'Kund'} - ${event.title}`,
        priority: 'medium',
        channel: ['email'],
        metadata: {
          customer_name: event.contact_person,
          customer_email: event.contact_email,
          customer_phone: event.contact_phone,
          event_time: event.start_time,
          event_title: event.title,
        },
      }]);

    console.log(`Scheduled ${scheduledMessages.length} messages for event ${calendarEventId}`);

    return new Response(
      JSON.stringify({
        success: true,
        scheduledMessages,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateMessage(supabaseClient: any, event: any, messageType: string, templateId?: string) {
  const timezone = 'Europe/Stockholm';
  const formattedDate = formatInTimeZone(
    event.start_time,
    'EEEE d MMMM yyyy',
    timezone,
    { locale: sv }
  );
  const formattedTime = formatInTimeZone(
    event.start_time,
    'HH:mm',
    timezone
  );

  let template;
  if (templateId) {
    const { data } = await supabaseClient
      .from('message_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    template = data;
  }

  if (!template) {
    template = {
      body_template: getDefaultTemplate(messageType),
      subject: getDefaultSubject(messageType),
    };
  }

  // Generate unsubscribe token for customer
  let unsubscribeToken = '';
  const customerEmail = event.contact_email;
  const customerPhone = event.contact_phone;

  if (customerEmail || customerPhone) {
    // Get or create customer preferences
    const { data: existingPrefs } = await supabaseClient
      .from('customer_preferences')
      .select('unsubscribe_token')
      .or(customerEmail ? `email.eq.${customerEmail}` : `phone.eq.${customerPhone}`)
      .maybeSingle();

    if (existingPrefs) {
      unsubscribeToken = existingPrefs.unsubscribe_token;
    } else {
      // Create new preferences entry
      const { data: newPrefs } = await supabaseClient
        .from('customer_preferences')
        .insert({
          email: customerEmail,
          phone: customerPhone,
        })
        .select('unsubscribe_token')
        .single();

      if (newPrefs) {
        unsubscribeToken = newPrefs.unsubscribe_token;
      }
    }
  }

  const variables = {
    customer_name: event.contact_person || 'Kund',
    date: formattedDate,
    time: formattedTime,
    service: event.title || 'Bokning',
    address: event.address || '',
  };

  let message = template.body_template;
  let subject = template.subject || '';

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    message = message.replace(regex, value);
    subject = subject.replace(regex, value);
  });

  return { message, subject };
}

function getDefaultTemplate(messageType: string): string {
  switch (messageType) {
    case 'booking_confirmation':
      return 'Hej {{customer_name}}! Din bokning är bekräftad för {{date}} kl {{time}}. Vi ser fram emot att träffa dig!';
    case 'reminder':
      return 'Påminnelse: Du har en bokning {{date}} kl {{time}}. Vi ses snart!\n\nSvara STOP för att sluta få påminnelser.';
    case 'review_request':
      return 'Hej {{customer_name}}! Tack för att du besökte oss. Vi skulle uppskatta om du kunde dela din upplevelse med oss.';
    default:
      return 'Meddelande om din bokning.\n\nSvara STOP för att sluta få meddelanden.';
  }
}

function getDefaultSubject(messageType: string): string {
  switch (messageType) {
    case 'booking_confirmation':
      return 'Bokningsbekräftelse';
    case 'reminder':
      return 'Påminnelse om din bokning';
    case 'review_request':
      return 'Vi vill gärna höra din feedback';
    default:
      return 'Meddelande om bokning';
  }
}
