import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔄 Starting telephony account sync...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Fetch all active accounts
    const { data: accounts } = await supabase
      .from('telephony_accounts')
      .select('*')
      .eq('is_active', true);

    if (!accounts || accounts.length === 0) {
      console.log('⚠️ No active accounts to sync');
      return new Response(JSON.stringify({ message: 'No active accounts' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const account of accounts) {
      try {
        console.log(`🔄 Syncing ${account.provider} for user ${account.user_id}`);

        // Decrypt credentials
        const { data: decrypted } = await supabase.functions.invoke('decrypt-data', {
          body: { encrypted: account.encrypted_credentials },
        });

        if (!decrypted || decrypted.error) {
          console.error(`❌ Failed to decrypt credentials for ${account.provider}`);
          continue;
        }

        switch (account.provider) {
          case 'twilio':
            await syncTwilio(account, decrypted, supabase);
            break;
          case 'telnyx':
            await syncTelnyx(account, decrypted, supabase);
            break;
          case 'vapi':
            await syncVapi(account, decrypted, supabase);
            break;
          case 'retell':
            await syncRetell(account, decrypted, supabase);
            break;
        }

        // Update last_synced_at
        await supabase
          .from('telephony_accounts')
          .update({ 
            last_synced_at: new Date().toISOString(),
            sync_status: 'synced' 
          })
          .eq('id', account.id);

        results.push({ provider: account.provider, status: 'synced' });
        console.log(`✅ Synced ${account.provider} successfully`);

      } catch (error) {
        console.error(`❌ Sync failed for ${account.provider}:`, error);
        await supabase
          .from('telephony_accounts')
          .update({ sync_status: 'error' })
          .eq('id', account.id);
        
        results.push({ provider: account.provider, status: 'error', error: error.message });
      }
    }

    console.log('✅ Sync completed');
    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function syncTwilio(account: any, credentials: any, supabase: any) {
  const { accountSid, authToken } = credentials;
  
  console.log('🔄 Fetching Twilio calls...');
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json?PageSize=50`,
    {
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Twilio API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`📊 Found ${data.calls?.length || 0} Twilio calls`);
  
  for (const call of data.calls || []) {
    await supabase
      .from('telephony_events')
      .upsert({
        account_id: account.id,
        provider: 'twilio',
        event_type: 'call.completed',
        direction: call.direction,
        from_number: call.from,
        to_number: call.to,
        status: call.status,
        duration_seconds: parseInt(call.duration) || 0,
        provider_event_id: call.sid,
        provider_payload: call,
        normalized: {
          call_id: call.sid,
          from: call.from,
          to: call.to,
          duration: call.duration,
          status: call.status,
        },
        event_timestamp: call.date_created,
      }, {
        onConflict: 'provider_event_id',
        ignoreDuplicates: true,
      });
  }
}

async function syncTelnyx(account: any, credentials: any, supabase: any) {
  const { apiKey } = credentials;
  
  console.log('🔄 Fetching Telnyx calls...');
  const response = await fetch(
    'https://api.telnyx.com/v2/calls?page[size]=50',
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Telnyx API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`📊 Found ${data.data?.length || 0} Telnyx calls`);
  
  for (const call of data.data || []) {
    await supabase
      .from('telephony_events')
      .upsert({
        account_id: account.id,
        provider: 'telnyx',
        event_type: 'call.completed',
        direction: call.direction,
        from_number: call.from,
        to_number: call.to,
        status: call.status,
        duration_seconds: call.duration,
        provider_event_id: call.call_control_id,
        provider_payload: call,
        normalized: {
          call_id: call.call_control_id,
          from: call.from,
          to: call.to,
          duration: call.duration,
          status: call.status,
        },
        event_timestamp: call.created_at,
      }, {
        onConflict: 'provider_event_id',
        ignoreDuplicates: true,
      });
  }
}

async function syncVapi(account: any, credentials: any, supabase: any) {
  const { apiKey } = credentials;
  
  console.log('🔄 Fetching Vapi calls...');
  const response = await fetch(
    'https://api.vapi.ai/call?limit=50',
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Vapi API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`📊 Found ${data.length || 0} Vapi calls`);
  
  for (const call of data || []) {
    await supabase
      .from('telephony_events')
      .upsert({
        account_id: account.id,
        provider: 'vapi',
        event_type: 'call.completed',
        direction: call.type || 'outbound',
        from_number: call.customer?.number,
        to_number: call.phoneNumber?.number,
        status: call.status,
        duration_seconds: call.duration,
        cost_amount: call.cost,
        provider_event_id: call.id,
        provider_payload: call,
        normalized: {
          call_id: call.id,
          from: call.customer?.number,
          to: call.phoneNumber?.number,
          duration: call.duration,
          status: call.status,
          cost: call.cost,
        },
        event_timestamp: call.createdAt,
      }, {
        onConflict: 'provider_event_id',
        ignoreDuplicates: true,
      });
  }
}

async function syncRetell(account: any, credentials: any, supabase: any) {
  const { apiKey } = credentials;
  
  console.log('🔄 Fetching Retell calls...');
  const response = await fetch(
    'https://api.retellai.com/list-calls?limit=50',
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Retell API error: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`📊 Found ${data.calls?.length || 0} Retell calls`);
  
  for (const call of data.calls || []) {
    const duration = call.end_timestamp && call.start_timestamp
      ? Math.floor((call.end_timestamp - call.start_timestamp) / 1000)
      : 0;

    await supabase
      .from('telephony_events')
      .upsert({
        account_id: account.id,
        provider: 'retell',
        event_type: 'call.completed',
        direction: call.call_type || 'outbound',
        from_number: call.from_number,
        to_number: call.to_number,
        status: call.call_status,
        duration_seconds: duration,
        provider_event_id: call.call_id,
        provider_payload: call,
        normalized: {
          call_id: call.call_id,
          from: call.from_number,
          to: call.to_number,
          duration,
          status: call.call_status,
        },
        event_timestamp: call.start_timestamp 
          ? new Date(call.start_timestamp).toISOString()
          : new Date().toISOString(),
      }, {
        onConflict: 'provider_event_id',
        ignoreDuplicates: true,
      });
  }
}
