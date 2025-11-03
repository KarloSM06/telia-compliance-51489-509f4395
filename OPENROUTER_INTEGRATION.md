# OpenRouter Integration - Real-time Tracking

## 🎯 Översikt

Hiems använder **realtids-tracking** för att spåra all OpenRouter AI-användning via `/chat/completions` endpoint. Data loggas automatiskt i `ai_usage_logs` tabellen och visas i realtid på dashboarden.

---

## 📊 Realtids-tracking

**Endpoint:** `POST /api/v1/chat/completions`  
**Edge Function:** `submit-prompt`  
**Frekvens:** Vid varje AI-anrop  
**Data:** Full detalj per anrop

### Request Format:
```json
{
  "model": "openai/gpt-3.5-turbo",
  "messages": [
    { "role": "user", "content": "Hej världen" }
  ],
  "usage": { "include": true },  // MÅSTE inkluderas
  "user": "user_123"              // Valfritt, för spårning per användare
}
```

### Response Format:
```json
{
  "id": "gen_abc123",
  "choices": [
    { "message": { "role": "assistant", "content": "Hej!" } }
  ],
  "usage": {
    "prompt_tokens": 194,
    "completion_tokens": 2,
    "total_tokens": 196,
    "cost": 0.95
  }
}
```

### Vad sparas:
- Generation ID
- Modell
- Prompt tokens, completion tokens, total tokens
- Kostnad (USD + SEK)
- User ID
- Session metadata
- Timestamp

---

## 🎯 Så fungerar det

1. **AI-anrop görs** → Användaren skickar en prompt via applikationen
2. **submit-prompt körs** → Edge function skickar request till OpenRouter
3. **Usage returneras** → OpenRouter returnerar tokens och kostnad
4. **Automatisk loggning** → Data sparas direkt i `ai_usage_logs` tabell
5. **Dashboard uppdateras** → Realtids-visualisering av kostnader och användning

---

## 📈 Dashboard Integration

`AIIntegrationsTab.tsx` visar data från `ai_usage_logs` tabell:
- **Total kostnad** (USD och SEK)
- **Tokens använt** (prompt, completion, total)
- **Antal anrop**
- **Kostnadsfördelning** per modell (pie chart)
- **Kostnadsfördelning** per use case (pie chart)
- **Daglig kostnadstrend** (area chart)
- **Detaljerad modellstatistik** (tabell)

Realtids-indikator visar när nya anrop loggas.

---

## 🔧 Edge Functions

### submit-prompt
**Syfte:** Skicka prompt till OpenRouter och logga usage direkt  
**Endpoint:** `/chat/completions`  
**När:** Vid varje AI-anrop från applikationen  
**Funktionalitet:**
- Hämtar och dekrypterar OpenRouter API-nyckel
- Skickar request till OpenRouter
- Loggar usage i `ai_usage_logs`
- Returnerar AI-svar till klienten

---

## 🎯 Rekommenderad Workflow

1. **Initial Setup:**
   - Konfigurera OpenRouter API-nyckel i UI (Integrationer → AI)
   - Verifiera att submit-prompt edge function fungerar
   - Dashboard visar automatiskt realtids-data

2. **Daglig Drift:**
   - All normal AI-usage loggas automatiskt via `submit-prompt`
   - Dashboard uppdateras i realtid när nya anrop kommer in
   - Ingen manuell synkronisering krävs

3. **Troubleshooting:**
   - Kolla edge function logs i Supabase dashboard
   - Verifiera att OpenRouter API-nyckel är korrekt konfigurerad
   - Kontrollera `ai_usage_logs` tabell för loggade anrop

---

## ⚠️ Kända Begränsningar

### 1. `/api/v1/activity` endpoint
- **Status:** Ej implementerad
- **Anledning:** Kräver Provisioning Key (inte samma som API-nyckel)
- **Fel:** HTTP 403 - "Only provisioning keys can fetch activity for an account"
- **Påverkan:** Ingen aggregerad historik tillgänglig från OpenRouter
- **Lösning:** Realtids-tracking via `submit-prompt` ger all nödvändig data

### 2. `/api/v1/generation` endpoint
- **Status:** Ej implementerad
- **Anledning:** Undokumenterad endpoint, kräver generation_id per anrop
- **Fel:** HTTP 400 - Bad Request
- **Påverkan:** Kan inte hämta historik per generation_id
- **Alternativ:** `/chat/completions` med `usage.include = true` (implementerad)

### 3. Backup-sync
- **Status:** Ej tillgänglig
- **Anledning:** Provisioning Key krävs för `/activity` endpoint
- **Påverkan:** Ingen automatisk backup-synkronisering av aggregerad data
- **Kompensation:** Realtids-logging ger fullständig täckning av all användning

---

## 📚 Användbara Länkar

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Edge Function Logs](https://supabase.com/dashboard/project/shskknkivuewuqonjdjc/functions/submit-prompt/logs)
- [AI Usage Logs Table](https://supabase.com/dashboard/project/shskknkivuewuqonjdjc/editor)

---

## ✅ Sammanfattning

**Implementerad funktionalitet:**
- ✅ Full realtids-tracking via `/chat/completions`
- ✅ Automatisk loggning i `ai_usage_logs`
- ✅ Detaljerad dashboard med grafer och statistik
- ✅ Realtids-uppdateringar när nya anrop kommer in
- ✅ Kostnad per modell, use case, och dag
- ✅ Ingen manuell synkronisering krävs

**Ej implementerat:**
- ❌ Aggregerad historik från `/activity` (kräver Provisioning Key)
- ❌ Backup-synkronisering via cron
- ❌ Endpoint-testning (alla tester visar 403/400 fel)

**Slutsats:**  
Realtids-tracking via `submit-prompt` ger fullständig täckning av all AI-användning. Aggregerad backup från `/activity` är inte nödvändig eftersom all data redan loggas i realtid.
