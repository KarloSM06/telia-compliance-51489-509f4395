import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteRequest {
  summary: string;
  email?: string | null;
  phone_number: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { summary, email, phone_number } = await req.json() as QuoteRequest;

    console.log('Krono quote request received:', {
      has_summary: !!summary,
      has_email: !!email,
      has_phone: !!phone_number,
    });

    // Validate required fields
    if (!summary || !phone_number) {
      return new Response(
        JSON.stringify({ error: 'Summary and phone number are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract company name from summary if possible (simple heuristic)
    const companyMatch = summary.match(/företag[:]?\s+([^\n.]+)/i) || 
                        summary.match(/company[:]?\s+([^\n.]+)/i) ||
                        summary.match(/vi heter\s+([^\n.]+)/i);
    const companyName = companyMatch ? companyMatch[1].trim() : undefined;

    // Insert into bookings table
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        kundnamn: companyName || 'Krono Lead',
        epost: email || null,
        telefonnummer: phone_number,
        bokningstyp: 'krono_quote',
        source: 'krono_quote',
        info: summary,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting booking:', error);
      throw error;
    }

    console.log('Krono quote saved successfully:', data.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        booking_id: data.id,
        message: 'Quote request saved successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in krono-quote function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});