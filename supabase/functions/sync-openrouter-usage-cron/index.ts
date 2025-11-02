import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
    console.log('Starting scheduled OpenRouter usage sync...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !encryptionKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all users with OpenRouter configured
    const { data: aiSettings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('user_id, openrouter_api_key')
      .not('openrouter_api_key', 'is', null);

    if (settingsError) {
      console.error('Error fetching AI settings:', settingsError);
      throw settingsError;
    }

    if (!aiSettings || aiSettings.length === 0) {
      console.log('No users with OpenRouter configured');
      return new Response(
        JSON.stringify({ message: 'No users to sync', synced: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${aiSettings.length} users with OpenRouter configured`);

    let totalSynced = 0;
    let totalErrors = 0;

    // Process each user
    for (const setting of aiSettings) {
      try {
        // Decrypt API key
        const { data: decryptedKey, error: decryptError } = await supabase.rpc('decrypt_text', {
          encrypted_data: setting.openrouter_api_key,
          key: encryptionKey
        });

        if (decryptError || !decryptedKey) {
          console.error(`Failed to decrypt API key for user ${setting.user_id}:`, decryptError);
          totalErrors++;
          continue;
        }

        // Get the last sync timestamp for this user
        const { data: lastLog } = await supabase
          .from('ai_usage_logs')
          .select('created_at')
          .eq('user_id', setting.user_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Default to last 24 hours if no previous sync
        const startDate = lastLog?.created_at 
          ? new Date(lastLog.created_at).toISOString()
          : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const endDate = new Date().toISOString();

        console.log(`Syncing user ${setting.user_id} from ${startDate} to ${endDate}`);

        // Fetch usage from OpenRouter
        const openRouterResponse = await fetch(
          `https://openrouter.ai/api/v1/generation?start=${startDate}&end=${endDate}`,
          {
            headers: {
              'Authorization': `Bearer ${decryptedKey}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (!openRouterResponse.ok) {
          console.error(`OpenRouter API error for user ${setting.user_id}:`, openRouterResponse.status);
          totalErrors++;
          continue;
        }

        const usageData = await openRouterResponse.json();

        if (!usageData.data || usageData.data.length === 0) {
          console.log(`No new usage data for user ${setting.user_id}`);
          continue;
        }

        // Map and insert usage logs
        const usageLogs = usageData.data.map((generation: any) => ({
          user_id: setting.user_id,
          model: generation.model,
          prompt_tokens: generation.native_tokens_prompt || 0,
          completion_tokens: generation.native_tokens_completion || 0,
          total_tokens: (generation.native_tokens_prompt || 0) + (generation.native_tokens_completion || 0),
          cost_sek: parseFloat(generation.total_cost || 0) * 11,
          cost_usd: parseFloat(generation.total_cost || 0),
          provider: 'openrouter',
          use_case: 'external_automation',
          generation_id: generation.id,
          created_at: generation.created_at,
        }));

        // Upsert to avoid duplicates
        const { error: insertError } = await supabase
          .from('ai_usage_logs')
          .upsert(usageLogs, {
            onConflict: 'generation_id',
            ignoreDuplicates: true
          });

        if (insertError) {
          console.error(`Error inserting logs for user ${setting.user_id}:`, insertError);
          totalErrors++;
        } else {
          totalSynced += usageLogs.length;
          console.log(`Synced ${usageLogs.length} logs for user ${setting.user_id}`);
        }

      } catch (userError) {
        console.error(`Error processing user ${setting.user_id}:`, userError);
        totalErrors++;
      }
    }

    console.log(`Sync completed. Synced: ${totalSynced}, Errors: ${totalErrors}`);

    return new Response(
      JSON.stringify({
        message: 'Sync completed',
        users_processed: aiSettings.length,
        logs_synced: totalSynced,
        errors: totalErrors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-openrouter-usage-cron:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
