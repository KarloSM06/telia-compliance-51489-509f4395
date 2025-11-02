import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EndpointTestResult {
  status: 'success' | 'error';
  data_sample?: any;
  error?: string;
  requires_special_key?: boolean;
  data_format?: string;
  response_time_ms?: number;
}

interface TestReport {
  generation_endpoint: EndpointTestResult;
  activity_endpoint: EndpointTestResult;
  recommendation: 'generation' | 'activity' | 'both' | 'neither';
  summary: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !encryptionKey) {
      throw new Error('Missing required environment variables');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Testing OpenRouter endpoints for user:', user.id);

    // Get user's OpenRouter API key
    const { data: settings, error: settingsError } = await supabase
      .from('user_ai_settings')
      .select('openrouter_api_key_encrypted')
      .eq('user_id', user.id)
      .maybeSingle();

    if (settingsError || !settings?.openrouter_api_key_encrypted) {
      throw new Error('OpenRouter API key not configured');
    }

    // Decrypt API key
    const { data: decryptedKey, error: decryptError } = await supabase.rpc(
      'decrypt_text',
      {
        encrypted_data: settings.openrouter_api_key_encrypted,
        key: encryptionKey,
      }
    );

    if (decryptError || !decryptedKey) {
      throw new Error('Failed to decrypt API key');
    }

    const report: TestReport = {
      generation_endpoint: await testGenerationEndpoint(decryptedKey),
      activity_endpoint: await testActivityEndpoint(decryptedKey),
      recommendation: 'neither',
      summary: '',
    };

    // Determine recommendation
    const genSuccess = report.generation_endpoint.status === 'success';
    const actSuccess = report.activity_endpoint.status === 'success';

    if (genSuccess && actSuccess) {
      report.recommendation = 'both';
      report.summary = '✅ Båda endpoints fungerar! Rekommenderar hybrid-strategi: submit-prompt för realtid + activity för historik.';
    } else if (actSuccess) {
      report.recommendation = 'activity';
      report.summary = '✅ /api/v1/activity fungerar bra för aggregerad historik. /api/v1/generation kräver generation_id per anrop.';
    } else if (genSuccess) {
      report.recommendation = 'generation';
      report.summary = '⚠️ /api/v1/generation fungerar men kräver generation_id. Rekommenderar fokusera på submit-prompt för realtidsloggning.';
    } else {
      report.recommendation = 'neither';
      report.summary = '❌ Inga endpoints returnerade data. Använd submit-prompt för realtidsloggning istället.';
    }

    console.log('Test report:', JSON.stringify(report, null, 2));

    return new Response(JSON.stringify(report), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in test-openrouter-endpoints:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        generation_endpoint: { status: 'error', error: 'Test failed' },
        activity_endpoint: { status: 'error', error: 'Test failed' },
        recommendation: 'neither',
        summary: '❌ Test kunde inte köras. Kontrollera att OpenRouter API-nyckel är konfigurerad.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function testGenerationEndpoint(apiKey: string): Promise<EndpointTestResult> {
  const startTime = Date.now();
  
  try {
    console.log('⚠️ Testing /api/v1/generation (UNDOCUMENTED) endpoint...');
    
    // This endpoint is NOT documented in OpenRouter API docs
    // It requires generation_id from actual API calls
    const url = 'https://openrouter.ai/api/v1/generation?limit=5';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Generation endpoint error:', response.status, errorText);
      
      return {
        status: 'error',
        error: `⚠️ UNDOCUMENTED: HTTP ${response.status}. Använd /chat/completions för realtid istället.`,
        requires_special_key: response.status === 403 || response.status === 401,
        response_time_ms: responseTime,
      };
    }

    const data = await response.json();
    console.log('Generation endpoint response sample:', JSON.stringify(data).substring(0, 500));

    return {
      status: 'success',
      data_sample: {
        total_records: data.data?.length || 0,
        sample_record: data.data?.[0] || null,
        has_usage_data: !!data.data?.[0]?.total_cost,
      },
      data_format: '⚠️ UNDOCUMENTED: Använd submit-prompt med /chat/completions istället',
      requires_special_key: false,
      response_time_ms: responseTime,
    };

  } catch (error) {
    console.error('Generation endpoint exception:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time_ms: Date.now() - startTime,
    };
  }
}

async function testActivityEndpoint(apiKey: string): Promise<EndpointTestResult> {
  const startTime = Date.now();
  
  try {
    console.log('✅ Testing /api/v1/activity (DOCUMENTED) endpoint...');
    
    // Test without date parameter (returns last 30 days by default)
    const response = await fetch('https://openrouter.ai/api/v1/activity', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Activity endpoint error:', response.status, errorText);
      
      return {
        status: 'error',
        error: `HTTP ${response.status}: ${errorText}. Kan kräva Provisioning Key om 401/403.`,
        requires_special_key: response.status === 403 || response.status === 401,
        response_time_ms: responseTime,
      };
    }

    const data = await response.json();
    console.log('Activity endpoint response:', JSON.stringify(data).substring(0, 500));

    // Check if data follows documented format
    const hasCorrectFormat = data.data && Array.isArray(data.data) && 
      data.data.length > 0 && 
      data.data[0].date && 
      data.data[0].model;

    return {
      status: 'success',
      data_sample: {
        total_records: data.data?.length || 0,
        sample_record: data.data?.[0] || null,
        date_range: data.data?.length > 0 
          ? `${data.data[data.data.length - 1].date} → ${data.data[0].date}`
          : 'Ingen data',
        has_aggregated_fields: hasCorrectFormat,
      },
      data_format: '✅ Aggregerad per dag: date, endpoint, model, tokens, cost, requests',
      requires_special_key: false,
      response_time_ms: responseTime,
    };

  } catch (error) {
    console.error('Activity endpoint exception:', error);
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      response_time_ms: Date.now() - startTime,
    };
  }
}
