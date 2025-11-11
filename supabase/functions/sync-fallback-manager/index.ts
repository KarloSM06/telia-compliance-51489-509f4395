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
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('🔍 Checking for webhook failures and enabling fallbacks...');

    // Hämta alla provider_sync_status där webhooks är aktiverade
    const { data: statuses, error: fetchError } = await supabase
      .from('provider_sync_status')
      .select(`
        *,
        integration:integrations(*)
      `)
      .eq('webhook_enabled', true);

    if (fetchError) {
      console.error('❌ Error fetching statuses:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${statuses?.length || 0} integrations with webhooks enabled`);

    for (const status of statuses || []) {
      const now = Date.now();
      const lastWebhook = status.last_webhook_received_at 
        ? new Date(status.last_webhook_received_at).getTime() 
        : 0;
      
      const minutesSinceWebhook = (now - lastWebhook) / (1000 * 60);
      
      // Om > 30 min sedan senaste webhook, aktivera fallback
      if (minutesSinceWebhook > 30 && status.webhook_health_status !== 'failing') {
        console.log(`⚠️ Webhook failure detected for ${status.integration.provider}, enabling fallback`);
        
        // Uppdatera till aggresiv polling
        const { error: integrationError } = await supabase
          .from('integrations')
          .update({
            polling_interval_minutes: 5, // Öka från 15 till 5 min
            polling_enabled: true
          })
          .eq('id', status.integration_id);

        if (integrationError) {
          console.error('❌ Error updating integration:', integrationError);
          continue;
        }
        
        // Uppdatera sync status
        const { error: statusError } = await supabase
          .from('provider_sync_status')
          .update({
            webhook_health_status: 'failing',
            sync_method: 'polling', // Byt till polling-mode
            overall_health: 'warning',
            sync_confidence_percentage: 70,
            updated_at: new Date().toISOString()
          })
          .eq('id', status.id);

        if (statusError) {
          console.error('❌ Error updating status:', statusError);
        } else {
          console.log(`✅ Fallback enabled for ${status.integration.provider}`);
        }
      }
      
      // Om webhooks återhämtar sig, återgå till normal polling
      if (minutesSinceWebhook < 10 && status.webhook_health_status === 'failing') {
        console.log(`✨ Webhook recovered for ${status.integration.provider}, restoring normal mode`);

        const { error: integrationError } = await supabase
          .from('integrations')
          .update({
            polling_interval_minutes: 15 // Återgå till normal
          })
          .eq('id', status.integration_id);

        if (integrationError) {
          console.error('❌ Error updating integration:', integrationError);
          continue;
        }
        
        const { error: statusError } = await supabase
          .from('provider_sync_status')
          .update({
            webhook_health_status: 'healthy',
            sync_method: 'hybrid',
            overall_health: 'healthy',
            sync_confidence_percentage: 100,
            updated_at: new Date().toISOString()
          })
          .eq('id', status.id);

        if (statusError) {
          console.error('❌ Error updating status:', statusError);
        } else {
          console.log(`✅ Normal mode restored for ${status.integration.provider}`);
        }
      }
    }
    
    console.log('✅ Fallback check completed');

    return new Response(
      JSON.stringify({ 
        success: true,
        checked_count: statuses?.length || 0,
        timestamp: new Date().toISOString()
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('❌ Fatal error in sync-fallback-manager:', error);
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
