import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { BookingAdapterFactory } from '../_shared/booking-integrations/adapter-factory.ts';

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

    console.log('Starting booking systems sync...');

    // Hämta alla aktiva integrationer som ska synkas
    const { data: integrations, error: integrationsError } = await supabaseClient
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
        console.log(`Syncing ${integration.provider} for user ${integration.user_id}`);
        
        // Skapa adapter för detta system
        const adapter = BookingAdapterFactory.createAdapter(
          integration.provider,
          integration.encrypted_credentials
        );

        // Hämta bokningar från externt system
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAhead = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

        const externalBookings = await adapter.fetchBookings({
          startDate: thirtyDaysAgo.toISOString(),
          endDate: ninetyDaysAhead.toISOString()
        });

        console.log(`Fetched ${externalBookings.length} bookings from ${integration.provider}`);

        // Synka till calendar_events
        let syncedCount = 0;
        for (const booking of externalBookings) {
          try {
            const eventData = {
              user_id: integration.user_id,
              organization_id: integration.organization_id,
              booking_system_integration_id: integration.id,
              external_id: booking.externalId,
              title: booking.title,
              description: booking.description,
              start_time: booking.startTime,
              end_time: booking.endTime,
              status: booking.status === 'confirmed' ? 'completed' : booking.status === 'cancelled' ? 'cancelled' : 'scheduled',
              source: integration.provider,
              contact_person: booking.customer.name,
              contact_email: booking.customer.email,
              contact_phone: booking.customer.phone,
              event_type: 'booking',
              sync_status: 'synced',
              last_synced_at: new Date().toISOString()
            };

            const { error: upsertError } = await supabaseClient
              .from('calendar_events')
              .upsert(eventData, {
                onConflict: 'user_id,external_id,source',
                ignoreDuplicates: false
              });

            if (upsertError) {
              console.error('Error upserting event:', upsertError);
            } else {
              syncedCount++;
            }
          } catch (bookingError) {
            console.error(`Error syncing booking ${booking.id}:`, bookingError);
          }
        }

        // Uppdatera sync status
        const nextSyncMinutes = integration.sync_settings?.sync_interval_minutes || 5;
        const { error: updateError } = await supabaseClient
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

        await supabaseClient
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

    console.log('Sync completed:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        results,
        totalIntegrations: integrations?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sync-booking-systems function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
