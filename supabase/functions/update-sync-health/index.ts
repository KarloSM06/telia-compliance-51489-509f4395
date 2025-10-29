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

    console.log('🔍 Fetching all provider sync statuses...');

    // Hämta alla provider_sync_status
    const { data: statuses, error: fetchError } = await supabase
      .from('provider_sync_status')
      .select(`
        *,
        integration:integrations(*)
      `);

    if (fetchError) {
      console.error('❌ Error fetching statuses:', fetchError);
      throw fetchError;
    }

    console.log(`📊 Found ${statuses?.length || 0} sync statuses to update`);

    for (const status of statuses || []) {
      const now = Date.now();
      const lastWebhook = status.last_webhook_received_at 
        ? new Date(status.last_webhook_received_at).getTime() 
        : 0;
      const lastPoll = status.last_successful_poll_at 
        ? new Date(status.last_successful_poll_at).getTime() 
        : 0;
      
      const webhookAge = (now - lastWebhook) / (1000 * 60); // minuter
      const pollAge = (now - lastPoll) / (1000 * 60);
      
      // Webhook Health
      let webhookHealth = 'unknown';
      if (status.webhook_enabled) {
        if (webhookAge < 10) webhookHealth = 'healthy';
        else if (webhookAge < 30) webhookHealth = 'degraded';
        else webhookHealth = 'failing';
      }
      
      // Polling Health
      let pollingHealth = 'unknown';
      if (status.polling_enabled) {
        if (pollAge < 20) pollingHealth = 'healthy';
        else if (pollAge < 60) pollingHealth = 'degraded';
        else pollingHealth = 'failing';
      }
      
      // Overall Health & Confidence
      let overallHealth = 'error';
      let confidence = 0;
      
      if (webhookHealth === 'healthy' && pollingHealth === 'healthy') {
        overallHealth = 'healthy';
        confidence = 100;
      } else if (webhookHealth === 'healthy' || pollingHealth === 'healthy') {
        overallHealth = 'warning';
        confidence = 70;
      } else if (webhookHealth === 'degraded' || pollingHealth === 'degraded') {
        overallHealth = 'warning';
        confidence = 40;
      }
      
      console.log(`🔄 Updating ${status.integration?.provider} - Confidence: ${confidence}%`);

      // Uppdatera status
      const { error: updateError } = await supabase
        .from('provider_sync_status')
        .update({
          webhook_health_status: webhookHealth,
          polling_health_status: pollingHealth,
          overall_health: overallHealth,
          sync_confidence_percentage: confidence,
          updated_at: new Date().toISOString()
        })
        .eq('id', status.id);

      if (updateError) {
        console.error(`❌ Error updating status for ${status.id}:`, updateError);
      }
    }
    
    console.log('✅ Sync health update completed');

    return new Response(
      JSON.stringify({ 
        success: true,
        updated_count: statuses?.length || 0,
        timestamp: new Date().toISOString()
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('❌ Fatal error in update-sync-health:', error);
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
