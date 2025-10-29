import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { integration_id } = await req.json();

    console.log('🔄 Triggering manual sync for integration:', integration_id);

    // Fetch integration
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('user_id', user.id)
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found');
    }

    const isTelephony = integration.provider_type === 'telephony' || integration.provider_type === 'multi';
    const isCalendar = integration.provider_type === 'calendar';

    let result = {
      success: false,
      message: '',
      details: {},
    };

    if (isTelephony) {
      // Create sync jobs for telephony
      const jobs = [
        { job_type: 'calls', status: 'pending' },
        { job_type: 'messages', status: 'pending' },
      ];

      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      for (const job of jobs) {
        const { error: jobError } = await adminClient
          .from('telephony_sync_jobs')
          .insert({
            account_id: integration_id,
            provider: integration.provider,
            job_type: job.job_type,
            status: job.status,
            cursor: null,
            last_sync_timestamp: null,
            items_synced: 0,
            retry_count: 0,
          });

        if (jobError) {
          console.error('Error creating sync job:', jobError);
        }
      }

      // Trigger telephony sync function
      const { data: syncData, error: syncError } = await supabase.functions.invoke(
        'telephony-account-sync',
        {
          body: { account_id: integration_id },
        }
      );

      if (syncError) {
        throw syncError;
      }

      result = {
        success: true,
        message: 'Telefoni-synkronisering startad',
        details: { jobs_created: jobs.length, ...syncData },
      };

    } else if (isCalendar) {
      // Trigger calendar sync
      const { data: syncData, error: syncError } = await supabase.functions.invoke(
        'sync-booking-systems',
        {
          body: { 
            integration_id,
            force: true,
          },
        }
      );

      if (syncError) {
        throw syncError;
      }

      result = {
        success: true,
        message: 'Kalender-synkronisering startad',
        details: syncData || {},
      };
    } else {
      result = {
        success: false,
        message: 'Okänd integrationstyp',
        details: {},
      };
    }

    // Update last_sync_at
    await supabase
      .from('integrations')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', integration_id);

    console.log('✅ Sync triggered:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('❌ Sync trigger error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message,
        details: {} 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
