import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-leaddesk-signature',
};

interface LeaddeskWebhookPayload {
  call_id: string;
  campaign_id: string;
  agent_id: string;
  agent_name: string;
  customer_phone: string;
  customer_name?: string;
  duration: number;
  recording_url: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Leaddesk webhook received');

    // Verify webhook signature
    const signature = req.headers.get('x-leaddesk-signature');
    const webhookSecret = Deno.env.get('LEADDESK_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('LEADDESK_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // TODO: Implement proper signature verification when Leaddesk provides signing method
    // For now, we'll require the secret as a header
    if (signature !== webhookSecret) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: LeaddeskWebhookPayload = await req.json();
    console.log('Webhook payload:', { 
      call_id: payload.call_id, 
      campaign_id: payload.campaign_id,
      agent_id: payload.agent_id 
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find user by agent mapping
    const { data: agentMapping, error: mappingError } = await supabase
      .from('leaddesk_agent_mapping')
      .select('user_id, encrypted_agent_name')
      .eq('leaddesk_agent_id', payload.agent_id)
      .single();

    if (mappingError || !agentMapping) {
      console.error('Agent mapping not found:', payload.agent_id);
      return new Response(JSON.stringify({ 
        error: 'Agent not mapped to user',
        agent_id: payload.agent_id 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = agentMapping.user_id;
    console.log('Found user for agent:', userId);

    // Check if user has Leaddesk enabled and consent
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leaddesk_enabled, leaddesk_consent, data_retention_days')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', userId);
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile.leaddesk_enabled || !profile.leaddesk_consent) {
      console.error('Leaddesk not enabled or no consent for user:', userId);
      return new Response(JSON.stringify({ 
        error: 'Leaddesk integration not enabled or consent not given' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get encryption key
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionKey) {
      console.error('ENCRYPTION_KEY not configured');
      return new Response(JSON.stringify({ error: 'Encryption key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Encrypt PII data
    console.log('Encrypting PII data...');
    const { data: encryptedPhone } = await supabase.rpc('encrypt_text', {
      data: payload.customer_phone,
      key: encryptionKey
    });

    const { data: encryptedCustomerName } = payload.customer_name 
      ? await supabase.rpc('encrypt_text', {
          data: payload.customer_name,
          key: encryptionKey
        })
      : { data: null };

    const { data: encryptedAgentName } = await supabase.rpc('encrypt_text', {
      data: payload.agent_name,
      key: encryptionKey
    });

    // Download audio file from Leaddesk
    console.log('Downloading audio file from Leaddesk...');
    const leaddeskApiKey = Deno.env.get('LEADDESK_API_KEY');
    const leaddeskZone = Deno.env.get('LEADDESK_ZONE') || 'NOR';
    
    if (!leaddeskApiKey) {
      console.error('LEADDESK_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Leaddesk API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioResponse = await fetch(payload.recording_url, {
      headers: {
        'Authorization': `Bearer ${leaddeskApiKey}`,
      },
    });

    if (!audioResponse.ok) {
      console.error('Failed to download audio from Leaddesk:', audioResponse.status);
      return new Response(JSON.stringify({ 
        error: 'Failed to download audio',
        status: audioResponse.status 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioBlob = await audioResponse.arrayBuffer();
    const audioSize = audioBlob.byteLength;
    console.log('Audio downloaded, size:', audioSize);

    // Upload to Supabase Storage
    const fileName = `leaddesk_${payload.call_id}_${Date.now()}.mp3`;
    const filePath = `${userId}/${fileName}`;

    console.log('Uploading to Supabase Storage:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filePath, audioBlob, {
        contentType: 'audio/mpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(JSON.stringify({ 
        error: 'Failed to upload audio',
        details: uploadError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate deletion date based on retention policy
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + (profile.data_retention_days || 90));

    // Create call record with encrypted Leaddesk data
    console.log('Creating call record...');
    const { data: call, error: callError } = await supabase
      .from('calls')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_path: filePath,
        file_size: audioSize,
        status: 'uploaded',
        external_call_id: payload.call_id,
        leaddesk_campaign_id: payload.campaign_id,
        encrypted_customer_phone: encryptedPhone,
        encrypted_customer_name: encryptedCustomerName,
        encrypted_agent_name: encryptedAgentName,
        duration: `${Math.floor(payload.duration / 60)}:${(payload.duration % 60).toString().padStart(2, '0')}`,
        deletion_scheduled_at: deletionDate.toISOString(),
        leaddesk_metadata: payload.metadata || {},
      })
      .select()
      .single();

    if (callError) {
      console.error('Failed to create call record:', callError);
      // Clean up uploaded file
      await supabase.storage.from('audio-files').remove([filePath]);
      return new Response(JSON.stringify({ 
        error: 'Failed to create call record',
        details: callError.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log the webhook receipt in access log
    await supabase.from('data_access_log').insert({
      user_id: userId,
      action: 'LEADDESK_WEBHOOK_RECEIVED',
      resource_type: 'call',
      resource_id: call.id,
      ip_address: req.headers.get('x-forwarded-for') || 'leaddesk-webhook',
    });

    // Trigger process-call function
    console.log('Triggering process-call function...');
    const { error: processError } = await supabase.functions.invoke('process-call', {
      body: { filePath },
    });

    if (processError) {
      console.error('Failed to trigger process-call:', processError);
      // Don't return error - the call is saved, processing can be retried
    }

    console.log('Leaddesk webhook processed successfully');
    return new Response(JSON.stringify({ 
      success: true,
      call_id: call.id,
      external_call_id: payload.call_id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
