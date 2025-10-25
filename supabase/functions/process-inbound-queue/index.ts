import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { BookingAdapterFactory } from '../_shared/booking-integrations/adapter-factory.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch pending inbound jobs (limit 10 per run)
    const { data: jobs, error: fetchError } = await supabase
      .from('booking_sync_queue')
      .select('*')
      .eq('status', 'pending')
      .eq('operation', 'webhook')
      .is('is_dead_letter', false)
      .or(`next_retry_at.is.null,next_retry_at.lte.${new Date().toISOString()}`)
      .order('scheduled_at', { ascending: true })
      .limit(10)

    if (fetchError) {
      throw new Error(`Failed to fetch jobs: ${fetchError.message}`)
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending jobs', processed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing ${jobs.length} inbound jobs`)
    let processed = 0
    let failed = 0

    for (const job of jobs) {
      try {
        // Get integration details
        const { data: integration, error: intError } = await supabase
          .from('booking_system_integrations')
          .select('*')
          .eq('id', job.integration_id)
          .single()

        if (intError || !integration) {
          throw new Error('Integration not found')
        }

        // Create adapter
        const adapter = BookingAdapterFactory.createAdapter(
          integration.provider,
          integration.encrypted_credentials
        )

        // Parse webhook event
        const webhookEvent = adapter.parseWebhookEvent(job.payload.raw)
        
        // Transform to internal format
        const internalBooking = adapter.toInternalFormat(webhookEvent.booking)

        // Check if event already exists and is newer
        const { data: existingEvent } = await supabase
          .from('calendar_events')
          .select('updated_at, last_synced_at, id')
          .eq('source', internalBooking.source)
          .eq('external_id', internalBooking.externalId)
          .single()

        let action = 'create'
        let shouldSync = true

        if (existingEvent) {
          action = 'update'
          // Check if inbound is newer
          const inboundTime = new Date(webhookEvent.booking.updatedAt || webhookEvent.booking.startTime)
          const dbTime = new Date(existingEvent.updated_at)
          
          if (inboundTime <= dbTime) {
            console.log('Inbound event is older or same, skipping')
            action = 'noop'
            shouldSync = false
          }
        }

        if (shouldSync) {
          // Upsert calendar event
          const eventData = {
            user_id: integration.user_id,
            organization_id: integration.organization_id,
            source: internalBooking.source,
            external_id: internalBooking.externalId,
            title: internalBooking.title,
            description: internalBooking.description,
            start_time: internalBooking.startTime,
            end_time: internalBooking.endTime,
            timezone: internalBooking.timezone,
            status: mapStatus(internalBooking.status),
            contact_person: internalBooking.customer.name,
            contact_email: internalBooking.customer.email,
            contact_phone: internalBooking.customer.phone,
            external_resource: internalBooking.metadata,
            last_synced_at: new Date().toISOString(),
            sync_status: 'synced',
            sync_state: 'idle',
            updated_at: new Date().toISOString()
          }

          const { data: upsertedEvent, error: upsertError } = await supabase
            .from('calendar_events')
            .upsert(eventData, {
              onConflict: 'source,external_id',
              ignoreDuplicates: false
            })
            .select()
            .single()

          if (upsertError) {
            throw new Error(`Failed to upsert event: ${upsertError.message}`)
          }

          // Log sync success
          await supabase.from('sync_logs').insert({
            calendar_event_id: existingEvent?.id || upsertedEvent.id,
            direction: 'inbound',
            source: internalBooking.source,
            external_id: internalBooking.externalId,
            action,
            status: 'success',
            request_payload: job.payload,
            response_payload: upsertedEvent,
            completed_at: new Date().toISOString()
          })
        } else {
          // Log no-op
          await supabase.from('sync_logs').insert({
            calendar_event_id: existingEvent.id,
            direction: 'inbound',
            source: internalBooking.source,
            external_id: internalBooking.externalId,
            action: 'noop',
            status: 'success',
            request_payload: job.payload,
            error_message: 'Inbound event is not newer than existing',
            completed_at: new Date().toISOString()
          })
        }

        // Mark job as completed
        await supabase
          .from('booking_sync_queue')
          .update({ 
            status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', job.id)

        processed++
        console.log(`Successfully processed job ${job.id}`)

      } catch (error) {
        console.error(`Failed to process job ${job.id}:`, error)
        failed++

        const nextRetryCount = (job.retry_count || 0) + 1
        const maxAttempts = job.max_attempts || 3

        if (nextRetryCount >= maxAttempts) {
          // Move to DLQ
          await supabase
            .from('booking_sync_queue')
            .update({ 
              status: 'failed',
              is_dead_letter: true,
              last_error: error.message,
              retry_count: nextRetryCount,
              processed_at: new Date().toISOString()
            })
            .eq('id', job.id)
        } else {
          // Schedule retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, nextRetryCount), 3600000)
          const nextRetry = new Date(Date.now() + delay)
          
          await supabase
            .from('booking_sync_queue')
            .update({ 
              retry_count: nextRetryCount,
              next_retry_at: nextRetry.toISOString(),
              last_error: error.message
            })
            .eq('id', job.id)
        }

        // Log failure
        await supabase.from('sync_logs').insert({
          direction: 'inbound',
          source: job.payload.source,
          action: 'create',
          status: 'error',
          request_payload: job.payload,
          error_message: error.message,
          attempt: nextRetryCount,
          max_attempts: maxAttempts,
          completed_at: new Date().toISOString()
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Inbound processing complete',
        processed,
        failed,
        total: jobs.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Inbound queue processor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function mapStatus(externalStatus: string): string {
  const statusMap: Record<string, string> = {
    'confirmed': 'scheduled',
    'pending': 'scheduled',
    'cancelled': 'cancelled',
    'booked': 'scheduled',
    'completed': 'completed'
  }
  
  return statusMap[externalStatus.toLowerCase()] || 'scheduled'
}