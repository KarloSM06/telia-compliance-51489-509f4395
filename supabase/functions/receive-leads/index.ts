import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Verify API key from n8n
    const apiKey = req.headers.get('x-api-key');
    const expectedKey = Deno.env.get('N8N_API_KEY');
    
    if (!apiKey || apiKey !== expectedKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RequestBody = await req.json();
    const { search_id, user_id, leads } = body;

    if (!search_id || !user_id || !leads || !Array.isArray(leads)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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