import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface AIRequestOptions {
  userId: string;
  messages: Array<{ role: string; content: string }>;
  useCase?: 'chat' | 'enrichment' | 'analysis' | 'classification';
  temperature?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  provider: 'lovable' | 'openrouter';
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Universal AI gateway - använder användarens val av provider & modell
 */
export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Hämta användarens AI-inställningar
  const { data: settings, error: settingsError } = await supabase
    .from('user_ai_settings')
    .select('*')
    .eq('user_id', options.userId)
    .single();

  const provider = settings?.ai_provider || 'lovable';
  const useFallback = settings?.use_system_fallback ?? true;

  // Välj rätt modell baserat på use case
  let model = settings?.default_model || 'google/gemini-2.5-flash';
  if (options.useCase === 'chat' && settings?.chat_model) {
    model = settings.chat_model;
  } else if (options.useCase === 'enrichment' && settings?.enrichment_model) {
    model = settings.enrichment_model;
  } else if (options.useCase === 'analysis' && settings?.analysis_model) {
    model = settings.analysis_model;
  } else if (options.useCase === 'classification' && settings?.classification_model) {
    model = settings.classification_model;
  }

  console.log(`AI Request - Provider: ${provider}, Model: ${model}, Use Case: ${options.useCase}`);

  // === Försök med användarens valda provider ===
  try {
    if (provider === 'openrouter' && settings?.openrouter_api_key_encrypted) {
      // Dekryptera användarens OpenRouter-nyckel
      const { data: decryptedKey } = await supabase.rpc('decrypt_text', {
        encrypted_data: settings.openrouter_api_key_encrypted,
        key: Deno.env.get('ENCRYPTION_KEY') ?? ''
      });

      if (!decryptedKey) throw new Error('Failed to decrypt API key');

      // Anropa OpenRouter
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${decryptedKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': Deno.env.get('SUPABASE_URL') ?? '',
          'X-Title': 'Hiems AI',
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          stream: false, // Ensure we get usage data
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter error: ${response.status} - ${errorText}`);
        throw new Error(`OpenRouter error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`OpenRouter success - Model used: ${data.model || model}`);
      
      // Log usage to database
      const usage = data.usage;
      if (usage) {
        const USD_TO_SEK = 10.5;
        const costUsd = (usage.prompt_tokens * 0.000001 + usage.completion_tokens * 0.000002); // Rough estimate
        await supabase.from('ai_usage_logs').insert({
          user_id: options.userId,
          generation_id: data.id,
          model: data.model || model,
          provider: 'openrouter',
          use_case: options.useCase,
          prompt_tokens: usage.prompt_tokens,
          completion_tokens: usage.completion_tokens,
          total_tokens: usage.total_tokens,
          cost_usd: costUsd,
          cost_sek: costUsd * USD_TO_SEK,
          status: 'success',
        });
      }
      
      return {
        content: data.choices?.[0]?.message?.content || '',
        model: data.model || model,
        provider: 'openrouter',
        usage,
      };
    }
  } catch (error) {
    console.error('OpenRouter call failed:', error);
    
    // Om användaren inte vill ha fallback, kasta error
    if (!useFallback) {
      throw error;
    }
    
    console.log('Falling back to Lovable AI...');
  }

  // === Fallback eller primär: Lovable AI ===
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured and no OpenRouter key available');
  }

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash', // Lovable AI default
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Lovable AI error: ${response.status} - ${errorText}`);
    
    if (response.status === 429) {
      throw new Error('Rate limits exceeded, please try again later.');
    }
    if (response.status === 402) {
      throw new Error('Payment required, please add funds to your Lovable AI workspace.');
    }
    
    throw new Error(`Lovable AI error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Lovable AI success');
  
  // Log Lovable AI usage
  const usage = data.usage;
  if (usage) {
    const USD_TO_SEK = 10.5;
    const costUsd = (usage.prompt_tokens * 0.0000005 + usage.completion_tokens * 0.000001); // Lovable AI pricing
    await supabase.from('ai_usage_logs').insert({
      user_id: options.userId,
      generation_id: data.id,
      model: 'google/gemini-2.5-flash',
      provider: 'lovable',
      use_case: options.useCase,
      prompt_tokens: usage.prompt_tokens,
      completion_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      cost_usd: costUsd,
      cost_sek: costUsd * USD_TO_SEK,
      status: 'success',
    });
  }
  
  return {
    content: data.choices?.[0]?.message?.content || '',
    model: 'google/gemini-2.5-flash',
    provider: 'lovable',
    usage,
  };
}
