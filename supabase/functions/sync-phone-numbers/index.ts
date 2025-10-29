import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('📞 Starting phone numbers sync...');

    const { data: integrations, error: intError } = await supabase
      .from('integrations')
      .select('*')
      .eq('is_active', true)
      .in('provider', ['twilio', 'telnyx']);

    if (intError) throw intError;

    console.log(`Found ${integrations?.length || 0} active integrations`);

    const results = [];

    for (const integration of integrations || []) {
      console.log(`🔄 Syncing numbers for ${integration.provider}...`);

      try {
        const { data: decryptedData, error: decryptError } = await supabase.functions.invoke('decrypt-data', {
          body: { encryptedData: integration.encrypted_credentials }
        });

        if (decryptError) throw decryptError;

        const credentials = decryptedData.decryptedData;
        let syncResult;

        switch (integration.provider) {
          case 'twilio':
            syncResult = await syncTwilioNumbers(integration, credentials, supabase);
            break;
          case 'telnyx':
            syncResult = await syncTelnyxNumbers(integration, credentials, supabase);
            break;
          default:
            syncResult = { success: false, message: 'Provider not supported' };
        }

        results.push({
          integration: integration.provider,
          ...syncResult
        });

      } catch (error) {
        console.error(`❌ Error syncing ${integration.provider}:`, error);
        results.push({
          integration: integration.provider,
          success: false,
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Phone numbers sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function syncTwilioNumbers(integration: any, credentials: any, supabase: any) {
  try {
    const accountSid = credentials.accountSid;
    const authToken = credentials.authToken;
    const auth = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`,
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Twilio API error: ${response.statusText}`);
    }

    const data = await response.json();
    const numbers = data.incoming_phone_numbers || [];
    console.log(`📋 Found ${numbers.length} Twilio phone numbers`);

    for (const number of numbers) {
      await supabase.from('phone_numbers').upsert({
        user_id: integration.user_id,
        integration_id: integration.id,
        number: number.phone_number,
        provider: 'twilio',
        capabilities: {
          voice: number.capabilities?.voice,
          sms: number.capabilities?.sms,
          mms: number.capabilities?.mms
        },
        status: 'active',
        metadata: {
          friendly_name: number.friendly_name,
          sid: number.sid,
          address_requirements: number.address_requirements,
          emergency_status: number.emergency_status
        }
      }, {
        onConflict: 'user_id,number'
      });
    }

    return { success: true, count: numbers.length };
  } catch (error) {
    console.error('Twilio numbers sync error:', error);
    return { success: false, error: error.message };
  }
}

async function syncTelnyxNumbers(integration: any, credentials: any, supabase: any) {
  try {
    const response = await fetch('https://api.telnyx.com/v2/phone_numbers', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Telnyx API error: ${response.statusText}`);
    }

    const data = await response.json();
    const numbers = data.data || [];
    console.log(`📋 Found ${numbers.length} Telnyx phone numbers`);

    for (const number of numbers) {
      await supabase.from('phone_numbers').upsert({
        user_id: integration.user_id,
        integration_id: integration.id,
        number: number.phone_number,
        provider: 'telnyx',
        capabilities: {
          voice: true,
          sms: number.features?.includes('sms'),
          mms: number.features?.includes('mms')
        },
        status: number.status === 'active' ? 'active' : 'inactive',
        metadata: {
          id: number.id,
          connection_id: number.connection_id,
          messaging_profile_id: number.messaging_profile_id,
          features: number.features
        }
      }, {
        onConflict: 'user_id,number'
      });
    }

    return { success: true, count: numbers.length };
  } catch (error) {
    console.error('Telnyx numbers sync error:', error);
    return { success: false, error: error.message };
  }
}
