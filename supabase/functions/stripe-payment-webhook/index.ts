import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();
  
  if (!signature) {
    console.error("[WEBHOOK] No signature provided");
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
    console.log("[WEBHOOK] Event verified:", event.type);
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("[WEBHOOK] Checkout completed:", session.id);
        
        // Here you can add logic to:
        // - Record the payment in your database
        // - Send confirmation emails
        // - Activate user access
        // - Log the purchase
        
        const userId = session.metadata?.user_id;
        const userEmail = session.metadata?.user_email;
        
        console.log("[WEBHOOK] Payment successful for user:", userEmail);
        
        // Example: You could store payment records in a payments table
        // await supabase.from('payments').insert({
        //   user_id: userId,
        //   stripe_session_id: session.id,
        //   amount: session.amount_total,
        //   currency: session.currency,
        //   status: 'completed'
        // });
        
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("[WEBHOOK] Payment intent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("[WEBHOOK] Payment failed:", paymentIntent.id);
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[WEBHOOK] Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
