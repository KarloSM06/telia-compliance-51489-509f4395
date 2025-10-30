import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing analysis queue...');

    // Fetch pending jobs (max 10 at a time)
    const { data: jobs, error: fetchError } = await supabase
      .from('review_analysis_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('created_at', { ascending: true })
      .limit(10);

    if (fetchError) {
      console.error('Error fetching jobs:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${jobs?.length || 0} pending jobs`);
    const results = [];

    for (const job of jobs || []) {
      try {
        console.log(`Processing job ${job.id} for user ${job.user_id}`);

        // Mark as processing
        await supabase
          .from('review_analysis_queue')
          .update({ 
            status: 'processing', 
            started_at: new Date().toISOString() 
          })
          .eq('id', job.id);

        // Invoke analyze-reviews function
        const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-reviews', {
          body: { 
            user_id: job.user_id,
            trigger_source: job.trigger_source,
            auto_triggered: true
          }
        });

        if (analysisError) {
          console.error(`Analysis error for job ${job.id}:`, analysisError);
          throw analysisError;
        }

        console.log(`Successfully analyzed for job ${job.id}`);

        // Mark as completed
        await supabase
          .from('review_analysis_queue')
          .update({ 
            status: 'completed', 
            completed_at: new Date().toISOString() 
          })
          .eq('id', job.id);

        results.push({ job_id: job.id, status: 'completed' });
      } catch (error: any) {
        console.error(`Failed to process job ${job.id}:`, error);

        // Mark as failed
        await supabase
          .from('review_analysis_queue')
          .update({ 
            status: 'failed', 
            error_message: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', job.id);

        results.push({ job_id: job.id, status: 'failed', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        processed: results.length, 
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Queue processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});