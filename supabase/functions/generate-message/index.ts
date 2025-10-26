import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateMessageRequest {
  templateId?: string;
  calendarEventId: string;
  messageType: 'booking_confirmation' | 'reminder' | 'review_request' | 'cancellation';
  customVariables?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { templateId, calendarEventId, messageType, customVariables = {} }: GenerateMessageRequest = await req.json();

    // Get calendar event data
    const { data: event, error: eventError } = await supabaseClient
      .from('calendar_events')
      .select('*')
      .eq('id', calendarEventId)
      .single();

    if (eventError) throw new Error(`Failed to fetch event: ${eventError.message}`);

    // Get template
    let template;
    if (templateId) {
      const { data, error } = await supabaseClient
        .from('message_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (error) throw new Error(`Failed to fetch template: ${error.message}`);
      template = data;
    } else {
      // Get default template for this message type
      const { data: settings } = await supabaseClient
        .from('reminder_settings')
        .select('*')
        .eq('user_id', event.user_id)
        .single();

      if (settings) {
        const defaultTemplateId = 
          messageType === 'booking_confirmation' ? settings.default_template_confirmation :
          messageType === 'reminder' ? settings.default_template_reminder :
          messageType === 'review_request' ? settings.default_template_review :
          null;

        if (defaultTemplateId) {
          const { data } = await supabaseClient
            .from('message_templates')
            .select('*')
            .eq('id', defaultTemplateId)
            .single();
          template = data;
        }
      }
    }

    // If no template found, create a default message
    if (!template) {
      template = {
        body_template: getDefaultTemplate(messageType),
        tone: 'friendly',
        language: 'sv',
        subject: getDefaultSubject(messageType),
      };
    }

    // Format date and time for Swedish locale
    const eventDate = new Date(event.start_time);
    const formattedDate = eventDate.toLocaleDateString('sv-SE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = eventDate.toLocaleTimeString('sv-SE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Prepare variables
    const variables = {
      customer_name: event.contact_person || 'Kund',
      date: formattedDate,
      time: formattedTime,
      service: event.event_type === 'meeting' ? 'Möte' : 
               event.event_type === 'call' ? 'Telefonsamtal' : 
               event.event_type === 'appointment' ? 'Bokning' : event.event_type,
      address: event.address || '',
      contact_person: event.contact_person || '',
      title: event.title || '',
      description: event.description || '',
      ...customVariables,
    };

    // Replace variables in template
    let message = template.body_template;
    let subject = template.subject || '';

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, value);
      subject = subject.replace(regex, value);
    });

    // Use AI to enhance the message if Lovable AI is available
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (LOVABLE_API_KEY && template.tone) {
      try {
        const systemPrompt = `Du är en expert på att skriva professionella meddelanden för bokningar.
Ton: ${template.tone}
Språk: ${template.language}

Förbättra följande ${messageType} meddelande. Behåll all viktig information men gör det mer ${template.tone === 'formal' ? 'professionellt' : template.tone === 'friendly' ? 'vänligt' : template.tone === 'fun' ? 'lekfullt' : 'säljande'}.
Om det är SMS, håll det kort (max 160 tecken). Om det är e-post, gör det mer detaljerat.
Returnera endast det förbättrade meddelandet, inget annat.`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          message = aiData.choices[0].message.content;
        }
      } catch (aiError) {
        console.error('AI enhancement failed, using template message:', aiError);
      }
    }

    return new Response(
      JSON.stringify({
        message,
        subject,
        variables,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating message:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getDefaultTemplate(messageType: string): string {
  switch (messageType) {
    case 'booking_confirmation':
      return 'Hej {{customer_name}}! Din bokning är bekräftad för {{date}} kl {{time}}. Vi ser fram emot att träffa dig!';
    case 'reminder':
      return 'Påminnelse: Du har en bokning {{date}} kl {{time}}. {{service}}. Vi ses snart!';
    case 'review_request':
      return 'Hej {{customer_name}}! Tack för att du besökte oss. Vi skulle uppskatta om du kunde dela din upplevelse med oss.';
    case 'cancellation':
      return 'Din bokning {{date}} kl {{time}} har avbokats. Kontakta oss om du har frågor.';
    default:
      return 'Meddelande om din bokning.';
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
    case 'cancellation':
      return 'Bokning avbokad';
    default:
      return 'Meddelande om bokning';
  }
}
