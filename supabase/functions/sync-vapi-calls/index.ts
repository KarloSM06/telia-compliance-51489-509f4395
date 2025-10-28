import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { accountId } = await req.json();

    if (!accountId) {
      return new Response(JSON.stringify({ error: 'Account ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Vapi Sync] Starting sync for account ${accountId}`);

    // Get account and decrypt credentials
    const { data: account, error: accountError } = await supabaseClient
      .from('telephony_accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user.id)
      .eq('provider', 'vapi')
      .single();

    if (accountError || !account) {
      return new Response(JSON.stringify({ error: 'Account not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decrypt credentials
    const { data: decryptedData, error: decryptError } = await supabaseClient.functions.invoke(
      'decrypt-telephony-credentials',
      { body: { accountId } }
    );

    if (decryptError || !decryptedData?.credentials) {
      throw new Error('Failed to decrypt credentials');
    }

    const { apiKey } = decryptedData.credentials;

    // Create or update sync job
    const { data: syncJob, error: jobError } = await supabaseClient
      .from('telephony_sync_jobs')
      .insert({
        account_id: accountId,
        provider: 'vapi',
        job_type: 'calls',
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) throw jobError;

    let itemsSynced = 0;
    let cursor: string | null = null;
    const MAX_RETRIES = 5;
    let retryCount = 0;

    try {
      while (retryCount < MAX_RETRIES) {
        try {
          // Build Vapi API URL
          let url = 'https://api.vapi.ai/call?limit=50';
          if (cursor) {
            url += `&after=${cursor}`;
          }

          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 429) {
            // Rate limited
            retryCount++;
            const delay = Math.min(300, Math.pow(2, retryCount) * 5);
            console.log(`[Vapi Sync] Rate limited, retry ${retryCount}/${MAX_RETRIES} in ${delay}s`);

            await supabaseClient
              .from('telephony_sync_jobs')
              .update({
                status: 'rate_limited',
                retry_count: retryCount,
                next_retry_at: new Date(Date.now() + delay * 1000).toISOString(),
                error_message: 'Rate limited by Vapi'
              })
              .eq('id', syncJob.id);

            await new Promise(resolve => setTimeout(resolve, delay * 1000));
            continue;
          }

          if (!response.ok) {
            throw new Error(`Vapi API error: ${response.status} ${await response.text()}`);
          }

          const data = await response.json();
          const calls = data.data || [];

          console.log(`[Vapi Sync] Fetched ${calls.length} calls`);

          // Store each call as an event
          for (const call of calls) {
            const idempotencyKey = `vapi:call:${call.id}`;

            // Check if already exists
            const { data: existing } = await supabaseClient
              .from('telephony_events')
              .select('id')
              .eq('idempotency_key', idempotencyKey)
              .maybeSingle();

            if (existing) {
              console.log(`[Vapi Sync] Skipping duplicate call ${call.id}`);
              continue;
            }

            await supabaseClient
              .from('telephony_events')
              .insert({
                account_id: accountId,
                provider_event_id: call.id,
                event_type: 'call.completed',
                resource_type: 'call',
                idempotency_key: idempotencyKey,
                direction: call.type === 'inbound' ? 'inbound' : 'outbound',
                from_number: call.customer?.number || null,
                to_number: call.phoneNumber?.number || null,
                status: call.status,
                started_at: call.createdAt,
                ended_at: call.endedAt,
                duration: call.duration ? Math.round(call.duration) : null,
                cost_amount: call.cost || null,
                cost_currency: 'usd',
                raw_payload: call,
                processing_status: 'completed',
              });

            // If call has recording URL, create media entry
            if (call.recordingUrl) {
              const { data: event } = await supabaseClient
                .from('telephony_events')
                .select('id')
                .eq('idempotency_key', idempotencyKey)
                .single();

              if (event) {
                await supabaseClient
                  .from('telephony_media')
                  .insert({
                    event_id: event.id,
                    media_type: 'recording',
                    provider_url: call.recordingUrl,
                    download_status: 'pending',
                  });
              }
            }

            // If call has transcript, create media entry
            if (call.transcript) {
              const { data: event } = await supabaseClient
                .from('telephony_events')
                .select('id')
                .eq('idempotency_key', idempotencyKey)
                .single();

              if (event) {
                await supabaseClient
                  .from('telephony_media')
                  .insert({
                    event_id: event.id,
                    media_type: 'transcript',
                    download_status: 'completed', // Transcript is already in payload
                  });
              }
            }

            itemsSynced++;
          }

          // Check for pagination
          if (data.hasMore && data.lastId) {
            cursor = data.lastId;
          } else {
            break; // No more pages
          }

        } catch (error) {
          if (retryCount >= MAX_RETRIES - 1) {
            throw error; // Max retries exceeded
          }
          retryCount++;
          const delay = Math.pow(2, retryCount) * 5;
          await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
      }

      // Update sync job as completed
      await supabaseClient
        .from('telephony_sync_jobs')
        .update({
          status: 'completed',
          items_synced: itemsSynced,
          completed_at: new Date().toISOString(),
          last_sync_timestamp: new Date().toISOString(),
        })
        .eq('id', syncJob.id);

      // Update account last sync
      await supabaseClient
        .from('telephony_accounts')
        .update({
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', accountId);

      return new Response(
        JSON.stringify({
          success: true,
          items_synced: itemsSynced,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (error) {
      console.error('[Vapi Sync] Error:', error);

      // Update sync job as failed
      await supabaseClient
        .from('telephony_sync_jobs')
        .update({
          status: 'failed',
          error_message: error.message,
          completed_at: new Date().toISOString(),
        })
        .eq('id', syncJob.id);

      throw error;
    }

  } catch (error) {
    console.error('[Vapi Sync] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
