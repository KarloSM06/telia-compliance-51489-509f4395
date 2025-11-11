import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { BookingAdapterFactory } from '../_shared/booking-integrations/adapter-factory.ts';
import { toZonedTime, fromZonedTime } from "https://esm.sh/date-fns-tz@3.2.0";

const STOCKHOLM_TZ = 'Europe/Stockholm';

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting booking systems sync...');

    const { data: integrations, error: integrationsError } = await supabase
      .from('booking_system_integrations')
      .select('*')
      .eq('is_enabled', true)
      .or(`next_sync_at.is.null,next_sync_at.lte.${new Date().toISOString()}`);

    if (integrationsError) {
      console.error('Error fetching integrations:', integrationsError);
      throw integrationsError;
    }

    console.log(`Found ${integrations?.length || 0} integrations to sync`);

    const results = [];

    for (const integration of integrations || []) {
      try {
        console.log(`Syncing ${integration.provider} for user ${integration.user_id}...`);

        const adapter = BookingAdapterFactory.createAdapter(
          integration.provider,
          integration.encrypted_credentials
        );

        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

        const externalBookings = await adapter.fetchBookings({
          startDate,
          endDate
        });

        console.log(`Found ${externalBookings.length} bookings from ${integration.provider}`);

        let syncedCount = 0;

        for (const booking of externalBookings) {
          // Convert external booking times to Stockholm timezone, then to UTC for storage
          const startStockholm = toZonedTime(new Date(booking.startTime), STOCKHOLM_TZ);
          const endStockholm = toZonedTime(new Date(booking.endTime), STOCKHOLM_TZ);
          const startUTC = fromZonedTime(startStockholm, STOCKHOLM_TZ);
          const endUTC = fromZonedTime(endStockholm, STOCKHOLM_TZ);
          
          const { error: upsertError } = await supabase
            .from('calendar_events')
            .upsert({
              user_id: integration.user_id,
              organization_id: integration.organization_id,
              booking_system_integration_id: integration.id,
              external_id: booking.externalId,
              title: booking.title,
              description: booking.description,
              start_time: startUTC.toISOString(),
              end_time: endUTC.toISOString(),
              status: booking.status === 'confirmed' ? 'completed' : 'scheduled',
              source: integration.provider,
              contact_person: booking.customer.name,
              contact_email: booking.customer.email,
              contact_phone: booking.customer.phone,
              event_type: 'meeting',
              timezone: STOCKHOLM_TZ,
              sync_status: 'synced',
              last_synced_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,external_id,source'
            });

          if (!upsertError) {
            syncedCount++;
          } else {
            console.error('Error upserting event:', upsertError);
          }
        }

        const nextSyncMinutes = integration.sync_settings?.sync_interval_minutes || 5;
        const { error: updateError } = await supabase
          .from('booking_system_integrations')
          .update({
            last_sync_at: new Date().toISOString(),
            last_sync_status: 'success',
            last_sync_error: null,
            next_sync_at: new Date(Date.now() + nextSyncMinutes * 60 * 1000).toISOString(),
            total_synced_events: (integration.total_synced_events || 0) + syncedCount
          })
          .eq('id', integration.id);

        if (updateError) {
          console.error('Error updating integration status:', updateError);
        }

        results.push({
          provider: integration.provider,
          status: 'success',
          synced: syncedCount,
          total: externalBookings.length
        });

      } catch (error) {
        console.error(`Sync failed for ${integration.provider}:`, error);

        await supabase
          .from('booking_system_integrations')
          .update({
            last_sync_status: 'error',
            last_sync_error: error.message,
            failed_syncs: (integration.failed_syncs || 0) + 1
          })
          .eq('id', integration.id);

        results.push({
          provider: integration.provider,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log('Sync complete:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Sync function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
