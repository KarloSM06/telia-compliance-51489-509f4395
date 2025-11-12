// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        
        // Validate metadata
        const MetadataSchema = z.object({
          user_id: z.string().uuid("Invalid user ID format"),
          number_of_agents: z.string().regex(/^\d+$/, "Invalid number of agents")
        });

        const validatedMetadata = MetadataSchema.safeParse(session.metadata);
        if (!validatedMetadata.success) {
          console.error("Invalid session metadata:", validatedMetadata.error);
          break;
        }

        const userId = validatedMetadata.data.user_id;
        const numberOfAgents = parseInt(validatedMetadata.data.number_of_agents);

        if (numberOfAgents < 1 || numberOfAgents > 1000) {
          console.error("Invalid number of agents:", numberOfAgents);
          break;
        }

        const priceId = subscription.items.data[0].price.id;
        let planType = "standard";
        let smartAnalysis = true;
        let fullAnalysis = false;
        let leaddeskAddon = false;

        // Determine plan features based on price
        // You'll need to set these price IDs in Stripe
        if (priceId.includes("full")) {
          fullAnalysis = true;
        }
        if (priceId.includes("leaddesk")) {
          leaddeskAddon = true;
        }

        await supabase.from("subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: "active",
          plan_type: planType,
          number_of_agents: numberOfAgents,
          smart_analysis_enabled: smartAnalysis,
          full_analysis_enabled: fullAnalysis,
          leaddesk_addon: leaddeskAddon,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        });
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        
        await supabase
          .from("subscriptions")
          .update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
