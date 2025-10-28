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

    const rawBody = await req.text();
    const payload: LeaddeskWebhookPayload = JSON.parse(rawBody);
    
    // Verify webhook signature using HMAC-SHA256
    const signature = req.headers.get('x-leaddesk-signature');
    const timestamp = req.headers.get('x-leaddesk-timestamp');
    const webhookSecret = Deno.env.get('LEADDESK_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      console.error('LEADDESK_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!signature || !timestamp) {
      console.error('Missing webhook signature or timestamp');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate timestamp to prevent replay attacks (max 5 minutes old)
    const requestTime = parseInt(timestamp);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - requestTime) > 300) {
      console.error('Webhook timestamp too old or invalid');
      return new Response(JSON.stringify({ error: 'Request expired' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Compute HMAC-SHA256 signature
    const encoder = new TextEncoder();
    const keyData = encoder.encode(webhookSecret);
    const messageData = encoder.encode(`${timestamp}.${rawBody}`);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Webhook received successfully

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
      console.error('Agent mapping not found:', payload.agent_id, mappingError);
      return new Response(JSON.stringify({ 
        error: 'Agent not found'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = agentMapping.user_id;

    // Check if user has Leaddesk enabled and consent
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('leaddesk_enabled, leaddesk_consent, data_retention_days')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', userId, profileError);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profile.leaddesk_enabled || !profile.leaddesk_consent) {
      console.error('Leaddesk not enabled or no consent for user:', userId);
      return new Response(JSON.stringify({ 
        error: 'Access denied' 
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get encryption key
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');
    if (!encryptionKey) {
      console.error('ENCRYPTION_KEY not configured');
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Encrypt PII data
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
    const leaddeskApiKey = Deno.env.get('LEADDESK_API_KEY');
    const leaddeskZone = Deno.env.get('LEADDESK_ZONE') || 'NOR';
    
    if (!leaddeskApiKey) {
      console.error('LEADDESK_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
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
        error: 'Failed to download audio file'
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const audioBlob = await audioResponse.arrayBuffer();
    const audioSize = audioBlob.byteLength;
    
    // Double-check size after download
    if (audioSize > MAX_AUDIO_SIZE) {
      return new Response(JSON.stringify({ 
        error: 'Audio file exceeds maximum size (100MB)' 
      }), {
        status: 413,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Upload to Supabase Storage
    const fileName = `leaddesk_${payload.call_id}_${Date.now()}.mp3`;
    const filePath = `${userId}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filePath, audioBlob, {
        contentType: 'audio/mpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return new Response(JSON.stringify({ 
        error: 'Failed to upload audio file'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate deletion date based on retention policy
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + (profile.data_retention_days || 90));

    // Create call record with encrypted Leaddesk data
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
        error: 'Failed to process request'
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

    // Check subscription to determine processing
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('smart_analysis_enabled, full_analysis_enabled, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    let shouldProcess = false;
    let skipReason = null;

    if (!subscription) {
      skipReason = 'no_subscription';
    } else if (subscription.full_analysis_enabled) {
      shouldProcess = true;
    } else if (subscription.smart_analysis_enabled) {
      // Check if it's a sale (outcome field from payload)
      const isSale = payload.outcome === 'sale' || payload.disposition === 'sale';
      if (isSale) {
        shouldProcess = true;
      } else {
        skipReason = 'not_sale';
      }
    } else {
      skipReason = 'analysis_disabled';
    }

    if (shouldProcess) {
      await supabase.functions.invoke('process-call-lovable', {
        body: { filePath },
      });
    } else {
      // Mark call as skipped
      await supabase
        .from('calls')
        .update({ 
          status: 'skipped',
          encrypted_analysis: { skip_reason: skipReason }
        })
        .eq('id', call.id);
    }
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
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
