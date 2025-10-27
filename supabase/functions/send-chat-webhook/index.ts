import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const messageData = await req.json();
    
    console.log('📤 Sending webhook to n8n for message:', messageData.id);
    
    // Skicka webhook till n8n
    const n8nResponse = await fetch(
      'https://n8n.srv1053222.hstgr.cloud/webhook-test/8c46d3ab-14aa-4535-be9b-9619866305aa',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      }
    );

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('❌ n8n webhook failed:', n8nResponse.status, errorText);
      throw new Error(`n8n webhook failed: ${n8nResponse.status} - ${errorText}`);
    }

    const responseData = await n8nResponse.text();
    console.log('✅ Webhook sent successfully to n8n:', responseData);

    return new Response(
      JSON.stringify({ success: true, n8nResponse: responseData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('❌ Error in send-chat-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
