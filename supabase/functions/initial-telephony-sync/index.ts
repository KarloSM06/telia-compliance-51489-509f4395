import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { integrationId, daysBack = 30 } = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`🔄 Starting initial sync for integration ${integrationId}, ${daysBack} days back...`);

    // Get the integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integrationId)
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found');
    }

    // Decrypt credentials
    const { data: decryptData, error: decryptError } = await supabase.functions.invoke(
      'decrypt-data',
      {
        body: {
          encrypted_data: integration.encrypted_credentials,
        },
      }
    );

    if (decryptError || !decryptData) {
      throw new Error('Failed to decrypt credentials');
    }

    const credentials = decryptData;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let totalSynced = 0;

    // Sync based on provider
    switch (integration.provider) {
      case 'twilio':
        totalSynced = await syncTwilioHistorical(integration, credentials, supabase, startDate);
        break;
      case 'telnyx':
        totalSynced = await syncTelnyxHistorical(integration, credentials, supabase, startDate);
        break;
      case 'vapi':
        totalSynced = await syncVapiHistorical(integration, credentials, supabase, startDate);
        break;
      case 'retell':
        totalSynced = await syncRetellHistorical(integration, credentials, supabase, startDate);
        break;
      default:
        throw new Error(`Unsupported provider: ${integration.provider}`);
    }

    // Update integration
    await supabase
      .from('integrations')
      .update({
        last_synced_at: new Date().toISOString(),
        sync_status: 'success',
      })
      .eq('id', integrationId);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${totalSynced} historical events`,
        count: totalSynced,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Initial sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function syncTwilioHistorical(integration: any, credentials: any, supabase: any, startDate: Date) {
  const accountSid = credentials.accountSid;
  const authToken = credentials.authToken;
  const auth = btoa(`${accountSid}:${authToken}`);
  
  let totalCount = 0;
  const startDateStr = startDate.toISOString().split('T')[0];

  // Sync calls with pagination
  let nextPageUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json?PageSize=100&StartTime>=${startDateStr}`;
  
  while (nextPageUrl) {
    const response = await fetch(nextPageUrl, {
      headers: { Authorization: `Basic ${auth}` },
    });
    
    const data = await response.json();
    const calls = data.calls || [];
    
    for (const call of calls) {
      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        provider: 'twilio',
        event_type: 'call',
        direction: call.direction,
        from_number: call.from,
        to_number: call.to,
        status: call.status,
        duration_seconds: parseInt(call.duration) || 0,
        cost_amount: call.price ? Math.abs(parseFloat(call.price)) : null,
        cost_currency: call.price_unit || 'USD',
        provider_event_id: call.sid,
        timestamp: new Date(call.date_created).toISOString(),
        metadata: { direction: call.direction, answered_by: call.answered_by },
      }, { onConflict: 'provider_event_id' });
    }
    
    totalCount += calls.length;
    nextPageUrl = data.next_page_uri ? `https://api.twilio.com${data.next_page_uri}` : null;
  }

  return totalCount;
}

async function syncTelnyxHistorical(integration: any, credentials: any, supabase: any, startDate: Date) {
  const apiKey = credentials.apiKey;
  let totalCount = 0;
  let nextPageToken = null;

  do {
    const url = `https://api.telnyx.com/v2/calls?page[size]=100&filter[created_at][gte]=${startDate.toISOString()}${nextPageToken ? `&page[token]=${nextPageToken}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    const calls = data.data || [];

    for (const call of calls) {
      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        provider: 'telnyx',
        event_type: 'call',
        direction: call.direction,
        from_number: call.from,
        to_number: call.to,
        status: call.status,
        duration_seconds: call.duration_secs || 0,
        cost_amount: call.cost ? parseFloat(call.cost) : null,
        cost_currency: 'USD',
        provider_event_id: call.call_control_id || call.id,
        timestamp: new Date(call.created_at).toISOString(),
        metadata: call,
      }, { onConflict: 'provider_event_id' });
    }

    totalCount += calls.length;
    nextPageToken = data.meta?.next_page_token;
  } while (nextPageToken);

  return totalCount;
}

async function syncVapiHistorical(integration: any, credentials: any, supabase: any, startDate: Date) {
  const apiKey = credentials.apiKey;
  let totalCount = 0;

  const response = await fetch(`https://api.vapi.ai/call?limit=1000&createdAtGte=${startDate.toISOString()}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const calls = await response.json();

  for (const call of calls) {
    await supabase.from('telephony_events').upsert({
      integration_id: integration.id,
      provider: 'vapi',
      event_type: 'call',
      direction: call.type === 'inboundPhoneCall' ? 'inbound' : 'outbound',
      from_number: call.customer?.number,
      to_number: call.phoneNumber?.number,
      status: call.status,
      duration_seconds: call.endedAt && call.startedAt 
        ? Math.floor((new Date(call.endedAt) - new Date(call.startedAt)) / 1000) 
        : 0,
      cost_amount: call.cost ? parseFloat(call.cost) : null,
      cost_currency: 'USD',
      provider_event_id: call.id,
      timestamp: new Date(call.createdAt).toISOString(),
      metadata: {
        transcript: call.transcript,
        recording_url: call.recordingUrl,
        assistant_id: call.assistantId,
      },
    }, { onConflict: 'provider_event_id' });

    totalCount++;
  }

  return totalCount;
}

async function syncRetellHistorical(integration: any, credentials: any, supabase: any, startDate: Date) {
  const apiKey = credentials.apiKey;
  let totalCount = 0;

  const response = await fetch('https://api.retellai.com/list-calls?limit=1000', {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const data = await response.json();
  const calls = data.calls || [];

  for (const call of calls) {
    const callDate = new Date(call.start_timestamp);
    if (callDate < startDate) continue;

    const duration = call.end_timestamp && call.start_timestamp
      ? Math.floor((call.end_timestamp - call.start_timestamp) / 1000)
      : 0;

    await supabase.from('telephony_events').upsert({
      integration_id: integration.id,
      provider: 'retell',
      event_type: 'call',
      direction: call.call_type === 'inbound' ? 'inbound' : 'outbound',
      from_number: call.from_number,
      to_number: call.to_number,
      status: call.call_status,
      duration_seconds: duration,
      cost_amount: call.cost ? parseFloat(call.cost) : null,
      cost_currency: 'USD',
      provider_event_id: call.call_id,
      timestamp: new Date(call.start_timestamp).toISOString(),
      metadata: {
        transcript: call.transcript,
        recording_url: call.recording_url,
        agent_id: call.agent_id,
      },
    }, { onConflict: 'provider_event_id' });

    totalCount++;
  }

  return totalCount;
}
