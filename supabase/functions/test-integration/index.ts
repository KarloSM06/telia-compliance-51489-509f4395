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
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await anonClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Use service role for database queries after authentication
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { integration_id, test_type } = await req.json();

    console.log('🧪 Testing integration:', integration_id, 'Type:', test_type);

    // Fetch integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('user_id', user.id)
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found');
    }

    let result = {
      success: false,
      message: '',
      details: {},
    };

    // Test based on type
    switch (test_type) {
      case 'webhook':
        result = await testWebhook(integration);
        break;
      case 'api':
        result = await testApiConnection(integration);
        break;
      case 'sync':
        result = await testSync(integration);
        break;
      default:
        throw new Error('Invalid test type');
    }

    console.log('✅ Test result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('❌ Test error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message,
        details: {} 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function testWebhook(integration: any) {
  // Get webhook URL from integration or user profile
  const webhookUrl = integration.webhook_url;
  
  if (!webhookUrl) {
    return {
      success: false,
      message: 'Ingen webhook URL konfigurerad',
      details: {},
    };
  }

  // Create mock data based on provider
  const mockData = getMockDataForProvider(integration.provider);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockData),
    });

    const success = response.ok;

    return {
      success,
      message: success 
        ? `Webhook svarade med status ${response.status}` 
        : `Webhook misslyckades med status ${response.status}`,
      details: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Kunde inte nå webhook: ${error.message}`,
      details: { error: error.message },
    };
  }
}

async function testApiConnection(integration: any) {
  const provider = integration.provider;

  try {
    // Decrypt credentials
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: decrypted } = await supabase.functions.invoke('decrypt-data', {
      body: {
        encrypted_data: integration.encrypted_credentials,
      },
    });

    if (!decrypted?.decrypted) {
      throw new Error('Could not decrypt credentials');
    }

    const credentials = JSON.parse(decrypted.decrypted);

    // Test API based on provider
    switch (provider) {
      case 'vapi':
        return await testVapiApi(credentials);
      case 'retell':
        return await testRetellApi(credentials);
      case 'twilio':
        return await testTwilioApi(credentials);
      case 'telnyx':
        return await testTelnyxApi(credentials);
      case 'google_calendar':
        return await testGoogleCalendarApi(credentials);
      default:
        return {
          success: false,
          message: `API-test inte implementerat för ${provider}`,
          details: {},
        };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `API-test misslyckades: ${error.message}`,
      details: { error: error.message },
    };
  }
}

async function testSync(integration: any) {
  return {
    success: true,
    message: 'Sync-test körs via trigger-manual-sync endpoint',
    details: { note: 'Använd trigger-manual-sync för att starta en riktig sync' },
  };
}

// Provider-specific API tests
async function testVapiApi(credentials: any) {
  const response = await fetch('https://api.vapi.ai/call', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    success: response.ok,
    message: response.ok 
      ? 'VAPI API-anslutning fungerar' 
      : `VAPI API misslyckades: ${response.statusText}`,
    details: { status: response.status },
  };
}

async function testRetellApi(credentials: any) {
  const response = await fetch('https://api.retellai.com/v2/list-calls', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    success: response.ok,
    message: response.ok 
      ? 'Retell API-anslutning fungerar' 
      : `Retell API misslyckades: ${response.statusText}`,
    details: { status: response.status },
  };
}

async function testTwilioApi(credentials: any) {
  const accountSid = credentials.account_sid;
  const authToken = credentials.auth_token;
  const auth = btoa(`${accountSid}:${authToken}`);

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
    },
  });

  return {
    success: response.ok,
    message: response.ok 
      ? 'Twilio API-anslutning fungerar' 
      : `Twilio API misslyckades: ${response.statusText}`,
    details: { status: response.status },
  };
}

async function testTelnyxApi(credentials: any) {
  const response = await fetch('https://api.telnyx.com/v2/phone_numbers', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${credentials.api_key}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    success: response.ok,
    message: response.ok 
      ? 'Telnyx API-anslutning fungerar' 
      : `Telnyx API misslyckades: ${response.statusText}`,
    details: { status: response.status },
  };
}

async function testGoogleCalendarApi(credentials: any) {
  const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    success: response.ok,
    message: response.ok 
      ? 'Google Calendar API-anslutning fungerar' 
      : `Google Calendar API misslyckades: ${response.statusText}`,
    details: { status: response.status },
  };
}

function getMockDataForProvider(provider: string) {
  switch (provider) {
    case 'vapi':
      return {
        type: 'call.ended',
        call: {
          id: 'test-call-123',
          status: 'ended',
          endedReason: 'customer-ended-call',
        },
      };
    case 'retell':
      return {
        event: 'call_ended',
        call: {
          call_id: 'test-call-123',
          call_status: 'ended',
        },
      };
    case 'twilio':
      return {
        CallSid: 'CAtest123',
        CallStatus: 'completed',
        From: '+46701234567',
        To: '+46709876543',
      };
    case 'telnyx':
      return {
        data: {
          event_type: 'call.hangup',
          payload: {
            call_control_id: 'test-123',
            call_session_id: 'test-session-123',
          },
        },
      };
    default:
      return { test: true };
  }
}
