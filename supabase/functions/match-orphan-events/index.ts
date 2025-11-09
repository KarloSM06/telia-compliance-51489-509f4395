// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to aggregate costs and link events
async function aggregateCosts(
  supabase: any,
  parentEventId: string,
  childEvent: any
): Promise<void> {
  const { data: parentEvent } = await supabase
    .from('telephony_events')
    .select('*')
    .eq('id', parentEventId)
    .single();
  
  if (!parentEvent) return;
  
  const currentCostBreakdown = parentEvent.cost_breakdown || {};
  const currentRelatedEvents = parentEvent.related_events || [];
  
  // Add child provider to cost breakdown
  const newCostBreakdown = {
    ...currentCostBreakdown,
    [childEvent.provider]: {
      amount: childEvent.cost_amount || 0,
      currency: childEvent.cost_currency || 'USD',
      layer: childEvent.provider_layer || 'telephony'
    }
  };
  
  // Calculate total cost from breakdown
  const totalCost = Object.values(newCostBreakdown).reduce(
    (sum: number, item: any) => sum + (Number(item.amount) || 0), 
    0
  );
  
  // Update parent event
  await supabase
    .from('telephony_events')
    .update({
      aggregate_cost_amount: totalCost,
      cost_breakdown: newCostBreakdown,
      related_events: [...currentRelatedEvents, childEvent.id]
    })
    .eq('id', parentEventId);
  
  console.log(`✅ Linked orphan: Parent ${parentEventId} now has total ${totalCost}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔍 Starting orphan event matching...');

    // Find all standalone events from the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: orphanEvents } = await supabase
      .from('telephony_events')
      .select('*')
      .eq('provider_layer', 'standalone')
      .is('parent_event_id', null)
      .gte('event_timestamp', oneDayAgo)
      .order('event_timestamp', { ascending: false });

    if (!orphanEvents || orphanEvents.length === 0) {
      console.log('✅ No orphan events found');
      return new Response(JSON.stringify({ 
        success: true, 
        matched: 0,
        message: 'No orphan events to match'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`📊 Found ${orphanEvents.length} orphan events to process`);

    let matchedCount = 0;
    const timeWindow = 30000; // 30 seconds

    for (const orphan of orphanEvents) {
      // PRIORITY 1: Try X-Call-Sid matching first
      if (orphan.x_call_sid) {
        console.log(`🔍 Checking X-Call-Sid for orphan: ${orphan.x_call_sid}`);
        
        const { data: xCallSidMatch } = await supabase
          .from('telephony_events')
          .select('*')
          .eq('user_id', orphan.user_id)
          .neq('provider', orphan.provider)
          .in('provider', ['vapi', 'retell'])
          .is('parent_event_id', null)
          .eq('x_call_sid', orphan.x_call_sid)
          .limit(1)
          .maybeSingle();
        
        if (xCallSidMatch) {
          console.log(`✅ Found X-Call-Sid match: ${xCallSidMatch.id}`);
          
          // Link orphan to parent and aggregate costs
          await supabase
            .from('telephony_events')
            .update({
              parent_event_id: xCallSidMatch.id,
              provider_layer: 'telephony'
            })
            .eq('id', orphan.id);
          
          await aggregateCosts(supabase, xCallSidMatch.id, orphan);
          matchedCount++;
          continue;
        }
        
        console.log(`⚠️ No X-Call-Sid match found for orphan, trying phone + time window`);
      }
      
      // PRIORITY 2: Fallback to phone number + time window matching
      // Skip if no phone numbers
      if (!orphan.from_number && !orphan.to_number) continue;

      const eventTime = new Date(orphan.event_timestamp);
      const startTime = new Date(eventTime.getTime() - timeWindow);
      const endTime = new Date(eventTime.getTime() + timeWindow);

      // Build phone number filter
      let phoneFilter = '';
      if (orphan.from_number && orphan.to_number) {
        phoneFilter = `from_number.eq.${orphan.from_number},to_number.eq.${orphan.from_number},from_number.eq.${orphan.to_number},to_number.eq.${orphan.to_number}`;
      } else if (orphan.from_number) {
        phoneFilter = `from_number.eq.${orphan.from_number},to_number.eq.${orphan.from_number}`;
      } else if (orphan.to_number) {
        phoneFilter = `from_number.eq.${orphan.to_number},to_number.eq.${orphan.to_number}`;
      }

      if (!phoneFilter) continue;

      // Try to find matching agent event (Vapi/Retell)
      const { data: matchingEvent } = await supabase
        .from('telephony_events')
        .select('*')
        .eq('user_id', orphan.user_id)
        .neq('provider', orphan.provider)
        .in('provider', ['vapi', 'retell'])
        .in('provider_layer', ['agent', 'standalone'])
        .is('parent_event_id', null)
        .or(phoneFilter)
        .gte('event_timestamp', startTime.toISOString())
        .lte('event_timestamp', endTime.toISOString())
        .order('event_timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (matchingEvent) {
        console.log(`🔗 Matching orphan ${orphan.provider} event ${orphan.id} with ${matchingEvent.provider} event ${matchingEvent.id}`);

        // Determine which should be parent (agent layer takes priority)
        let parentId, childEvent;
        
        if (['vapi', 'retell'].includes(matchingEvent.provider)) {
          // Agent event is parent
          parentId = matchingEvent.id;
          childEvent = orphan;
          
          // Update orphan to point to agent as parent
          await supabase
            .from('telephony_events')
            .update({
              parent_event_id: parentId,
              provider_layer: 'telephony'
            })
            .eq('id', orphan.id);

          // Update agent event's provider_layer if it was standalone
          if (matchingEvent.provider_layer === 'standalone') {
            await supabase
              .from('telephony_events')
              .update({ provider_layer: 'agent' })
              .eq('id', matchingEvent.id);
          }
        } else {
          // Current orphan should become parent
          parentId = orphan.id;
          childEvent = matchingEvent;
          
          // Update matching event to point to orphan as parent
          await supabase
            .from('telephony_events')
            .update({
              parent_event_id: parentId,
              provider_layer: matchingEvent.provider_layer === 'standalone' ? 'telephony' : matchingEvent.provider_layer
            })
            .eq('id', matchingEvent.id);

          // Update orphan's provider_layer
          await supabase
            .from('telephony_events')
            .update({ provider_layer: 'agent' })
            .eq('id', orphan.id);
        }

        // Aggregate costs
        await aggregateCosts(supabase, parentId, childEvent);
        matchedCount++;
      }
    }

    console.log(`✅ Matched ${matchedCount} orphan events`);

    return new Response(JSON.stringify({ 
      success: true, 
      processed: orphanEvents.length,
      matched: matchedCount 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error matching orphan events:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
