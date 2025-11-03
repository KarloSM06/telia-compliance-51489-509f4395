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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY')!;

    if (!supabaseUrl || !supabaseServiceKey || !encryptionKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { start_date, end_date } = await req.json();

    console.log(`Syncing OpenRouter activity for user ${user.id} from ${start_date} to ${end_date}`);

    // Get provisioning key
    const { data: settings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('openrouter_provisioning_key_encrypted')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings?.openrouter_provisioning_key_encrypted) {
      throw new Error('Provisioning key not configured');
    }

    // Decrypt provisioning key
    const { data: decryptedKey, error: decryptError } = await supabase.rpc('decrypt_text', {
      encrypted_data: settings.openrouter_provisioning_key_encrypted,
      key: encryptionKey
    });

    if (decryptError || !decryptedKey) {
      throw new Error('Failed to decrypt provisioning key');
    }

    // Fetch activity data from OpenRouter
    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    const response = await fetch(
      `https://openrouter.ai/api/v1/activity?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${decryptedKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const activityData = await response.json();
    console.log(`Fetched ${activityData.data?.length || 0} activity records from OpenRouter`);
    
    // Transform and insert into ai_usage_logs
    const logsToInsert = (activityData.data || []).map((row: any) => ({
      user_id: user.id,
      generation_id: row.id || null,
      model: row.model || 'unknown',
      provider: 'openrouter',
      use_case: 'external_tracking',
      prompt_tokens: row.prompt_tokens || 0,
      completion_tokens: row.completion_tokens || 0,
      total_tokens: row.total_tokens || 0,
      cost_usd: row.cost || 0,
      cost_sek: (row.cost || 0) * 11, // Approximate SEK conversion
      status: 'success',
      created_at: row.created_at || new Date().toISOString(),
    }));

    let syncedCount = 0;
    let skippedCount = 0;

    // Insert records one by one to handle duplicates gracefully
    for (const log of logsToInsert) {
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert(log);
      
      if (!error) {
        syncedCount++;
      } else if (error.code === '23505') {
        // Duplicate key - skip silently
        skippedCount++;
      } else {
        console.error('Error inserting log:', error);
      }
    }

    console.log(`Sync complete: ${syncedCount} inserted, ${skippedCount} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        synced_records: syncedCount,
        skipped_records: skippedCount,
        total_records: logsToInsert.length,
        message: syncedCount === 0 && skippedCount > 0 
          ? 'Alla anrop fanns redan i systemet'
          : `${syncedCount} nya anrop synkade, ${skippedCount} dubletter hoppades över`
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in sync-openrouter-activity:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
