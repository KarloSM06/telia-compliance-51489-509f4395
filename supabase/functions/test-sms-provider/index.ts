import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TestProviderRequest {
  provider: 'twilio' | 'telnyx';
  credentials: {
    accountSid?: string;
    authToken?: string;
    apiKey?: string;
  };
  fromPhoneNumber: string;
  testPhoneNumber: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { provider, credentials, fromPhoneNumber, testPhoneNumber }: TestProviderRequest = await req.json();

    console.log(`Testing ${provider} provider for user ${user.id}`);

    let success = false;
    let errorMessage = '';

    if (provider === 'twilio') {
      // Test Twilio
      const { accountSid, authToken } = credentials;
      if (!accountSid || !authToken) {
        throw new Error('Missing Twilio credentials');
      }

      const auth = btoa(`${accountSid}:${authToken}`);
      const twilioResponse = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: testPhoneNumber,
            From: fromPhoneNumber,
            Body: 'Test från Hiems - din SMS-provider är korrekt konfigurerad! 🎉',
          }),
        }
      );

      if (twilioResponse.ok) {
        success = true;
        console.log('Twilio test message sent successfully');
      } else {
        const error = await twilioResponse.json();
        errorMessage = error.message || 'Failed to send test message';
        console.error('Twilio error:', error);
      }
    } else if (provider === 'telnyx') {
      // Test Telnyx
      const { apiKey } = credentials;
      if (!apiKey) {
        throw new Error('Missing Telnyx API key');
      }

      const telnyxResponse = await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromPhoneNumber,
          to: testPhoneNumber,
          text: 'Test från Hiems - din SMS-provider är korrekt konfigurerad! 🎉',
        }),
      });

      if (telnyxResponse.ok) {
        success = true;
        console.log('Telnyx test message sent successfully');
      } else {
        const error = await telnyxResponse.json();
        errorMessage = error.errors?.[0]?.detail || 'Failed to send test message';
        console.error('Telnyx error:', error);
      }
    }

    return new Response(
      JSON.stringify({ success, error: errorMessage || undefined }),
      { status: success ? 200 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in test-sms-provider:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
