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

        console.log(`Syncing user ${setting.user_id} - fetching last 30 days from activity endpoint`);

        // Fetch aggregated usage from OpenRouter /activity endpoint (last 30 days)
        const openRouterResponse = await fetch(
          'https://openrouter.ai/api/v1/activity',
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

        // Get existing dates we already have from submit-prompt
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: existingLogs } = await supabase
          .from('ai_usage_logs')
          .select('created_at')
          .eq('user_id', setting.user_id)
          .gte('created_at', thirtyDaysAgo.toISOString());

        const existingDatesSet = new Set(
          existingLogs?.map(log => log.created_at.split('T')[0]) || []
        );

        // Filter out dates we already have to avoid duplicates
        const newActivityLogs = usageData.data
          .filter((item: any) => !existingDatesSet.has(item.date))
          .map((item: any) => ({
            user_id: setting.user_id,
            model: item.model,
            prompt_tokens: item.prompt_tokens || 0,
            completion_tokens: item.completion_tokens || 0,
            total_tokens: item.total_tokens || 0,
            cost_usd: item.cost || 0,
            cost_sek: (item.cost || 0) * 11,
            provider: 'openrouter',
            use_case: 'activity_backup',
            generation_id: null, // Activity endpoint doesn't provide this
            created_at: item.date, // YYYY-MM-DD format
            request_metadata: {
              endpoint: item.endpoint,
              requests_count: item.requests,
              source: 'activity_cron'
            }
          }));

        if (newActivityLogs.length === 0) {
          console.log(`All dates already synced for user ${setting.user_id}`);
          continue;
        }

        // Insert new logs
        const { error: insertError } = await supabase
          .from('ai_usage_logs')
          .insert(newActivityLogs);

        if (insertError) {
          console.error(`Error inserting logs for user ${setting.user_id}:`, insertError);
          totalErrors++;
        } else {
          totalSynced += newActivityLogs.length;
          console.log(`Synced ${newActivityLogs.length} new activity logs for user ${setting.user_id}`);
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
