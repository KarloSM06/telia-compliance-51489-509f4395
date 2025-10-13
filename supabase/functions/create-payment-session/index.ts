import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Allowed price IDs - Update these with your actual Stripe price IDs
const ALLOWED_PRICE_IDS = [
  "price_REPLACE_WITH_YOUR_PRICE_ID_1",
  "price_REPLACE_WITH_YOUR_PRICE_ID_2", 
  "price_REPLACE_WITH_YOUR_PRICE_ID_3",
  "price_REPLACE_WITH_YOUR_PRICE_ID_4",
  "price_REPLACE_WITH_YOUR_PRICE_ID_5",
  "price_REPLACE_WITH_YOUR_PRICE_ID_6",
];

// Input validation schema
const PaymentSchema = z.object({
  priceId: z.string()
    .min(1, "Price ID is required")
    .max(100, "Price ID too long")
    .refine(
      (id) => ALLOWED_PRICE_IDS.includes(id),
      "Invalid or unauthorized price ID"
    ),
  quantity: z.number()
    .int("Quantity must be an integer")
    .min(1, "Must order at least 1")
    .max(100, "Maximum 100 allowed")
    .optional()
    .default(1),
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("[PAYMENT] Starting payment session creation");
    
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      console.error("[PAYMENT] User not authenticated");
      throw new Error("User not authenticated");
    }

    console.log("[PAYMENT] User authenticated:", user.email);

    const rawBody = await req.json();
    
    // Validate input
    const validated = PaymentSchema.parse(rawBody);
    const { priceId, quantity } = validated;

    console.log("[PAYMENT] Validated input:", { priceId, quantity });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2025-08-27.basil" 
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("[PAYMENT] Existing customer found:", customerId);
    } else {
      console.log("[PAYMENT] No existing customer found");
    }

    const origin = req.headers.get("origin") || "https://shskknkivuewuqonjdjc.supabase.co";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity }],
      mode: "payment",
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/dashboard-packages?payment=canceled`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
      },
    });

    console.log("[PAYMENT] Checkout session created:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[PAYMENT] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
