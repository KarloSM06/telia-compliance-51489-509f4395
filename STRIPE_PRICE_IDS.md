# Stripe Price IDs Configuration

This document maps all Stripe products and their price IDs used in the Hiems platform.

## Current Products & Prices

### Hiems Krono Pro - AI Receptionist
- **Product ID:** `prod_TECNBVa9LX2Vmx`
- **Description:** Enkel röstprofil, grundläggande rapportering, Google Kalender-integration
- **Prices:**
  - `price_1SHjyXEAFWei6whjXkkf2iN8` - 899 SEK/month
  - `price_1SHjyXEAFWei6whjlONwxZFs` - 1,999 SEK/month  
  - `price_1SHjz7EAFWei6whj4gd9Cqts` - 3,799 SEK/month
  - `price_1SHk00EAFWei6whj3tl7nqUg` - 6,999 SEK/month

### Hiems Krono Business - AI Receptionist
- **Product ID:** `prod_TECTzoETiLHMbh`
- **Description:** Flera röstprofiler, anpassat samtalsflöde, samtalsanalys och CRM-integration
- **Prices:**
  - `price_1SHk4VEAFWei6whjdfYhqL4E` - 1,499 SEK/month
  - `price_1SHk4VEAFWei6whj7QONlp0T` - 3,499 SEK/month
  - `price_1SHk4VEAFWei6whj1SKZQCzH` - 6,499 SEK/month
  - `price_1SHk4VEAFWei6whjq324ZyHQ` - 11,999 SEK/month

### Hiems Gastro Pro - Restaurang
- **Product ID:** `prod_TECWBwwRAloEJg`
- **Description:** Hanterar bokningar via telefon & SMS, enkel menyhantering, daglig rapport
- **Prices:**
  - `price_1SHk7aEAFWei6whj2YGivPJw` - 899 SEK/month
  - `price_1SHk7aEAFWei6whjIsPZrvzB` - 1,999 SEK/month
  - `price_1SHk7ZEAFWei6whjLgrbEtOZ` - 3,799 SEK/month
  - `price_1SHk7ZEAFWei6whjWDDppm9f` - 6,999 SEK/month

### Hiems Gastro Business
- **Product ID:** `prod_TECbgmQiVHCRps`
- **Description:** Integration med kassasystem, hantering av takeaway & leverans, analys av kundfeedback
- **Prices:**
  - `price_1SHkCGEAFWei6whjadEcSlVS` - 1,499 SEK/month
  - `price_1SHkCGEAFWei6whjKTfcf0or` - 3,499 SEK/month
  - `price_1SHkCGEAFWei6whjddDwrgPl` - 6,499 SEK/month
  - `price_1SHkCGEAFWei6whjAyLgW8Lg` - 11,999 SEK/month

### Hiems Rekrytering Pro
- **Product ID:** `prod_TECdzHd4j1oiEe`
- **Description:** Automatisk screening av CV & ansökningar, rankning, shortlist, rapport via mejl
- **Prices:**
  - `price_1SHkDkEAFWei6whjuljypz19` - 2,999 SEK/month

### Hiems Rekrytering Business
- **Product ID:** `prod_TECe9DYYt6T4cW`
- **Description:** Allt i Pro + Automatisk kandidat-sökning på LinkedIn, intervju-sammanfattningar
- **Prices:**
  - `price_1SHkEtEAFWei6whjJORuM53G` - 5,499 SEK/month

### Hiems Prospekt Pro
- **Product ID:** `prod_TECgUV8SBaPNbb`
- **Description:** Identifierar potentiella kunder, skapar kontaktlistor, skickar automatiska mejl
- **Prices:**
  - `price_1SHkGpEAFWei6whjyCR7OnvD` - 3,999 SEK/month

### Hiems Prospekt Business
- **Product ID:** `prod_TECgsAJUseBvZ4`
- **Description:** Allt i pro + AI skriver personliga mejl, CRM-integration, automatiska uppföljningar
- **Prices:**
  - `price_1SHkHbEAFWei6whjHWTmqLox` - 7,499 SEK/month

### Hiems Thor Pro - AI Compliance & Coaching
- **Product ID:** `prod_TECj3mcCiwh0Zh`
- **Description:** Automatisk kvalitetsgranskning av samtal
- **Prices:**
  - `price_1SHkJkEAFWei6whj3t1KRhSs` - 499 SEK/month per agent

### Hiems Thor Business - AI Compliance & Coaching
- **Product ID:** `prod_TECkF17KmCbn73`
- **Description:** Allt i Pro + AI-coach för säljteknik, rapport per säljare, dashboard & statistik
- **Prices:**
  - `price_1SHkLFEAFWei6whj68Dbb5op` - 699 SEK/month per agent

### Övertrassering
- **Product ID:** `prod_TEIIWJ2JJsgH5J`
- **Description:** Vid övertrassering av tillhandahållna minuter
- **Prices:**
  - `price_1SHphbEAFWei6whjjQcasrEF` - 3 SEK per SMS (metered)
  - `price_1SHphbEAFWei6whjSFVXLy3P` - 5 SEK per minute (metered)

## Implementation Status

✅ **FIXED** - All subscription products now use real Stripe price IDs in `create-payment-session` edge function

## Future: AI Consultation Payment (Optional)

If you want to add payment processing to the AI Consultation form:

1. **Create Product in Stripe Dashboard:**
   - Go to https://dashboard.stripe.com/products
   - Click "Add product"
   - Name: "AI Konsultation"
   - Description: "Komplett AI-kartläggning för er verksamhet. 60 min strategiskt möte."
   - Price: 9,950 SEK (one-time payment)
   - Copy the price ID (format: `price_xxxxx`)

2. **Create Edge Function:**
   - Create `supabase/functions/create-consultation-payment/index.ts`
   - Use `mode: "payment"` (not subscription)
   - Use the consultation price ID

3. **Update ConsultationModal:**
   - Add payment button after form submission
   - Call the new edge function
   - Redirect to Stripe Checkout

## Notes

- All prices are in SEK (Swedish Krona)
- Subscription prices use `mode: "subscription"`
- One-time payments use `mode: "payment"`
- The STRIPE_SECRET_KEY is already configured in Supabase secrets
- Latest Stripe API version: `2025-08-27.basil`