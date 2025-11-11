// @ts-nocheck
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

    // Fetch pending outbound jobs
    const { data: jobs, error: fetchError } = await supabase
      .from('booking_sync_queue')
      .select('*')
      .eq('status', 'pending')
      .in('operation', ['create', 'update', 'delete'])
      .is('is_dead_letter', false)
      .or(`next_retry_at.is.null,next_retry_at.lte.${new Date().toISOString()}`)
      .order('scheduled_at', { ascending: true })
      .limit(10)

    if (fetchError) {
      throw new Error(`Failed to fetch jobs: ${fetchError.message}`)
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending outbound jobs', processed: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Processing ${jobs.length} outbound jobs`)
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

        // Get calendar event
        const { data: calendarEvent, error: eventError } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('id', job.payload.event_id)
          .single()

        if (eventError || !calendarEvent) {
          throw new Error('Calendar event not found')
        }

        // Generate idempotency key
        const idempotencyKey = await generateIdempotencyKey(
          calendarEvent.source,
          calendarEvent.external_id,
          calendarEvent.sync_version || 0
        )

        // Create adapter
        const adapter = BookingAdapterFactory.createAdapter(
          integration.provider,
          integration.encrypted_credentials
        )

        // Set event to syncing state
        await supabase
          .from('calendar_events')
          .update({ sync_state: 'syncing' })
          .eq('id', calendarEvent.id)

        let response
        const operation = job.operation

        try {
          if (operation === 'create' && calendarEvent.external_id) {
            // This is actually an update of existing booking
            const bookingInput = transformToBookingInput(calendarEvent)
            response = await adapter.updateBooking(calendarEvent.external_id, bookingInput)
          } else if (operation === 'create') {
            const bookingInput = transformToBookingInput(calendarEvent)
            response = await adapter.createBooking(bookingInput)
            
            // Store external_id if it was created
            if (response.externalId) {
              await supabase
                .from('calendar_events')
                .update({ external_id: response.externalId })
                .eq('id', calendarEvent.id)
            }
          } else if (operation === 'update') {
            const bookingInput = transformToBookingInput(calendarEvent)
            response = await adapter.updateBooking(calendarEvent.external_id, bookingInput)
          } else if (operation === 'delete') {
            await adapter.cancelBooking(calendarEvent.external_id)
            response = { success: true, message: 'Booking cancelled' }
          }

        } catch (apiError: any) {
          // Check if it's a rate limit error
          if (apiError.status === 429 || apiError.message?.includes('rate limit')) {
            const retryAfter = apiError.retryAfter || 60
            const nextRetry = new Date(Date.now() + retryAfter * 1000)
            
            await supabase
              .from('booking_sync_queue')
              .update({ 
                next_retry_at: nextRetry.toISOString(),
                last_error: `Rate limited, retry after ${retryAfter}s`
              })
              .eq('id', job.id)

            console.log(`Job ${job.id} rate limited, will retry at ${nextRetry}`)
            continue
          }
          
          throw apiError
        }

        // Update calendar event
        await supabase
          .from('calendar_events')
          .update({ 
            last_synced_at: new Date().toISOString(),
            sync_state: 'idle',
            sync_status: 'synced',
            sync_version: (calendarEvent.sync_version || 0) + 1,
            idempotency_key: idempotencyKey
          })
          .eq('id', calendarEvent.id)

        // Log success
        await supabase.from('sync_logs').insert({
          calendar_event_id: calendarEvent.id,
          direction: 'outbound',
          source: calendarEvent.source,
          external_id: calendarEvent.external_id,
          action: operation,
          status: 'success',
          request_payload: transformToBookingInput(calendarEvent),
          response_payload: response,
          idempotency_key: idempotencyKey,
          completed_at: new Date().toISOString()
        })

        // Mark job as completed
        await supabase
          .from('booking_sync_queue')
          .update({ 
            status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', job.id)

        processed++
        console.log(`Successfully processed outbound job ${job.id}`)

      } catch (error) {
        console.error(`Failed to process outbound job ${job.id}:`, error)
        failed++

        const nextRetryCount = (job.retry_count || 0) + 1
        const maxAttempts = 5

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

          // Set calendar event to error state
          if (job.payload.event_id) {
            await supabase
              .from('calendar_events')
              .update({ 
                sync_state: 'error',
                sync_status: 'failed'
              })
              .eq('id', job.payload.event_id)
          }
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
          calendar_event_id: job.payload.event_id,
          direction: 'outbound',
          source: job.payload.source,
          external_id: job.payload.external_id,
          action: job.operation,
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
        message: 'Outbound processing complete',
        processed,
        failed,
        total: jobs.length
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Outbound queue processor error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateIdempotencyKey(
  source: string,
  externalId: string,
  syncVersion: number
): Promise<string> {
  const data = `${source}:${externalId}:${syncVersion}`
  const encoder = new TextEncoder()
  const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data))
  const hashArray = Array.from(new Uint8Array(hash))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function transformToBookingInput(event: any): any {
  return {
    title: event.title,
    description: event.description,
    startTime: event.start_time,
    endTime: event.end_time,
    customer: {
      name: event.contact_person,
      email: event.contact_email,
      phone: event.contact_phone
    },
    metadata: event.external_resource || {}
  }
}