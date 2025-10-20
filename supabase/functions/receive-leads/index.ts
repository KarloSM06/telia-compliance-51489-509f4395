import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Zod schema for input validation
const LeadSchema = z.object({
  company_name: z.string().min(1).max(200),
  contact_person: z.string().max(100).optional(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  website: z.string().url().max(500).optional().or(z.literal('')),
  industry: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  company_size: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  ai_score: z.number().int().min(0).max(100).optional(),
  ai_reasoning: z.string().max(500).optional(),
}).strict();

const RequestSchema = z.object({
  search_id: z.string().uuid(),
  user_id: z.string().uuid(),
  leads: z.array(LeadSchema).min(1).max(100)
});

interface Lead {
  company_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  location?: string;
  company_size?: string;
  description?: string;
  ai_score?: number;
  ai_reasoning?: string;
}

interface RequestBody {
  search_id: string;
  user_id: string;
  leads: Lead[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const rawBody = await req.json();
    
    // Validate input with Zod
    let validatedBody: RequestBody;
    try {
      validatedBody = RequestSchema.parse(rawBody);
    } catch (error) {
      console.error('Input validation failed:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input data', 
          details: error instanceof z.ZodError ? error.errors : 'Validation failed' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { search_id, user_id, leads } = validatedBody;

    // Verify search exists and belongs to user
    const { data: search, error: searchError } = await supabaseClient
      .from('lead_searches')
      .select('*')
      .eq('id', search_id)
      .eq('user_id', user_id)
      .single();

    if (searchError || !search) {
      return new Response(
        JSON.stringify({ error: 'Search not found or unauthorized' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert leads
    const leadsToInsert = leads.map(lead => ({
      ...lead,
      user_id,
      organization_id: search.organization_id,
      search_id,
      source: 'n8n' as const,
    }));

    const { data: insertedLeads, error: insertError } = await supabaseClient
      .from('leads')
      .insert(leadsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting leads:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to insert leads' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update leads_generated count
    const { error: updateError } = await supabaseClient
      .from('lead_searches')
      .update({ 
        leads_generated: search.leads_generated + leads.length,
        last_run_at: new Date().toISOString()
      })
      .eq('id', search_id);

    if (updateError) {
      console.error('Error updating search:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leads_inserted: insertedLeads?.length || 0 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in receive-leads function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});