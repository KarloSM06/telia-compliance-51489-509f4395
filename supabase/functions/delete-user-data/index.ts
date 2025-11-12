// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    console.log('Starting data deletion for user:', user.id)

    // Log the deletion request
    await supabaseClient.from('data_access_log').insert({
      user_id: user.id,
      action: 'DATA_DELETION_REQUESTED',
      resource_type: 'USER_DATA',
    })

    // Delete audio files from storage
    const { data: files } = await supabaseClient
      .storage
      .from('audio-files')
      .list(`${user.id}`)

    if (files && files.length > 0) {
      const filePaths = files.map(file => `${user.id}/${file.name}`)
      await supabaseClient.storage.from('audio-files').remove(filePaths)
      console.log(`Deleted ${filePaths.length} audio files`)
    }

    // Delete user analysis
    await supabaseClient
      .from('user_analysis')
      .delete()
      .eq('user_id', user.id)

    // Delete calls (including Leaddesk integration data)
    await supabaseClient
      .from('calls')
      .delete()
      .eq('user_id', user.id)

    // Delete Leaddesk agent mappings
    await supabaseClient
      .from('leaddesk_agent_mapping')
      .delete()
      .eq('user_id', user.id)

    // Delete access logs
    await supabaseClient
      .from('data_access_log')
      .delete()
      .eq('user_id', user.id)

    // Delete profile (this will cascade delete related data)
    await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', user.id)

    // Delete auth user
    await supabaseClient.auth.admin.deleteUser(user.id)

    console.log('User data deletion completed successfully')

    return new Response(
      JSON.stringify({ 
        message: 'All user data has been permanently deleted',
        success: true 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error deleting user data:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
