import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    // Initialize OAuth flow
    if (path.includes('/init')) {
      const { client_id, integration_id } = await req.json()
      
      const redirectUri = `${url.origin}${url.pathname.replace('/init', '/callback')}`
      const state = `${integration_id}` // Store integration_id in state
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(client_id)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events')}` +
        `&access_type=offline` +
        `&prompt=consent` +
        `&state=${encodeURIComponent(state)}`

      return new Response(
        JSON.stringify({ authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle OAuth callback
    if (path.includes('/callback')) {
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      const error = url.searchParams.get('error')

      if (error) {
        return new Response(
          `<html><body><script>window.opener.postMessage({error: '${error}'}, '*'); window.close();</script></body></html>`,
          { headers: { 'Content-Type': 'text/html' } }
        )
      }

      if (!code || !state) {
        throw new Error('Missing code or state parameter')
      }

      // Get the integration to retrieve client_id and client_secret
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: integration, error: integrationError } = await supabaseClient
        .from('booking_system_integrations')
        .select('*')
        .eq('id', state)
        .single()

      if (integrationError || !integration) {
        throw new Error('Integration not found')
      }

      const credentials = integration.encrypted_credentials
      const clientId = credentials['Client ID']
      const clientSecret = credentials['Client Secret']

      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: `${url.origin}${url.pathname}`,
          grant_type: 'authorization_code',
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`Token exchange failed: ${errorText}`)
      }

      const tokens = await tokenResponse.json()

      // Update integration with tokens
      const updatedCredentials = {
        ...credentials,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      }

      await supabaseClient
        .from('booking_system_integrations')
        .update({
          encrypted_credentials: updatedCredentials,
          is_enabled: true,
        })
        .eq('id', state)

      // Send success message to opener window
      return new Response(
        `<html><body><script>window.opener.postMessage({success: true, integrationId: '${state}'}, '*'); window.close();</script></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Refresh token endpoint
    if (path.includes('/refresh')) {
      const { integration_id } = await req.json()

      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { data: integration, error: integrationError } = await supabaseClient
        .from('booking_system_integrations')
        .select('*')
        .eq('id', integration_id)
        .single()

      if (integrationError || !integration) {
        throw new Error('Integration not found')
      }

      const credentials = integration.encrypted_credentials
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: credentials['Client ID'],
          client_secret: credentials['Client Secret'],
          refresh_token: credentials.refresh_token,
          grant_type: 'refresh_token',
        }),
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`Token refresh failed: ${errorText}`)
      }

      const tokens = await tokenResponse.json()

      const updatedCredentials = {
        ...credentials,
        access_token: tokens.access_token,
        token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      }

      await supabaseClient
        .from('booking_system_integrations')
        .update({ encrypted_credentials: updatedCredentials })
        .eq('id', integration_id)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('OAuth error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})