# Stripe Live Checkout Setup Guide

## Översikt
Detta är ett komplett live Stripe Checkout-system för dina produkter. Systemet använder **riktiga live-nycklar** och validerar alla betalningar på serversidan.

## Produkter
Följande produkter är konfigurerade:

1. **AI Receptionist** - 2999 kr/månad
2. **Restaurang & Café** - 1999 kr/månad
3. **AI Rekrytering** - 3999 kr/månad
4. **AI Prospektering** - 4999 kr/månad
5. **AI Compliance & Coaching** - 5999 kr/månad (Populär)
6. **AI Hemsideoptimering** - 2499 kr/månad

## Steg 1: Konfigurera Stripe Produkter och Priser

### 1.1 Logga in på Stripe Dashboard (Live Mode)
- Gå till https://dashboard.stripe.com
- **Säkerställ att du är i LIVE MODE** (toggle uppe till höger)

### 1.2 Skapa Produkter och Priser
För varje produkt:

1. Gå till **Products** → **Add Product**
2. Fyll i:
   - **Name**: (t.ex. "AI Receptionist")
   - **Description**: Produktbeskrivning
   - **Pricing model**: Recurring eller One-time (beroende på om det är subscription eller engångsbetalning)
   - **Price**: Pris i SEK (t.ex. 2999)
   - **Billing period**: Monthly (om recurring)

3. Klicka **Save Product**
4. Kopiera **Price ID** (börjar med `price_xxx`)

### 1.3 Uppdatera Price IDs i Koden

Öppna `src/components/dashboard/PackagesData.tsx` och ersätt alla `price_REPLACE_WITH_YOUR_PRICE_ID_X` med dina riktiga Stripe Price IDs:

```typescript
stripePriceId: "price_1ABC123xyz...", // Ersätt med ditt price ID
```

Uppdatera även `supabase/functions/create-payment-session/index.ts`:

```typescript
const ALLOWED_PRICE_IDS = [
  "price_1ABC123xyz...", // AI Receptionist
  "price_2DEF456xyz...", // Restaurang & Café
  // ... osv
];
```

## Steg 2: Konfigurera Webhook

### 2.1 Skapa Webhook Endpoint
1. I Stripe Dashboard, gå till **Developers** → **Webhooks**
2. Klicka **Add endpoint**
3. Ange URL:
   ```
   https://shskknkivuewuqonjdjc.supabase.co/functions/v1/stripe-payment-webhook
   ```
4. Välj events att lyssna på:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

5. Klicka **Add endpoint**
6. Kopiera **Signing secret** (börjar med `whsec_xxx`)

### 2.2 Lägg till Webhook Secret
Webhook secret finns redan som `STRIPE_WEBHOOK_SECRET` i Supabase secrets.

## Steg 3: Verifiera Secrets

Följande secrets ska finnas i Supabase:
- ✅ `STRIPE_SECRET_KEY` - Din live secret key (redan konfigurerad)
- ✅ `STRIPE_WEBHOOK_SECRET` - Webhook signing secret från Stripe

Om du behöver uppdatera webhook secret:
1. Gå till Supabase Dashboard → Project Settings → Edge Functions → Secrets
2. Uppdatera `STRIPE_WEBHOOK_SECRET`

## Steg 4: Testa Systemet

### 4.1 Test i Produktionsmiljö
1. Logga in på din webbplats
2. Gå till **Produkter & Paket** sidan
3. Klicka **Köp nu** på en produkt
4. Fyll i riktiga kortuppgifter för test:
   - Kortnummer: Se Stripe test cards (för live mode använd riktiga kort)
   - Datum: Framtida datum
   - CVC: Valfri 3-siffrig kod

### 4.2 Verifiera Betalning
1. Kontrollera Stripe Dashboard → **Payments**
2. Kontrollera Edge Function logs i Supabase
3. Verifiera att webhook mottas korrekt

## Steg 5: Säkerhet

### 5.1 API Key Permissions (Restricted Key Rekommenderas)
Din Stripe Secret Key bör ha **minimal åtkomst**:

**Tillåtna permissions:**
- ✅ Checkout Sessions → Write
- ✅ Products → Read
- ✅ Prices → Read
- ✅ Payment Intents → Read
- ✅ Webhooks / Events → Read
- ✅ Customers → Write (för att skapa/hantera kunder)

**Blockerade permissions:**
- ❌ Alla andra resurser → Ingen åtkomst

### 5.2 Skapa Restricted Key (Rekommenderat)
1. Gå till **Developers** → **API Keys**
2. Klicka **Create restricted key**
3. Namnge den: "Lovable Production Key"
4. Sätt permissions enligt ovan
5. Spara och använd denna key istället

## Steg 6: Hantera Betalningar

### 6.1 Visa Betalningar
Alla betalningar visas i Stripe Dashboard under **Payments**.

### 6.2 Återbetalningar
1. Gå till **Payments** i Stripe Dashboard
2. Klicka på betalningen
3. Klicka **Refund**

### 6.3 Dispyter
Hanteras automatiskt via Stripe Dashboard under **Disputes**.

## Steg 7: Lägg till Nya Produkter

För att lägga till nya produkter:

1. Skapa produkt + pris i Stripe Dashboard
2. Kopiera Price ID
3. Lägg till i `PackagesData.tsx`:
```typescript
{
  id: "ny-produkt",
  name: "Ny Produkt",
  description: "Beskrivning",
  stripePriceId: "price_NYA123xyz",
  price: 1999,
  // ... resten av fälten
}
```
4. Lägg till price ID i `ALLOWED_PRICE_IDS` i `create-payment-session/index.ts`

## Miljövariabler

Alla secrets hanteras i Supabase Edge Functions secrets:

- `STRIPE_SECRET_KEY` - Live secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret
- `SUPABASE_URL` - Supabase projekt URL
- `SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (för webhook)

## Support och Felsökning

### Kontrollera Logs
- **Edge Functions logs**: Supabase Dashboard → Edge Functions → Välj funktion → Logs
- **Stripe logs**: Stripe Dashboard → Developers → Logs

### Vanliga Problem

**"Invalid price ID"**
- Kontrollera att price ID finns i `ALLOWED_PRICE_IDS`
- Verifiera att priset existerar i Stripe Dashboard

**"Webhook signature verification failed"**
- Kontrollera att `STRIPE_WEBHOOK_SECRET` är korrekt
- Verifiera att webhook URL är rätt konfigurerad

**"User not authenticated"**
- Användaren måste vara inloggad för att köpa
- Kontrollera Supabase auth session

## Deployment

Edge functions deployas automatiskt när du gör ändringar i `supabase/functions/` mappen. Inga manuella steg krävs!

## Säkerhetsrekommendationer

1. ✅ Använd restricted API key med minimal åtkomst
2. ✅ Validera alla price IDs på server-sidan
3. ✅ Verifiera webhook signaturer
4. ✅ Logga alla transaktioner
5. ✅ Använd HTTPS för alla requests
6. ✅ Håll secrets säkra i Supabase
7. ✅ Aktivera Stripe Radar för fraud protection

## Kontakt

Om du behöver hjälp:
- Stripe Support: https://support.stripe.com
- Supabase Support: https://supabase.com/support
- Edge Function Logs: Se Supabase Dashboard
