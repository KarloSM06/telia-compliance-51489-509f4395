import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userId, conversationId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Send webhook for user's message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user') {
      try {
        const webhookUrl = "https://n8n.srv1053222.hstgr.cloud/webhook-test/8c46d3ab-14aa-4535-be9b-9619866305aa";
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            user_id: userId,
            role: 'user',
            content: lastUserMessage.content,
            provider: 'claude-linkedin',
            timestamp: new Date().toISOString(),
          }),
        });
        console.log("Webhook sent successfully for user message");
      } catch (webhookError) {
        console.error("Failed to send webhook for user message:", webhookError);
        // Don't fail the request if webhook fails
      }
    }

    // System prompt for LinkedIn lead assistant
    const systemPrompt = `Du är en AI-assistent som hjälper användare att hitta och analysera leads från LinkedIn.

Din huvuduppgift är att:
- Hjälpa användare att specificera vilka typer av leads de söker
- Ge råd om hur man söker effektivt efter specifika företag eller personer
- Förklara hur man använder olika sökfilter och kriterier
- Ge tips om prospektering och leadgenerering på LinkedIn

Svara alltid på svenska och håll svaren kortfattade och praktiska.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit överskriden, försök igen senare." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Betalning krävs, lägg till krediter i din Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway fel" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create a readable stream that saves the complete response to Supabase
    let fullResponse = "";
    
    if (!response.body) {
      throw new Error("No response body");
    }

    // Create a transform stream to intercept and save the response
    const transformStream = new TransformStream({
      async transform(chunk, controller) {
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk, { stream: true });
        
        // Parse SSE data to extract content
        const lines = text.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
              }
            } catch (e) {
              // Ignore parse errors for partial data
            }
          }
        }
        
        controller.enqueue(chunk);
      },
      async flush() {
        // Save the complete assistant response to Supabase
        if (fullResponse && userId && conversationId) {
          const { data: savedMessage } = await supabase
            .from('lead_chat_messages')
            .insert({
              user_id: userId,
              provider: 'claude-linkedin',
              role: 'assistant',
              content: fullResponse,
              metadata: {},
              conversation_id: conversationId,
            })
            .select()
            .single();

          // Send webhook to n8n with chat data
          try {
            const webhookUrl = "https://n8n.srv1053222.hstgr.cloud/webhook-test/8c46d3ab-14aa-4535-be9b-9619866305aa";
            const webhookResponse = await fetch(webhookUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                conversation_id: conversationId,
                message_id: savedMessage?.id,
                user_id: userId,
                role: 'assistant',
                content: fullResponse,
                provider: 'claude-linkedin',
                timestamp: new Date().toISOString(),
              }),
            });
            console.log("Webhook sent successfully for assistant message:", webhookResponse.status);
          } catch (webhookError) {
            console.error("Failed to send webhook:", webhookError);
            // Don't fail the request if webhook fails
          }
        }
      }
    });

    // Pipe the response through our transform stream
    const stream = response.body.pipeThrough(transformStream);

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Okänt fel" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
