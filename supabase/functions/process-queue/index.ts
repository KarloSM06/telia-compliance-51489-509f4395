import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting batch processing...');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get up to 10 calls with status 'uploaded'
    const { data: pendingCalls, error: fetchError } = await supabase
      .from('calls')
      .select('id, file_path')
      .eq('status', 'uploaded')
      .not('file_path', 'is', null)
      .limit(10);

    if (fetchError) {
      throw fetchError;
    }

    if (!pendingCalls || pendingCalls.length === 0) {
      console.log('No pending calls to process');
      return new Response(
        JSON.stringify({ message: 'No pending calls', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${pendingCalls.length} calls in parallel...`);

    // Process all calls in parallel
    const processPromises = pendingCalls.map(async (call) => {
      try {
        const { error } = await supabase.functions.invoke('process-call-lovable', {
          body: { filePath: call.file_path }
        });

        if (error) {
          console.error(`Error processing call ${call.id}:`, error);
          return { id: call.id, success: false, error: error.message };
        }

        return { id: call.id, success: true };
      } catch (err) {
        console.error(`Exception processing call ${call.id}:`, err);
        return { id: call.id, success: false, error: err.message };
      }
    });

    const results = await Promise.all(processPromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Batch processing complete: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: 'Batch processing complete',
        total: pendingCalls.length,
        successful,
        failed,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in batch processing:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
