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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Not authenticated');
    }

    const { templateId, channel } = await req.json();

    if (!templateId || !channel) {
      throw new Error('Missing templateId or channel');
    }

    // Fetch template
    const { data: template, error: templateError } = await supabaseClient
      .from('message_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    // Fetch user profile for email/phone
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    // Generate test message
    const testData = {
      customer_name: 'Test Kund',
      date: new Date().toLocaleDateString('sv-SE', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: '10:00',
      service: 'Testbokat tjänst',
      address: 'Testgatan 123, Stockholm',
      contact_person: 'Din kontaktperson',
    };

    // Replace variables in template
    let message = template.body_template;
    let subject = template.subject || 'Testmeddelande';

    Object.entries(testData).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      message = message.replace(regex, value);
      if (subject) {
        subject = subject.replace(regex, value);
      }
    });

    // Send test message
    if (channel === 'email') {
      // Send email via Resend (assuming you have resend integration)
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      
      if (!RESEND_API_KEY) {
        throw new Error('Resend API key not configured');
      }

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Test <onboarding@resend.dev>',
          to: [profile.email],
          subject: `[TEST] ${subject}`,
          text: message,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Resend error:', errorText);
        throw new Error('Failed to send test email');
      }

    } else if (channel === 'sms') {
      // For SMS, we'd need user's phone number - for now just return success
      // In production, you'd send via Twilio/Telnyx
      console.log('Test SMS would be sent:', message);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Test message sent',
        preview: { subject, message }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in send-test-message function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
