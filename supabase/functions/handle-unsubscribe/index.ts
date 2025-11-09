// @ts-nocheck
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
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { token, email, phone, opt_out_sms, opt_out_email } = await req.json();

    if (!token && (!email && !phone)) {
      throw new Error('Either token or email/phone is required');
    }

    let updateData: any = {};
    
    if (opt_out_sms !== undefined) updateData.opt_out_sms = opt_out_sms;
    if (opt_out_email !== undefined) updateData.opt_out_email = opt_out_email;

    if (token) {
      // Update by token
      const { error } = await supabaseAdmin
        .from('customer_preferences')
        .update(updateData)
        .eq('unsubscribe_token', token);

      if (error) throw error;
    } else {
      // Upsert by email or phone
      const { error } = await supabaseAdmin
        .from('customer_preferences')
        .upsert({
          email,
          phone,
          ...updateData,
        }, {
          onConflict: email ? 'email' : 'phone',
        });

      if (error) throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Preferences updated successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in handle-unsubscribe function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
