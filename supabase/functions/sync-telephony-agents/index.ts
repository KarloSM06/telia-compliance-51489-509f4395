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

    console.log('🤖 Starting telephony agents sync...');

    // Get all active telephony integrations
    const { data: integrations, error: intError } = await supabase
      .from('integrations')
      .select('*')
      .eq('is_active', true)
      .in('provider_type', ['telephony', 'multi']);

    if (intError) throw intError;

    console.log(`📞 Found ${integrations?.length || 0} active telephony integrations`);

    const results = [];

    for (const integration of integrations || []) {
      console.log(`🔄 Syncing agents for ${integration.provider}...`);

      try {
        // Decrypt credentials
        const { data: decryptedData, error: decryptError } = await supabase.functions.invoke('decrypt-data', {
          body: { encryptedData: integration.encrypted_credentials }
        });

        if (decryptError) throw decryptError;

        const credentials = decryptedData.decryptedData;
        let syncResult;

        switch (integration.provider) {
          case 'vapi':
            syncResult = await syncVapiAssistants(integration, credentials, supabase);
            break;
          case 'retell':
            syncResult = await syncRetellAgents(integration, credentials, supabase);
            break;
          case 'twilio':
            syncResult = await syncTwilioFlows(integration, credentials, supabase);
            break;
          case 'telnyx':
            syncResult = await syncTelnyxConnections(integration, credentials, supabase);
            break;
          default:
            syncResult = { success: false, message: 'Provider not supported for agent sync' };
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
    console.error('❌ Agent sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function syncVapiAssistants(integration: any, credentials: any, supabase: any) {
  try {
    const response = await fetch('https://api.vapi.ai/assistant', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Vapi API error: ${response.statusText}`);
    }

    const assistants = await response.json();
    console.log(`📋 Found ${assistants.length} Vapi assistants`);

    for (const assistant of assistants) {
      await supabase.from('agents').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: 'vapi',
        provider_agent_id: assistant.id,
        name: assistant.name || 'Unnamed Assistant',
        config: {
          voice_id: assistant.voice?.voiceId,
          tts_provider: assistant.voice?.provider,
          llm_provider: assistant.model?.provider,
          model: assistant.model?.model,
          prompt: assistant.model?.messages?.[0]?.content,
          first_message: assistant.firstMessage,
          temperature: assistant.model?.temperature
        },
        status: 'active',
        metadata: {
          transcriber: assistant.transcriber,
          functions: assistant.model?.functions || [],
          maxDurationSeconds: assistant.maxDurationSeconds
        }
      }, {
        onConflict: 'integration_id,provider_agent_id'
      });
    }

    return { success: true, count: assistants.length };
  } catch (error) {
    console.error('Vapi sync error:', error);
    return { success: false, error: error.message };
  }
}

async function syncRetellAgents(integration: any, credentials: any, supabase: any) {
  try {
    const response = await fetch('https://api.retellai.com/list-agents', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Retell API error: ${response.statusText}`);
    }

    const data = await response.json();
    const agents = data.agents || [];
    console.log(`📋 Found ${agents.length} Retell agents`);

    for (const agent of agents) {
      await supabase.from('agents').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: 'retell',
        provider_agent_id: agent.agent_id,
        name: agent.agent_name || 'Unnamed Agent',
        config: {
          voice_id: agent.voice_id,
          response_engine: agent.llm_websocket_url ? 'custom' : 'retell',
          llm_websocket_url: agent.llm_websocket_url,
          language: agent.language,
          voice_temperature: agent.voice_temperature,
          voice_speed: agent.voice_speed,
          responsiveness: agent.responsiveness,
          interruption_sensitivity: agent.interruption_sensitivity
        },
        status: 'active',
        metadata: {
          ambient_sound: agent.ambient_sound,
          enable_backchannel: agent.enable_backchannel,
          dynamic_variables: agent.dynamic_variables || []
        }
      }, {
        onConflict: 'integration_id,provider_agent_id'
      });
    }

    return { success: true, count: agents.length };
  } catch (error) {
    console.error('Retell sync error:', error);
    return { success: false, error: error.message };
  }
}

async function syncTwilioFlows(integration: any, credentials: any, supabase: any) {
  try {
    const accountSid = credentials.accountSid;
    const authToken = credentials.authToken;
    const auth = btoa(`${accountSid}:${authToken}`);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Applications.json`,
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
    const applications = data.applications || [];
    console.log(`📋 Found ${applications.length} Twilio applications`);

    for (const app of applications) {
      await supabase.from('agents').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: 'twilio',
        provider_agent_id: app.sid,
        name: app.friendly_name || 'Unnamed Application',
        config: {
          voice_url: app.voice_url,
          voice_method: app.voice_method,
          status_callback: app.status_callback,
          status_callback_method: app.status_callback_method
        },
        status: 'active',
        metadata: {
          sms_url: app.sms_url,
          sms_method: app.sms_method
        }
      }, {
        onConflict: 'integration_id,provider_agent_id'
      });
    }

    return { success: true, count: applications.length };
  } catch (error) {
    console.error('Twilio sync error:', error);
    return { success: false, error: error.message };
  }
}

async function syncTelnyxConnections(integration: any, credentials: any, supabase: any) {
  try {
    const response = await fetch('https://api.telnyx.com/v2/connections', {
      headers: {
        'Authorization': `Bearer ${credentials.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Telnyx API error: ${response.statusText}`);
    }

    const data = await response.json();
    const connections = data.data || [];
    console.log(`📋 Found ${connections.length} Telnyx connections`);

    for (const conn of connections) {
      await supabase.from('agents').upsert({
        integration_id: integration.id,
        user_id: integration.user_id,
        provider: 'telnyx',
        provider_agent_id: conn.id,
        name: conn.name || 'Unnamed Connection',
        config: {
          connection_type: conn.connection_type,
          webhook_event_url: conn.webhook_event_url,
          webhook_event_failover_url: conn.webhook_event_failover_url,
          webhook_api_version: conn.webhook_api_version
        },
        status: conn.active ? 'active' : 'inactive',
        metadata: {
          inbound_voice_profile_id: conn.inbound_voice_profile_id,
          outbound_voice_profile_id: conn.outbound_voice_profile_id
        }
      }, {
        onConflict: 'integration_id,provider_agent_id'
      });
    }

    return { success: true, count: connections.length };
  } catch (error) {
    console.error('Telnyx sync error:', error);
    return { success: false, error: error.message };
  }
}
