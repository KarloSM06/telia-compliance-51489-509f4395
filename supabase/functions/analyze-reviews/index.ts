import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NormalizedInteraction {
  source: 'review' | 'telephony' | 'sms' | 'email';
  content: string;
  sentiment?: number;
  timestamp: string;
  metadata?: any;
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

    // Get request body
    const body = await req.json();
    const autoTriggered = body.auto_triggered || false;
    const triggerSource = body.trigger_source || 'manual';

    // Authenticate user (allow service role for auto-triggered)
    let userId: string;
    if (autoTriggered && body.user_id) {
      userId = body.user_id;
      console.log('Auto-triggered analysis for user:', userId);
    } else {
      const authHeader = req.headers.get('Authorization')!;
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      userId = user.id;
    }

    // Check if analysis is already running
    const { data: runningAnalysis } = await supabaseClient
      .from('review_insights')
      .select('id')
      .eq('user_id', userId)
      .eq('ai_model', 'analyzing')
      .maybeSingle();
      
    if (runningAnalysis) {
      return new Response(
        JSON.stringify({ message: 'Analysis already in progress' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse date range
    const startDate = body.dateRange?.from || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = body.dateRange?.to || new Date().toISOString();

    console.log(`Analyzing data for user ${userId} from ${startDate} to ${endDate}`);

    // 1. Aggregate data from all sources
    const interactions = await aggregateDataSources(supabaseClient, userId, startDate, endDate);
    
    if (interactions.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Ingen data tillgänglig för analys. Vänligen samla in mer data först.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${interactions.length} interactions to analyze`);

    // Check if we have enough data for analysis
    if (interactions.length < 3) {
      console.log('Too few interactions for meaningful analysis, saving placeholder');
      
      const { data: placeholderInsight } = await supabaseClient
        .from('review_insights')
        .insert({
          user_id: userId,
          analysis_period_start: startDate,
          analysis_period_end: endDate,
          total_reviews: interactions.filter(i => i.source === 'review').length,
          total_interactions: interactions.length,
          average_sentiment: 0,
          sentiment_trend: 'stable',
          improvement_suggestions: [{
            title: 'Samla in mer kunddata',
            description: 'Vi behöver minst 3 kundinteraktioner för att kunna generera meningsfulla AI-insikter.',
            priority: 'medium',
            impact: 'Mer data ger bättre och mer träffsäkra rekommendationer för att förbättra din kundupplevelse.',
            actionable_steps: [
              'Skicka ut en kundundersökning via SMS eller email',
              'Be om feedback direkt efter samtal',
              'Aktivera automatiska recensionsförfrågningar'
            ]
          }],
          positive_drivers: [],
          negative_drivers: [],
          topic_distribution: { categories: [] },
          ai_model: 'placeholder',
          confidence_score: 0.0,
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({ 
          success: true, 
          insights: placeholderInsight,
          message: 'För lite data för AI-analys. Samla in mer kunddata först.',
          needsMoreData: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Analyze with Lovable AI
    const insights = await analyzeWithAI(interactions);

    // 3. Calculate metrics with NaN protection
    const totalReviews = interactions.filter(i => i.source === 'review').length;
    const totalInteractions = interactions.length;
    
    const sentimentSum = interactions.reduce((sum, i) => sum + (i.sentiment || 0), 0);
    const avgSentiment = interactions.length > 0 ? sentimentSum / interactions.length : 0;
    const validAvgSentiment = isNaN(avgSentiment) ? 0 : avgSentiment;

    console.log('Calculated metrics:', {
      totalReviews,
      totalInteractions,
      avgSentiment: validAvgSentiment.toFixed(2)
    });

    // 4. Store insights in database
    const { data: storedInsight, error: insertError } = await supabaseClient
      .from('review_insights')
      .insert({
        user_id: userId,
        analysis_period_start: startDate,
        analysis_period_end: endDate,
        total_reviews: totalReviews,
        total_interactions: totalInteractions,
        average_sentiment: validAvgSentiment.toFixed(2),
        sentiment_trend: insights.sentiment_trend,
        improvement_suggestions: insights.improvement_suggestions,
        positive_drivers: insights.positive_drivers,
        negative_drivers: insights.negative_drivers,
        topic_distribution: insights.topic_distribution,
        ai_model: 'google/gemini-2.5-flash',
        confidence_score: 0.85,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing insights:', insertError);
      throw insertError;
    }

    console.log('Analysis complete, insights stored');

    return new Response(
      JSON.stringify({ 
        success: true, 
        insights: storedInsight,
        message: 'Analys genomförd och sparad'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-reviews:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function aggregateDataSources(
  supabase: any, 
  userId: string, 
  startDate: string, 
  endDate: string
): Promise<NormalizedInteraction[]> {
  const interactions: NormalizedInteraction[] = [];

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (reviews) {
    reviews.forEach((r: any) => {
      if (r.comment) {
        interactions.push({
          source: 'review',
          content: r.comment,
          sentiment: r.rating ? (r.rating - 3) / 2 : undefined, // Convert 1-5 to -1 to 1
          timestamp: r.submitted_at || r.created_at,
          metadata: { rating: r.rating, customer_name: r.customer_name }
        });
      }
    });
  }

  // Fetch telephony events (transcripts)
  const { data: telephonyEvents } = await supabase
    .from('telephony_events')
    .select('*, integrations!inner(user_id)')
    .eq('integrations.user_id', userId)
    .in('event_type', ['call.ended', 'transcript', 'analysis_complete'])
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (telephonyEvents) {
    telephonyEvents.forEach((e: any) => {
      const transcript = e.metadata?.transcript || e.metadata?.summary;
      if (transcript) {
        interactions.push({
          source: 'telephony',
          content: transcript,
          sentiment: e.metadata?.sentiment_score,
          timestamp: e.created_at,
          metadata: { call_duration: e.metadata?.call_duration }
        });
      }
    });
  }

  // Fetch message logs (SMS/Email with AI classification)
  const { data: messages } = await supabase
    .from('message_logs')
    .select('*')
    .eq('user_id', userId)
    .not('ai_classification', 'is', null)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (messages) {
    messages.forEach((m: any) => {
      // Convert text sentiment to number
      const sentimentText = m.ai_classification?.sentiment;
      let sentimentScore: number | undefined;
      
      if (sentimentText === 'positive') sentimentScore = 0.8;
      else if (sentimentText === 'neutral') sentimentScore = 0.0;
      else if (sentimentText === 'negative') sentimentScore = -0.8;
      
      interactions.push({
        source: m.channel === 'email' ? 'email' : 'sms',
        content: m.message_body,
        sentiment: sentimentScore,
        timestamp: m.created_at,
        metadata: { 
          channel: m.channel, 
          direction: m.direction,
          original_sentiment: sentimentText
        }
      });
    });
  }

  return interactions;
}

async function analyzeWithAI(interactions: NormalizedInteraction[]): Promise<any> {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  // Build analysis prompt
  const interactionsText = interactions.map(i => 
    `[${i.source.toUpperCase()}] ${i.content.substring(0, 200)}${i.content.length > 200 ? '...' : ''}`
  ).join('\n\n');

  const systemPrompt = `Du är en expert på kundupplevelse-analys för svenska företag. Din uppgift är att:

1. Identifiera konkreta förbättringsområden baserat på kunddata
2. Hitta mönster som driver kundnöjdhet eller missnöje
3. Föreslå specifika, handlingsbara åtgärder på svenska
4. Förklara varför vissa trender uppstår

Format dina svar så att även icke-tekniska användare förstår dem. Var konkret och actionable.`;

  const userPrompt = `Analysera följande ${interactions.length} kundinteraktioner och generera insikter:

KÄLLOR:
- ${interactions.filter(i => i.source === 'review').length} kalenderrecensioner
- ${interactions.filter(i => i.source === 'sms').length} SMS-meddelanden
- ${interactions.filter(i => i.source === 'email').length} Email-meddelanden  
- ${interactions.filter(i => i.source === 'telephony').length} samtalstranskript

INTERAKTIONER:
${interactionsText}

STATISTIK:
- Genomsnittlig sentiment: ${(interactions.reduce((sum, i) => sum + (i.sentiment || 0), 0) / interactions.length).toFixed(2)}
- Positiva: ${interactions.filter(i => (i.sentiment || 0) > 0.3).length}
- Neutrala: ${interactions.filter(i => Math.abs(i.sentiment || 0) <= 0.3).length}
- Negativa: ${interactions.filter(i => (i.sentiment || 0) < -0.3).length}

VIKTIGT: 
- Ge minst 3-5 konkreta förbättringsförslag
- Identifiera tydliga positiva och negativa drivers
- Gruppera interaktioner i relevanta ämnen (t.ex. "Service", "Produktkvalitet", "Leverans", etc.)
- Även med få interaktioner, ge actionable insights baserat på mönster du ser

Analysera och returnera strukturerade insikter PÅ SVENSKA.`;

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
      tools: [{
        type: 'function',
        function: {
          name: 'generate_insights',
          description: 'Generera strukturerade insikter från kunddata',
          parameters: {
            type: 'object',
            properties: {
              improvement_suggestions: {
                type: 'array',
                description: 'Konkreta förbättringsförslag',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string', description: 'Kort titel på svenska' },
                    description: { type: 'string', description: 'Detaljerad beskrivning på svenska' },
                    priority: { type: 'string', enum: ['high', 'medium', 'low'] },
                    impact: { type: 'string', description: 'Förväntad effekt på svenska' },
                    actionable_steps: { 
                      type: 'array', 
                      items: { type: 'string' },
                      description: 'Specifika steg på svenska'
                    }
                  },
                  required: ['title', 'description', 'priority', 'impact', 'actionable_steps']
                }
              },
              positive_drivers: {
                type: 'array',
                description: 'Saker som driver positiv upplevelse',
                items: {
                  type: 'object',
                  properties: {
                    topic: { type: 'string', description: 'Ämne på svenska' },
                    mentions: { type: 'integer', description: 'Antal omnämnanden' },
                    sentiment: { type: 'number', description: 'Genomsnittlig sentiment -1 till 1' },
                    examples: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['topic', 'mentions', 'sentiment']
                }
              },
              negative_drivers: {
                type: 'array',
                description: 'Saker som driver negativ upplevelse',
                items: {
                  type: 'object',
                  properties: {
                    topic: { type: 'string', description: 'Ämne på svenska' },
                    mentions: { type: 'integer', description: 'Antal omnämnanden' },
                    sentiment: { type: 'number', description: 'Genomsnittlig sentiment -1 till 1' },
                    examples: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['topic', 'mentions', 'sentiment']
                }
              },
              topic_distribution: {
                type: 'object',
                description: 'Fördelning av ämnen',
                properties: {
                  categories: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string', description: 'Kategori på svenska' },
                        count: { type: 'integer' },
                        percentage: { type: 'number' }
                      },
                      required: ['name', 'count', 'percentage']
                    }
                  }
                },
                required: ['categories']
              },
              sentiment_trend: {
                type: 'string',
                enum: ['improving', 'stable', 'declining'],
                description: 'Övergripande trend i kundupplevelse'
              }
            },
            required: [
              'improvement_suggestions', 
              'positive_drivers', 
              'negative_drivers', 
              'topic_distribution',
              'sentiment_trend'
            ]
          }
        }
      }],
      tool_choice: { type: 'function', function: { name: 'generate_insights' } }
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('AI-tjänsten är överbelastad. Försök igen om en stund.');
    }
    if (response.status === 402) {
      throw new Error('AI-krediter har tagit slut. Lägg till fler krediter i dina inställningar.');
    }
    const errorText = await response.text();
    console.error('Lovable AI error:', response.status, errorText);
    throw new Error('Fel vid AI-analys');
  }

  const aiResponse = await response.json();
  console.log('AI Response:', JSON.stringify(aiResponse, null, 2));
  
  // Extract tool call result
  const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    console.error('No tool call in response:', aiResponse);
    throw new Error('AI svarade inte med strukturerad data');
  }

  if (toolCall.function.name !== 'generate_insights') {
    console.error('Wrong function called:', toolCall.function.name);
    throw new Error('AI anropade fel funktion');
  }

  const insights = JSON.parse(toolCall.function.arguments);

  // Validate that we got data
  const validationWarnings = [];
  if (!insights.improvement_suggestions || insights.improvement_suggestions.length === 0) {
    validationWarnings.push('No improvement suggestions');
  }
  if (!insights.positive_drivers || insights.positive_drivers.length === 0) {
    validationWarnings.push('No positive drivers');
  }
  if (!insights.negative_drivers || insights.negative_drivers.length === 0) {
    validationWarnings.push('No negative drivers');
  }
  if (!insights.topic_distribution?.categories || insights.topic_distribution.categories.length === 0) {
    validationWarnings.push('No topic distribution');
  }

  if (validationWarnings.length > 0) {
    console.warn('AI returned incomplete data:', validationWarnings.join(', '));
  }

  console.log('AI analysis complete:', {
    suggestions: insights.improvement_suggestions?.length || 0,
    positive: insights.positive_drivers?.length || 0,
    negative: insights.negative_drivers?.length || 0,
    topics: insights.topic_distribution?.categories?.length || 0,
    warnings: validationWarnings.length
  });

  return insights;
}
