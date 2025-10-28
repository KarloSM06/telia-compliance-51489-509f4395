import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const RequestSchema = z.object({
  lead_id: z.string().uuid('Invalid lead ID format'),
});

// Validation schema for AI enrichment response
const enrichmentSchema = z.object({
  ai_score: z.number().int().min(1).max(100),
  ai_reasoning: z.string().max(200).min(1),
  description: z.string().max(300).min(1),
  recommended_product: z.enum(['EKO', 'GASTRO', 'TALENT', 'KRONO', 'THOR']).optional(),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const rawBody = await req.json();
    const result = RequestSchema.safeParse(rawBody);

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: result.error.errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { lead_id } = result.data;

    // Fetch the lead with ownership verification
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .eq('user_id', user.id)
      .single();

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found or unauthorized' }),
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

    // Parse and validate AI response
    let enrichmentData;
    try {
      const parsedData = JSON.parse(aiContent);
      enrichmentData = enrichmentSchema.parse(parsedData);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        throw new Error(`Invalid AI response format: ${parseError.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw new Error('Invalid AI response format');
    }

    // Update the lead with enriched data (with ownership verification)
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
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      throw new Error('Failed to update lead');
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
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});