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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🔄 Starting telephony account sync...');

    // Fetch all active telephony integrations
    const { data: integrations, error: integrationsError } = await supabase
      .from('integrations')
      .select('*')
      .eq('is_active', true)
      .or('provider_type.eq.telephony,provider_type.eq.multi');

    if (integrationsError) {
      console.error('❌ Error fetching integrations:', integrationsError);
      throw integrationsError;
    }

    console.log(`📋 Found ${integrations?.length || 0} active telephony integrations`);

    const results = [];

    for (const integration of integrations || []) {
      console.log(`\n🔄 Syncing ${integration.provider} (${integration.id})...`);

      try {
        // Create sync job record
        const { data: syncJob } = await supabase
          .from('telephony_sync_jobs')
          .insert({
            account_id: integration.id,
            provider: integration.provider,
            job_type: 'calls',
            status: 'running',
            started_at: new Date().toISOString(),
          })
          .select()
          .single();

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
          console.error('❌ Error decrypting credentials:', decryptError);
          if (syncJob) {
            await supabase
              .from('telephony_sync_jobs')
              .update({
                status: 'failed',
                error_message: 'Failed to decrypt credentials',
                completed_at: new Date().toISOString(),
              })
              .eq('id', syncJob.id);
          }
          continue;
        }

        const credentials = decryptData;
        let syncResult;

        // Call provider-specific sync function
        switch (integration.provider) {
          case 'twilio':
            syncResult = await syncTwilio(integration, credentials, supabase);
            break;
          case 'telnyx':
            syncResult = await syncTelnyx(integration, credentials, supabase);
            break;
          case 'vapi':
            syncResult = await syncVapi(integration, credentials, supabase);
            break;
          case 'retell':
            syncResult = await syncRetell(integration, credentials, supabase);
            break;
          default:
            console.warn(`⚠️ Unknown provider: ${integration.provider}`);
            syncResult = { success: false, count: 0, error: 'Unknown provider' };
        }

        // Update integration last_synced_at
        await supabase
          .from('integrations')
          .update({
            last_synced_at: new Date().toISOString(),
            sync_status: syncResult.success ? 'success' : 'error',
            error_message: syncResult.error || null,
          })
          .eq('id', integration.id);

        // Update sync job
        if (syncJob) {
          await supabase
            .from('telephony_sync_jobs')
            .update({
              status: syncResult.success ? 'completed' : 'failed',
              items_synced: syncResult.count || 0,
              error_message: syncResult.error || null,
              completed_at: new Date().toISOString(),
            })
            .eq('id', syncJob.id);
        }

        results.push({
          provider: integration.provider,
          success: syncResult.success,
          count: syncResult.count,
          error: syncResult.error,
        });

        console.log(
          `✅ ${integration.provider} sync completed: ${syncResult.count} events`
        );
      } catch (error) {
        console.error(`❌ Error syncing ${integration.provider}:`, error);
        results.push({
          provider: integration.provider,
          success: false,
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sync completed',
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Provider-specific sync functions
async function syncTwilio(integration: any, credentials: any, supabase: any) {
  try {
    const accountSid = credentials.accountSid;
    const authToken = credentials.authToken;

    if (!accountSid || !authToken) {
      return { success: false, count: 0, error: 'Missing credentials' };
    }

    const auth = btoa(`${accountSid}:${authToken}`);
    
    // Fetch calls
    const callsResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json?PageSize=100`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    if (!callsResponse.ok) {
      return { success: false, count: 0, error: 'Twilio API error' };
    }

    const callsData = await callsResponse.json();
    const calls = callsData.calls || [];

    // Fetch messages
    const messagesResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json?PageSize=100`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const messagesData = messagesResponse.ok ? await messagesResponse.json() : { messages: [] };
    const messages = messagesData.messages || [];

    // Find agent for this integration
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('integration_id', integration.id)
      .eq('provider', 'twilio')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Process calls
    for (const call of calls) {
      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        agent_id: agent?.id,
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
        event_timestamp: new Date(call.date_created).toISOString(),
        normalized: {
          direction: call.direction,
          answered_by: call.answered_by,
        },
      }, {
        onConflict: 'provider_event_id',
      });
    }

    // Process messages
    for (const message of messages) {
      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: 'twilio',
        event_type: 'message',
        direction: message.direction,
        from_number: message.from,
        to_number: message.to,
        status: message.status,
        cost_amount: message.price ? Math.abs(parseFloat(message.price)) : null,
        cost_currency: message.price_unit || 'USD',
        provider_event_id: message.sid,
        event_timestamp: new Date(message.date_sent || message.date_created).toISOString(),
        normalized: {
          num_segments: message.num_segments,
          body: message.body,
        },
      }, {
        onConflict: 'provider_event_id',
      });
    }

    return { success: true, count: calls.length + messages.length };
  } catch (error) {
    console.error('Twilio sync error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

async function syncTelnyx(integration: any, credentials: any, supabase: any) {
  try {
    const apiKey = credentials.apiKey;

    if (!apiKey) {
      return { success: false, count: 0, error: 'Missing API key' };
    }

    // Fetch calls
    const callsResponse = await fetch('https://api.telnyx.com/v2/calls?page[size]=100', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!callsResponse.ok) {
      return { success: false, count: 0, error: 'Telnyx API error' };
    }

    const callsData = await callsResponse.json();
    const calls = callsData.data || [];

    // Fetch messages
    const messagesResponse = await fetch('https://api.telnyx.com/v2/messages?page[size]=100', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const messagesData = messagesResponse.ok ? await messagesResponse.json() : { data: [] };
    const messages = messagesData.data || [];

    // Find agent
    const { data: agent } = await supabase
      .from('agents')
      .select('id')
      .eq('integration_id', integration.id)
      .eq('provider', 'telnyx')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Process calls
    for (const call of calls) {
      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        agent_id: agent?.id,
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
        event_timestamp: new Date(call.created_at).toISOString(),
        normalized: call,
      }, {
        onConflict: 'provider_event_id',
      });
    }

    // Process messages
    for (const message of messages) {
      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: 'telnyx',
        event_type: 'message',
        direction: message.direction,
        from_number: message.from?.phone_number,
        to_number: message.to?.[0]?.phone_number,
        status: message.status,
        cost_amount: message.cost?.amount ? parseFloat(message.cost.amount) : null,
        cost_currency: message.cost?.currency || 'USD',
        provider_event_id: message.id,
        event_timestamp: new Date(message.created_at).toISOString(),
        normalized: {
          text: message.text,
          media: message.media,
        },
      }, {
        onConflict: 'provider_event_id',
      });
    }

    return { success: true, count: calls.length + messages.length };
  } catch (error) {
    console.error('Telnyx sync error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

async function syncVapi(integration: any, credentials: any, supabase: any) {
  try {
    const apiKey = credentials.apiKey;

    if (!apiKey) {
      return { success: false, count: 0, error: 'Missing API key' };
    }

    const response = await fetch('https://api.vapi.ai/call?limit=100', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { success: false, count: 0, error: 'VAPI API error' };
    }

    const calls = await response.json();

    for (const call of calls) {
      // Find agent by assistant_id
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('integration_id', integration.id)
        .eq('provider', 'vapi')
        .eq('provider_agent_id', call.assistantId)
        .single();

      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        agent_id: agent?.id,
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
        event_timestamp: new Date(call.createdAt).toISOString(),
        normalized: {
          transcript: call.transcript,
          recording_url: call.recordingUrl,
          assistant_id: call.assistantId,
        },
      }, {
        onConflict: 'provider_event_id',
      });
    }

    return { success: true, count: calls.length };
  } catch (error) {
    console.error('VAPI sync error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

async function syncRetell(integration: any, credentials: any, supabase: any) {
  try {
    const apiKey = credentials.apiKey;

    if (!apiKey) {
      return { success: false, count: 0, error: 'Missing API key' };
    }

    const response = await fetch('https://api.retellai.com/list-calls?limit=100', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { success: false, count: 0, error: 'Retell API error' };
    }

    const data = await response.json();
    const calls = data.calls || [];

    for (const call of calls) {
      const duration = call.end_timestamp && call.start_timestamp
        ? Math.floor((call.end_timestamp - call.start_timestamp) / 1000)
        : 0;

      // Find agent by agent_id
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('integration_id', integration.id)
        .eq('provider', 'retell')
        .eq('provider_agent_id', call.agent_id)
        .single();

      await supabase.from('telephony_events').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        agent_id: agent?.id,
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
        event_timestamp: new Date(call.start_timestamp).toISOString(),
        normalized: {
          transcript: call.transcript,
          recording_url: call.recording_url,
          agent_id: call.agent_id,
        },
      }, {
        onConflict: 'provider_event_id',
      });
    }

    return { success: true, count: calls.length };
  } catch (error) {
    console.error('Retell sync error:', error);
    return { success: false, count: 0, error: error.message };
  }
}
