# OpenRouter Integration - Complete Guide

## Overview
Komplett OpenRouter-integration med realtids-tracking, kontoinformation, modellista och historisk analys.

## Features

### 1. Real-time Usage Tracking
- Automatisk loggning via `submit-prompt`
- Tokens, kostnader, modeller
- Live dashboard-uppdateringar

### 2. Account Monitoring (API Key)
- Credit balance
- Usage statistics
- Rate limits

### 3. Model Discovery (API Key)
- Alla tillgängliga modeller
- Pricing per modell
- Model capabilities

### 4. Historical Analytics (Provisioning Key)
- Daglig användning
- Cost breakdown
- Trend analysis

## Setup

### API Key
1. Hämta från [openrouter.ai/keys](https://openrouter.ai/keys)
2. Navigera till Integrations → AI
3. Klicka "Konfigurera"
4. Ange API key och välj modell

### Provisioning Key (Valfritt)
1. Hämta från [openrouter.ai/settings/keys](https://openrouter.ai/settings/keys)
2. Ange i samma modal
3. Låser upp historisk data

## API Endpoints

### `/api/v1/chat/completions` - Main inference
### `/api/v1/credits` - Credit balance
### `/api/v1/auth/key` - API key info & rate limits
### `/api/v1/models` - Available models
### `/api/v1/activity` - Historical data (Provisioning Key required)

## Dashboard Components

- **Connection Status**: Visa anslutning och tracking-status
- **Account Overview**: Credits, usage, rate limits
- **Usage Metrics**: Cost, tokens, calls
- **Charts**: Cost per model, use case, över tid
- **Available Models**: Lista över alla modeller
- **Activity History**: Daglig breakdown (med provisioning key)
- **Model Statistics**: Detaljerad tabell

## Edge Functions

- `encrypt-provisioning-key` - Krypterar provisioning key
- `get-openrouter-credits` - Hämtar credit balance
- `get-openrouter-key-info` - Hämtar API key info
- `get-openrouter-models` - Listar modeller
- `get-openrouter-activity` - Hämtar historik

## React Hooks

- `useOpenRouterCredits()` - Credits (uppdateras varje minut)
- `useOpenRouterKeyInfo()` - Key info (cache 5 min)
- `useOpenRouterModels()` - Modeller (cache 1 timme)
- `useOpenRouterActivity(dateRange, enabled)` - Historik (cache 1 min)

## Database

**user_ai_settings:**
- `openrouter_api_key_encrypted`
- `openrouter_provisioning_key_encrypted`

**ai_usage_logs:** Lagrar all realtids-data