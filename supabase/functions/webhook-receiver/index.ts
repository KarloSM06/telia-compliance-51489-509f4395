import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-timestamp, x-source, x-event-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const provider = url.searchParams.get('provider')
    
    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Provider parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const signature = req.headers.get('X-Signature') || req.headers.get('x-signature')
    const timestamp = req.headers.get('X-Timestamp') || req.headers.get('x-timestamp')
    const eventType = req.headers.get('X-Event-Type') || req.headers.get('x-event-type')
    
    // Get raw body for signature verification
    const rawBody = await req.text()
    
    // Verify timestamp (reject if older than 5 minutes)
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp) * 1000
      if (age > 5 * 60 * 1000) {
        console.log('Webhook rejected: too old')
        return new Response(
          JSON.stringify({ error: 'Webhook too old' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Find integration for this provider
    const { data: integrations, error: intError } = await supabase
      .from('booking_system_integrations')
      .select('id, user_id')
      .eq('provider', provider)
      .eq('is_enabled', true)

    if (intError || !integrations || integrations.length === 0) {
      console.error('No active integration found for provider:', provider)
      return new Response(
        JSON.stringify({ error: 'No active integration found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const integration = integrations[0]

    // Get webhook secret for signature verification
    const { data: secretData } = await supabase
      .from('webhook_secrets')
      .select('secret, algorithm, header_name')
      .eq('integration_id', integration.id)
      .single()

    // Verify signature if secret exists
    if (secretData && signature) {
      const expectedSignature = await verifyHMAC(
        rawBody,
        secretData.secret,
        secretData.algorithm || 'sha256'
      )
      
      if (signature !== expectedSignature) {
        console.error('Signature verification failed')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Parse webhook payload
    let payload
    try {
      payload = JSON.parse(rawBody)
    } catch (e) {
      console.error('Failed to parse webhook payload:', e)
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Queue webhook for processing
    const { error: queueError } = await supabase
      .from('booking_sync_queue')
      .insert({
        integration_id: integration.id,
        operation: 'webhook',
        entity_type: 'booking',
        entity_id: payload.booking_id || payload.id || 'unknown',
        payload: {
          source: provider,
          raw: payload,
          headers: {
            signature,
            timestamp,
            eventType
          }
        },
        scheduled_at: new Date().toISOString(),
        status: 'pending'
      })

    if (queueError) {
      console.error('Failed to queue webhook:', queueError)
      return new Response(
        JSON.stringify({ error: 'Failed to queue webhook' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update webhook last received timestamp
    await supabase
      .from('booking_webhooks')
      .update({ last_received_at: new Date().toISOString() })
      .eq('integration_id', integration.id)

    console.log(`Webhook from ${provider} queued successfully`)
    
    return new Response(
      JSON.stringify({ ok: true, message: 'Webhook received' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Webhook receiver error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function verifyHMAC(
  data: string,
  secret: string,
  algorithm: string = 'sha256'
): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: algorithm.toUpperCase() },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  )
  
  const hashArray = Array.from(new Uint8Array(signature))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return `${algorithm}=${hashHex}`
}