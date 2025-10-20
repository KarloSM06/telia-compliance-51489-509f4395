import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const { lead_id } = await req.json();

    if (!lead_id) {
      return new Response(
        JSON.stringify({ error: 'lead_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the lead
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .single();

    if (leadError || !lead) {
      console.error('Error fetching lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI to enrich the lead
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Du är en expert på leadkvalificering för Hiems, ett företag som erbjuder:
- EKO: Energioptimering och hållbarhetslösningar
- GASTRO: Restaurang- och storkökslösningar  
- TALENT: Rekrytering och bemanningslösningar
- KRONO: Tids- och närvarosystem
- THOR: Säkerhetslösningar

Analysera detta lead och ge strukturerad information i JSON-format.`;

    const userPrompt = `Lead-information:
Företagsnamn: ${lead.company_name}
Bransch: ${lead.industry || 'Okänd'}
Plats: ${lead.location || 'Okänd'}
Adress: ${lead.Adress || 'Okänd'}
Postnummer: ${lead.Postal_Area || 'Okänt'}
Företagsstorlek: ${lead.company_size || 'Okänd'}
Typ: ${lead.lead_type || 'business'}
${lead.organization_type ? 'Organisationstyp: ' + lead.organization_type : ''}
${lead.employee_count ? 'Antal anställda: ' + lead.employee_count : ''}
${lead.apartment_count ? 'Antal lägenheter (BRF): ' + lead.apartment_count : ''}

Ge mig:
1. ai_score (1-100): Hur bra passar leadet för Hiems produkter?
2. ai_reasoning: Kort motivering (max 200 tecken) - varför denna score?
3. description: Förbättrad företagsbeskrivning (max 300 tecken)
4. recommended_product: Vilken Hiems-produkt passar bäst? (EKO/GASTRO/TALENT/KRONO/THOR)

Svara ENDAST med valid JSON i detta exakta format:
{
  "ai_score": <number>,
  "ai_reasoning": "<string>",
  "description": "<string>",
  "recommended_product": "<string>"
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add funds to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No AI response content');
    }

    // Parse AI response
    let enrichmentData;
    try {
      enrichmentData = JSON.parse(aiContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('Invalid AI response format');
    }

    // Update the lead with enriched data
    const { data: updatedLead, error: updateError } = await supabaseClient
      .from('leads')
      .update({
        status: 'enriched',
        ai_score: enrichmentData.ai_score,
        ai_reasoning: enrichmentData.ai_reasoning,
        description: enrichmentData.description || lead.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead_id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating lead:', updateError);
      throw new Error('Failed to update lead');
    }

    // Send webhook notification to n8n
    const N8N_WEBHOOK_URL = 'https://hiems.app.n8n.cloud/webhook/f8c03e18-20fc-4a88-adff-49c6c44e5ee0';
    try {
      const webhookPayload = {
        event: 'lead.enriched',
        timestamp: new Date().toISOString(),
        lead_id: updatedLead.id,
        company_name: updatedLead.company_name,
        status: updatedLead.status,
        ai_score: updatedLead.ai_score,
        ai_reasoning: updatedLead.ai_reasoning,
        description: updatedLead.description,
        recommended_product: enrichmentData.recommended_product,
        industry: updatedLead.industry,
        location: updatedLead.location,
        user_id: updatedLead.user_id,
        organization_id: updatedLead.organization_id,
      };

      const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (!webhookResponse.ok) {
        console.error('Webhook notification failed:', webhookResponse.status, await webhookResponse.text());
      } else {
        console.log('Webhook notification sent successfully for lead:', lead_id);
      }
    } catch (webhookError) {
      // Don't fail the enrichment if webhook fails
      console.error('Error sending webhook notification:', webhookError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        lead: updatedLead,
        recommended_product: enrichmentData.recommended_product
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in enrich-lead function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});