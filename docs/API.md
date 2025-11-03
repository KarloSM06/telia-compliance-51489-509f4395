# API Documentation

## Overview

This document describes all Supabase Edge Functions available in the system.

## Authentication

All edge functions (except public webhooks) require authentication via Bearer token:

```
Authorization: Bearer <supabase_jwt_token>
```

## Edge Functions

### OpenRouter Functions

#### `get-openrouter-activity`

Fetches activity data from OpenRouter API.

**Method:** POST

**Request Body:**
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Response:**
```json
{
  "activity": [
    {
      "id": "string",
      "model": "string",
      "usage": 0.0,
      "created_at": "timestamp"
    }
  ],
  "daily_usage": [...]
}
```

---

#### `sync-openrouter-activity`

Syncs OpenRouter activity to `ai_usage_logs` table.

**Method:** POST

**Request Body:**
```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Response:**
```json
{
  "success": true,
  "synced": 150,
  "skipped": 20
}
```

---

#### `get-openrouter-credits`

Gets current credit balance from OpenRouter.

**Method:** GET

**Response:**
```json
{
  "balance": 10.50,
  "currency": "USD"
}
```

---

#### `get-openrouter-keys`

Lists all API keys for the user's OpenRouter account.

**Method:** GET

**Response:**
```json
{
  "keys": [
    {
      "key_hash": "string",
      "name": "string",
      "created_at": "timestamp"
    }
  ]
}
```

---

### Telephony Functions

#### `twilio-webhook`

Handles incoming webhooks from Twilio.

**Method:** POST

**Public:** Yes (verified via webhook signature)

**Request Body:** Twilio webhook payload

---

#### `telnyx-webhook`

Handles incoming webhooks from Telnyx.

**Method:** POST

**Public:** Yes (verified via webhook signature)

---

#### `retell-webhook`

Handles incoming webhooks from Retell.

**Method:** POST

**Public:** Yes (verified via webhook token)

---

#### `vapi-webhook`

Handles incoming webhooks from Vapi.

**Method:** POST

**Public:** Yes (verified via webhook token)

---

### Booking Functions

#### `simplybook-webhook`

Handles incoming webhooks from SimplyBook.

**Method:** POST

**Public:** Yes

---

### Notification Functions

#### `send-owner-notification`

Sends notifications to business owners about bookings.

**Method:** POST

**Request Body:**
```json
{
  "event_type": "new_booking",
  "booking_id": "uuid",
  "customer_name": "string",
  "customer_email": "string"
}
```

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | User lacks permission |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `EXTERNAL_API_ERROR` | 502 | External API call failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

## Rate Limiting

- OpenRouter functions: Limited by OpenRouter API
- Webhook functions: No limit (verified via signature)
- Other functions: 100 requests/minute per user

## Common Response Format

### Success Response
```json
{
  "data": { ... },
  "success": true
}
```

### Error Response
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```
