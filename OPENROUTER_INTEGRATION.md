# OpenRouter Integration - Complete Guide

# OpenRouter Integration Guide

## 🎯 VAR KONFIGURERAR JAG OPENROUTER?

**Endast på ETT ställe:** `Dashboard → Integrationer → AI-tab`

❌ **INTE** under Inställningar (AI-tab har tagits bort för att undvika duplicates)  
✅ **JA** under Integrationer → AI & Modeller

Här kan du:
- Lägga in API Key (sk-or-...)
- Lägga in Provisioning Key (pk-or-...) (valfritt)
- Välja standardmodell och specialiserade modeller
- Aktivera fallback till Lovable AI
- Se din usage i realtid
- Synka historisk data från OpenRouter

---

## Overview
Komplett OpenRouter-integration med realtids-tracking, kontoinformation, modellista och historisk analys.

---

## 🔑 Två typer av nycklar

### API Key (Obligatorisk)
**Syfte:** Göra AI-anrop i hemsidans funktioner

**Används av:**
- Chat assistant
- Lead enrichment  
- Review analysis
- SMS classification
- Message generation
- Alla andra AI-funktioner som anropar AI

**Endpoints som används:**
- `/api/v1/chat/completions` - Gör AI-anrop
- `/api/v1/credits` - Hämta credit balance
- `/api/v1/auth/key` - Hämta key info & rate limits
- `/api/v1/models` - Lista tillgängliga modeller

**Loggning:** Varje anrop loggas automatiskt till `ai_usage_logs` tabellen med realtidsdata.

---

### Provisioning Key (Valfri)
**Syfte:** Hämta aggregerad användningshistorik från OpenRouter

**Används av:**
- Activity History dashboard
- Historical cost analysis
- Usage trends över längre tid

**Endpoints som används:**
- `/api/v1/activity` - Aggregerad historik per dag/modell

**Synkronisering:** Kan synkas manuellt till `ai_usage_logs` via knappen "Synka från OpenRouter" i Activity History-sektionen.

---

## 🔄 Hur det fungerar

### 1. Du gör ett AI-anrop (t.ex. i chat)
   → Edge function anropar OpenRouter eller Lovable AI (via `ai-gateway.ts`)
   → OpenRouter API används om konfigurerad (använder din API Key)
   → Resultat + usage loggas direkt till `ai_usage_logs`
   → Dashboard visar realtidsdata från `ai_usage_logs`
   
### 2. Du vill se din usage
   → Frontend hämtar data från `ai_usage_logs` (realtidsdata från varje AI-anrop)
   → Om du har Provisioning Key: Kan också hämta från `/activity` endpoint
   → Kan synka historisk data från OpenRouter till `ai_usage_logs` med knappen
   
### 3. Du vill se credits
   → Frontend anropar `get-openrouter-credits` (använder API Key)
   → Visar återstående credit balance
   → Uppdateras varje minut automatiskt

---

## Features

### 1. Real-time Usage Tracking
- Automatisk loggning via alla edge functions som använder AI
- Tokens, kostnader, modeller
- Live dashboard-uppdateringar
- Varje AI-anrop sparas i `ai_usage_logs`

### 2. Account Monitoring (API Key)
- Credit balance
- Usage statistics
- Rate limits
- Uppdateras kontinuerligt

### 3. Model Discovery (API Key)
- Alla tillgängliga modeller från OpenRouter
- Pricing per modell
- Model capabilities

### 4. Historical Analytics (Provisioning Key)
- Daglig användning från OpenRouter
- Cost breakdown
- Trend analysis
- Manuell synkronisering till `ai_usage_logs`

---

## Setup

