import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Allowed price IDs for subscriptions
const ALLOWED_PRICE_IDS = [
  // Hiems Krono Pro - AI receptionist
  "price_1SHjyXEAFWei6whjXkkf2iN8", // 899 SEK/month
  "price_1SHjyXEAFWei6whjlONwxZFs", // 1,999 SEK/month
  "price_1SHjz7EAFWei6whj4gd9Cqts", // 3,799 SEK/month
  "price_1SHk00EAFWei6whj3tl7nqUg", // 6,999 SEK/month
  // Hiems Krono Business - AI receptionist
  "price_1SHk4VEAFWei6whj7QONlp0T", // 3,499 SEK/month
  "price_1SHk4VEAFWei6whjdfYhqL4E", // 1,499 SEK/month
  "price_1SHk4VEAFWei6whj1SKZQCzH", // 6,499 SEK/month
  "price_1SHk4VEAFWei6whjq324ZyHQ", // 11,999 SEK/month
  // Hiems Gastro Pro - Restaurang
  "price_1SHk7aEAFWei6whj2YGivPJw", // 899 SEK/month
  "price_1SHk7aEAFWei6whjIsPZrvzB", // 1,999 SEK/month
  "price_1SHk7ZEAFWei6whjLgrbEtOZ", // 3,799 SEK/month
  "price_1SHk7ZEAFWei6whjWDDppm9f", // 6,999 SEK/month
  // Hiems Gastro Business
  "price_1SHkCGEAFWei6whjadEcSlVS", // 1,499 SEK/month
  "price_1SHkCGEAFWei6whjKTfcf0or", // 3,499 SEK/month
  "price_1SHkCGEAFWei6whjddDwrgPl", // 6,499 SEK/month
  "price_1SHkCGEAFWei6whjAyLgW8Lg", // 11,999 SEK/month
  // Hiems Rekrytering Pro
  "price_1SHkDkEAFWei6whjuljypz19", // 2,999 SEK/month
  // Hiems Rekrytering Business
  "price_1SHkEtEAFWei6whjJORuM53G", // 5,499 SEK/month
  // Hiems Prospekt Pro
  "price_1SHkGpEAFWei6whjyCR7OnvD", // 3,999 SEK/month
  // Hiems Prospekt Business
  "price_1SHkHbEAFWei6whjHWTmqLox", // 7,499 SEK/month
  // Hiems Thor Pro - AI Compliance & Coaching
  "price_1SHkJkEAFWei6whj3t1KRhSs", // 499 SEK/month
  // Hiems Thor Business - AI Compliance & Coaching
  "price_1SHkLFEAFWei6whj68Dbb5op", // 699 SEK/month
];

// Input validation schema
const PaymentSchema = z.object({
  priceId: z.string()
    .min(1, "Price ID is required")
    .max(100, "Price ID too long"),
  productId: z.string()
    .min(1, "Product ID is required")
    .max(100, "Product ID too long"),
  tier: z.enum(['pro', 'business', 'enterprise']).optional(),
  minutes: z.number().int().positive().optional(),
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
    console.log("[PAYMENT] ====== Starting payment session creation ======");
    
    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) {
      console.error("[PAYMENT] Missing Authorization header");
      throw new Error("Missing Authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      console.error("[PAYMENT] User not authenticated");
      throw new Error("User not authenticated");
    }

    console.log("[PAYMENT] User authenticated");

    const rawBody = await req.json();
    
    // Validate input
    const validated = PaymentSchema.parse(rawBody);
    const { priceId, productId, tier, minutes, quantity } = validated;

    console.log("[PAYMENT] ✓ Validated input:", { 
      priceId, 
      productId, 
      tier, 
      minutes, 
      quantity 
    });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { 
      apiVersion: "2025-08-27.basil" 
    });

    // Check if customer exists
    console.log("[PAYMENT] Looking up Stripe customer for:", user.email);
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("[PAYMENT] ✓ Existing customer found:", customerId);
    } else {
      console.log("[PAYMENT] ℹ No existing customer found, will create on checkout");
    }

    const origin = req.headers.get("origin") || "https://shskknkivuewuqonjdjc.supabase.co";
    console.log("[PAYMENT] Origin:", origin);

    console.log("[PAYMENT] Creating Stripe checkout session with:", {
      customer: customerId,
      priceId,
      quantity,
      metadata: {
        user_id: user.id,
        user_email: user.email,
        product_id: productId,
        tier: tier || '',
        minutes: minutes?.toString() || '',
      }
    });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity }],
      mode: "subscription",
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/dashboard/packages?payment=canceled`,
      metadata: {
        user_id: user.id,
        user_email: user.email,
        product_id: productId,
        tier: tier || '',
        minutes: minutes?.toString() || '',
      },
    });

    console.log("[PAYMENT] ✓ Checkout session created successfully");
    console.log("[PAYMENT] Session ID:", session.id);
    console.log("[PAYMENT] Session URL:", session.url);
    console.log("[PAYMENT] ====== Payment session creation complete ======");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[PAYMENT] ====== ERROR ======");
    console.error("[PAYMENT] Error type:", error.constructor.name);
    console.error("[PAYMENT] Error message:", error.message);
    console.error("[PAYMENT] Full error:", error);
    console.error("[PAYMENT] ===================");
    
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
