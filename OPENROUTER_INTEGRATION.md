# OpenRouter Integration Strategy

## 🎯 Översikt

Hiems använder en **hybrid tracking-strategi** för att spåra all OpenRouter AI-användning:

1. **Primär:** Realtids-tracking via `/chat/completions`
2. **Backup:** Aggregerad historik via `/activity`

---

## 📊 Primär Metod: Realtids-tracking

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

---

## 🔄 Backup-Metod: Aggregerad Historik

**Endpoint:** `GET /api/v1/activity`  
**Edge Function:** `sync-openrouter-usage-cron`  
**Frekvens:** Varje timme (cron)  
**Data:** Aggregerad per dag/modell/endpoint

### Response Format:
```json
[
  {
    "date": "2025-11-01",
    "endpoint": "chat/completions",
    "model": "gpt-3.5-turbo",
    "prompt_tokens": 1000,
    "completion_tokens": 500,
    "total_tokens": 1500,
    "cost": 7.5,
    "requests": 10
  }
]
```

### Varför behövs detta?
- **Backup:** Om realtids-logging misslyckas
- **Validation:** Dubbelkolla att all användning är loggad
- **Historik:** Få data för datum innan realtids-logging implementerades

### Smart Dublettfiltrering
Cron-jobbet kontrollerar automatiskt vilka datum som redan finns från realtids-logging och synkar bara nya datum. Detta förhindrar dubbletter och onödig dataöverlappning.

---

## 🧪 Testa Endpoints

Använd `test-openrouter-endpoints` edge function för att verifiera:
- Vilka endpoints som fungerar med din API-nyckel
- Vilken data som returneras
- Om provisioning key krävs för `/activity`

**Kör test från UI:**
Gå till Integrationer → AI tab → "Testa Endpoints" knapp

---

## ⚠️ Viktigt att Veta

1. **Dubbletter:** Cron-jobbet filtrerar automatiskt bort datum som redan finns från realtids-logging
2. **Generation ID:** Finns bara i realtids-data, inte i aggregerad historik från `/activity`
3. **Provisioning Key:** `/activity` endpoint kan kräva särskild nyckel (ej samma som API key) - om du får 401/403 fel
4. **30 dagars limit:** `/activity` returnerar max 30 dagar bakåt
5. **Undokumenterad endpoint:** `/api/v1/generation` är INTE dokumenterad i OpenRouter API och rekommenderas EJ

---

## 📈 Dashboard Integration

`AIIntegrationsTab.tsx` visar data från `ai_usage_logs` tabell som populeras av:
- **Primärt:** `submit-prompt` (use_case = 'api_call' eller liknande)
- **Backup:** `sync-openrouter-usage-cron` (use_case = 'activity_backup')
- **Manuell:** `fetch-openrouter-usage` (use_case = 'manual_fetch')

---

## 🔧 Edge Functions

### 1. submit-prompt
**Syfte:** Skicka prompt till OpenRouter och logga usage direkt  
**Endpoint:** `/chat/completions`  
**När:** Vid varje AI-anrop från applikationen

### 2. sync-openrouter-usage-cron
**Syfte:** Synka aggregerad historik som backup  
**Endpoint:** `/activity`  
**När:** Varje timme via Supabase cron  
**Smart:** Filtrerar bort datum som redan finns

### 3. fetch-openrouter-usage
**Syfte:** Manuell hämtning av historik  
**Endpoint:** `/activity`  
**När:** På begäran från användare

### 4. test-openrouter-endpoints
**Syfte:** Testa vilka endpoints som fungerar  
**Endpoints:** `/generation` (undokumenterad) och `/activity` (dokumenterad)  
**När:** Vid konfiguration eller felsökning

---

## 🎯 Rekommenderad Workflow

1. **Initial Setup:**
   - Konfigurera OpenRouter API-nyckel i UI
   - Kör test för att verifiera att `/activity` fungerar
   - Aktivera cron-job för backup-sync

2. **Daglig Drift:**
   - All normal AI-usage loggas automatiskt via `submit-prompt`
   - Cron synkar backup-data varje timme (bara nya datum)
   - Dashboard visar kombinerad data från båda källor

3. **Troubleshooting:**
   - Kör endpoint-test för att identifiera problem
   - Kolla edge function logs i Supabase dashboard
   - Verifiera att både realtid och backup-sync fungerar

---

## 📚 Användbara Länkar

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Edge Function Logs](https://supabase.com/dashboard/project/shskknkivuewuqonjdjc/functions)
- [AI Usage Logs Table](https://supabase.com/dashboard/project/shskknkivuewuqonjdjc/editor)

---

## ✅ Sammanfattning

**Fördelar med hybrid-strategin:**
- ✅ Full detalj i realtid via `/chat/completions`
- ✅ Aggregerad backup via `/activity`
- ✅ Ingen risk för dubbletter
- ✅ Använder dokumenterade endpoints
- ✅ Automatisk synkronisering
- ✅ Validering mellan källor möjlig