### API Key (Obligatorisk)
1. Hämta från [openrouter.ai/keys](https://openrouter.ai/keys)
2. Navigera till Integrations → AI → OpenRouter
3. Klicka "Konfigurera"
4. Ange API key och välj standardmodell
5. Testa anslutningen
6. Spara

### Provisioning Key (Valfritt)
1. Hämta från [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)
2. Ange i samma modal under "Provisioning Key"
3. Spara
4. Låser upp historisk data från OpenRouter Activity endpoint

---

## API Endpoints

### OpenRouter API
- `/api/v1/chat/completions` - Main AI inference (API Key)
- `/api/v1/credits` - Credit balance (API Key)
- `/api/v1/auth/key` - API key info & rate limits (API Key)
- `/api/v1/models` - Available models (API Key)
- `/api/v1/activity` - Historical data (Provisioning Key)

---

## Dashboard Components

### Connection Status
- Visa anslutningsstatus för både API Key och Provisioning Key
- Realtime indicator när AI används
- Provider info (OpenRouter/Lovable AI)

### Tracking Status (nytt!)
- **Realtids AI-tracking**: Varje AI-anrop loggas direkt ✅
- **Historik-tracking**: Från OpenRouter Activity endpoint (kräver Provisioning Key)
- **Credit Monitoring**: Uppdateras varje minut

### Account Overview
- Credits remaining
- Monthly usage
- Rate limits

### Usage Metrics
- Total cost (denna månad)
- Tokens used
- AI calls count
- Average cost per call

### Charts
- Cost per model (Pie chart)
- Cost per use case (Pie chart)
- Daily cost trend (Area chart)

### Available Models
- Lista över alla OpenRouter-modeller
- Pricing information

### Activity History (med Provisioning Key)
- Daglig breakdown med bar chart
- Detaljerad tabell per datum/modell
- **Synka från OpenRouter**: Knapp för att hämta historisk data och spara i `ai_usage_logs`

### Model Statistics
- Detaljerad tabell sorterad på kostnad
- Calls, tokens, cost per modell

---

## Edge Functions

### AI Gateway
- `_shared/ai-gateway.ts` - Universal AI gateway (används av alla edge functions)
- Väljer automatiskt mellan OpenRouter och Lovable AI
- Loggar all användning till `ai_usage_logs`

### OpenRouter-specifika
- `encrypt-provisioning-key` - Krypterar provisioning key
- `get-openrouter-credits` - Hämtar credit balance
- `get-openrouter-key-info` - Hämtar API key info
- `get-openrouter-models` - Listar modeller
- `get-openrouter-activity` - Hämtar historik (Provisioning Key)
- `sync-openrouter-activity` - Synkar historisk data till `ai_usage_logs` (Provisioning Key)

### AI-anrop som använder OpenRouter
- `submit-prompt` - Generisk AI-anrop (använder ai-gateway)
- `analyze-reviews` - Review-analys
- `chat-assistant` - Chat-funktionalitet
- `classify-sms` - SMS-klassificering
- `generate-message` - Meddelandegenerering
- Alla andra som anropar AI använder `ai-gateway.ts` för konsistens

---

## React Hooks

- `useOpenRouterCredits()` - Credits (uppdateras varje minut)
- `useOpenRouterKeyInfo()` - Key info (cache 5 min)
- `useOpenRouterModels()` - Modeller (cache 1 timme)
- `useOpenRouterActivity(dateRange, enabled)` - Historik (cache 1 min)

---

## Database

### user_ai_settings
- `openrouter_api_key_encrypted` - Krypterad API key
- `openrouter_provisioning_key_encrypted` - Krypterad provisioning key
- `ai_provider` - 'openrouter' eller 'lovable'
- `default_model` - Vald standardmodell
- `use_system_fallback` - Fallback till Lovable AI vid fel

### ai_usage_logs
Lagrar all realtids-data från AI-anrop:
- `user_id` - Användare
- `model` - Använd modell
- `provider` - 'openrouter' eller 'lovable'
- `use_case` - Typ av anrop (chat, analysis, etc.)
- `prompt_tokens` - Antal prompt tokens
- `completion_tokens` - Antal completion tokens
- `total_tokens` - Totalt antal tokens
- `cost_usd` - Kostnad i USD
- `cost_sek` - Kostnad i SEK
- `generation_id` - OpenRouter generation ID
- `status` - 'success' eller 'error'
- `created_at` - Timestamp

**Källa för data:**
- Realtidsdata: Varje AI-anrop via edge functions
- Historisk data: Manuellt synkad från OpenRouter Activity (via sync-knapp)

---

## Workflow

1. **Användare konfigurerar API Key** → Kan göra AI-anrop
2. **Användare gör AI-anrop** → Data sparas i `ai_usage_logs` automatiskt
3. **Dashboard visar realtidsdata** → Från `ai_usage_logs`
4. **Användare lägger till Provisioning Key (valfritt)** → Kan se Activity History
5. **Användare klickar "Synka från OpenRouter"** → Historisk data från OpenRouter sparas i `ai_usage_logs`
6. **Dashboard visar kombinerad data** → Både realtid och historik

---

## Viktiga skillnader

### Realtids-tracking (API Key)
- Loggas vid varje AI-anrop
- Automatisk
- Ingen manuell synkronisering behövs
- Data finns direkt i `ai_usage_logs`

### Historik-tracking (Provisioning Key)
- Aggregerad data från OpenRouter
- Manuell synkronisering via knapp
- Kan hämta äldre data som inte fanns i realtidsloggen
- Sparas också i `ai_usage_logs` efter synkning

---

## Felsökning

### "API Key fungerar inte"
- Kontrollera att nyckeln är korrekt från openrouter.ai/keys
- Testa anslutningen med Test-knappen
- Kolla edge function logs i Supabase

### "Provisioning Key fungerar inte"
- Kontrollera att du har rätt nyckel från openrouter.ai/settings/keys
- Detta är en separat nyckel från API Key
- Krävs endast för historisk data

### "Ingen data syns i dashboard"
- Kontrollera att du har gjort AI-anrop
- Kolla `ai_usage_logs` i databasen
- Kontrollera att OpenRouter är konfigurerad som provider

### "Sync-knappen fungerar inte"
- Krävs Provisioning Key
- Kolla console logs för fel
- Verifiera att datum-range är korrekt

---

## OpenRouter och ROI-beräkningar

### Hur OpenRouter-kostnader spåras

1. **Automatisk synkronisering:**
   - Varje AI-anrop via edge functions loggas direkt i `ai_usage_logs`
   - Data inkluderar: model, tokens, cost (USD + SEK), provider, use_case
   - OpenRouter-provider märks med `provider = 'openrouter'`

2. **ROI-inkludering:**
   - `calculateOperationalCosts()` i `lib/roiCalculations.ts` summerar alla AI-kostnader från `ai_usage_logs`
   - OpenRouter-kostnader ingår automatiskt i:
     - Total driftkostnad (`totalOperatingCost`)
     - ROI-beräkningar
     - Break-even analys
     - 12/24/36-månaders projektioner
   - Kostnader prorateras baserat på vald tidsperiod

3. **Visualisering:**
   - **Analytics Dashboard** (`/dashboard/analytics`):
     - "AI & Modeller (OpenRouter)" visas i kostnadsfördelning
     - Top 3 modeller breakdown under AI-kostnader
     - Länk till OpenRouter Dashboard för detaljer
     - Pie chart med procentuell fördelning
     - OpenRouter-specifik sektion med top 5 modeller
   - **OpenRouter Dashboard** (`/dashboard/openrouter`):
     - Detaljerad vy av alla AI-kostnader
     - Model-by-model breakdown
     - Historisk data och trender
   - **ROI Settings** (`/dashboard/settings?tab=roi`):
     - Information om automatisk kostnadsspårning
     - Bekräftelse att OpenRouter ingår i ROI
     - Länk till OpenRouter Dashboard

### Manuell synkronisering (Provisioning Key)

Om du har en Provisioning Key kan du synka historisk data från OpenRouter:

**Automatisk synk (implementerad i backend):**
```typescript
// Daglig cron job körs kl 03:00
// Synkar föregående dags data automatiskt till ai_usage_logs
```

**Manuell synk (från OpenRouter Dashboard):**
```typescript
// Klicka "Synka från OpenRouter" i Activity History
// Välj datumintervall
// Data hämtas från OpenRouter och sparas i ai_usage_logs
```

### Kostnadsberäkning i ROI

**Formel:**
```typescript
const aiCost = ai_usage_logs
  .filter(log => log.provider === 'openrouter' && log.created_at >= startDate && log.created_at <= endDate)
  .reduce((sum, log) => sum + log.cost_sek, 0);

const totalOperatingCost = telephonyCost + smsCost + emailCost + aiCost + hiemsSupportCost;
const netProfit = totalRevenue - totalOperatingCost;
const roi = (netProfit / totalOperatingCost) * 100;
```

**Period-anpassning:**
- Kostnader prorateras baserat på vald period
- Integrationskostnad inkluderas endast om perioden innehåller startdatum
- AI-kostnader summeras exakt för vald period

### CSV Export

CSV-export inkluderar nu OpenRouter-kostnader:
```
Datum, Bokningar, Intäkter (SEK), Kostnader (SEK), AI-kostnad (SEK), OpenRouter-kostnad (SEK), Vinst (SEK), ROI (%)
2025-01-01, 5, 25000, 3500, 250, 250, 21500, 614.29
```

### Viktigt att veta

✅ **OpenRouter-kostnader ingår ALLTID i ROI** - ingen konfiguration behövs  
✅ **Realtidsdata** - varje AI-anrop loggas direkt  
✅ **Historisk data** - kan synkas med Provisioning Key  
✅ **Procentuell fördelning** - se hur stor del AI är av totala kostnader  
✅ **Model breakdown** - se vilka modeller som kostar mest  

❌ **Ingen manuell input behövs** - allt är automatiskt  
❌ **Ingen separat kostnadskategori** - ingår i "Variabla kostnader"
