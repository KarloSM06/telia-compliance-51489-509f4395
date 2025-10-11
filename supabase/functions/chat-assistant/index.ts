import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Du är Hiems AI-assistent som hjälper företag hitta rätt AI-lösning.

Vi erbjuder 6 färdiga paket:

1. RESTAURANGPAKETET - För restauranger och caféer
   - Automatisk hantering av bokningar och beställningar
   - Optimering av kök och serviceflöden
   - Intelligent kundfeedback-hantering
   - Passar perfekt för: restauranger, caféer, pizzerior, barer

2. RECEPTIONISTPAKETET - Virtuell AI-receptionist
   - 24/7 hantering av samtal, SMS och mejl
   - Automatiska bokningar och vidarekoppling
   - Snabb och professionell service
   - Passar perfekt för: hotell, vårdcentraler, tandläkare, kontor

3. REKRYTERINGSPAKETET - Effektivisera rekrytering
   - Automatisk screening av ansökningar
   - Rankning och matchning av kandidater
   - Snabbare rekrytering av rätt talanger
   - Passar perfekt för: HR-avdelningar, rekryteringsföretag, växande företag

4. PROSPEKTPAKETET - Öka er försäljningspipeline
   - Automatisk identifiering av prospekt
   - Kvalificering och skapande av leads
   - Maximera affärsmöjligheter
   - Passar perfekt för: säljteam, B2B-företag, konsultbolag

5. KVALITETS- OCH FEEDBACKPAKETET - Analysera säljsamtal
   - Automatisk kvalitetsgranskning av samtal
   - Feedback och förbättringsmöjligheter
   - Coaching av medarbetare
   - Passar perfekt för: kundtjänst, säljteam, callcenter

6. HEMSIDEOPTIMERINGSPAKETET - Optimera produktvisning
   - AI-driven produktrekommendation
   - Analysera användarbeteende
   - Högre konvertering och försäljning
   - Passar perfekt för: e-handel, webbutiker, SaaS-företag

Din uppgift är att:
- Vara vänlig, professionell och koncis (korta svar!)
- Ställa 1-2 relevanta frågor för att förstå kundens bransch och behov
- Rekommendera rätt paket baserat på deras svar (kan vara flera paket)
- Förklara varför just detta paket passar deras behov
- Uppmuntra kunden att boka en demo på /demo
- Om de frågar om pris: "Våra paket är skräddarsydda efter era behov och levereras på max 2 veckor. Boka en kostnadsfri konsultation så tar vi fram ett exakt pris för er lösning!"
- Håll svaren KORTA (max 3-4 meningar per meddelande)
- Använd emojis sporadiskt för att göra konversationen trevligare

Kom ihåg: Du representerar ett premium AI-företag. Var professionell men personlig!`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "För många förfrågningar, vänligen försök igen om en stund." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Tjänsten är inte tillgänglig just nu. Vänligen kontakta oss direkt." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Ett fel uppstod vid kommunikation med AI:n" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Ett okänt fel uppstod" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
