# Architecture Documentation

## System Overview

This application is built on a modern serverless architecture using:
- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **State Management:** React Query + Zustand
- **Authentication:** Supabase Auth

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Pages     │  │   Hooks     │  │ Components  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│         │                 │                 │        │
│         └─────────────────┴─────────────────┘        │
│                           │                          │
│                    React Query                       │
│                           │                          │
└───────────────────────────┼──────────────────────────┘
                            │
                    Supabase Client
                            │
┌───────────────────────────┼──────────────────────────┐
│                    Supabase Backend                  │
│                           │                          │
│  ┌────────────────────────┴─────────────────────┐   │
│  │           Edge Functions                      │   │
│  │  ┌──────────────┐  ┌──────────────┐         │   │
│  │  │ OpenRouter   │  │  Telephony   │  ...    │   │
│  │  └──────────────┘  └──────────────┘         │   │
│  └───────────────────────┬──────────────────────┘   │
│                          │                           │
│  ┌───────────────────────┴──────────────────────┐   │
│  │         PostgreSQL Database                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │  Tables  │ │   Views  │ │   RLS    │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘    │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
└──────────────────────────────────────────────────────┘
                            │
                    External APIs
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
  ┌─────▼─────┐     ┌───────▼──────┐    ┌──────▼─────┐
  │ OpenRouter │     │   Twilio     │    │  Retell    │
  └───────────┘     └──────────────┘    └────────────┘
```

## Data Flow

### 1. User Request Flow
```
User Action → Component → Hook → React Query → Supabase Client
    → Edge Function → Database → Response
```

### 2. Real-time Updates Flow
```
Database Change → Realtime Subscription → Hook Update 
    → Component Re-render → UI Update
```

### 3. Webhook Flow (External → Internal)
```
External Service → Edge Function (Public) → Validate Signature
    → Process Payload → Insert to Database → Trigger Realtime
    → Frontend Updates
```

## Key Components

### Frontend Layers

#### 1. Pages (`src/pages/`)
- Route-level components
- Data fetching orchestration
- Layout composition

#### 2. Components (`src/components/`)
- Reusable UI components
- Dashboard widgets
- Forms and inputs

#### 3. Hooks (`src/hooks/`)
- Data fetching hooks (React Query)
- Business logic hooks
- Real-time subscription hooks

#### 4. Libraries (`src/lib/`)
- Utility functions
- Format helpers
- Constants
- ROI calculations

### Backend Layers

#### 1. Edge Functions (`supabase/functions/`)
- API endpoints
- Webhook handlers
- Background jobs
- Integration logic

##### Shared Utilities (`supabase/functions/_shared/`)
- Authentication helpers
- Encryption utilities
- Error handling
- CORS management

#### 2. Database (`supabase/migrations/`)
- Table schemas
- RLS policies
- Database functions
- Triggers
- Views for analytics

## Security Model

### Authentication Flow
```
1. User signs in via Supabase Auth
2. JWT token issued with user_id
3. Token included in all requests
4. RLS policies enforce data access
```

### Row-Level Security (RLS)

All tables use RLS policies:
- Users can only access their own data
- `user_id` column enforced on all queries
- Service role bypasses RLS for admin operations

### Encryption

Sensitive data encrypted at rest:
- API keys (AES-256-GCM)
- Credentials (Supabase pgcrypto)
- Personal information (application-level encryption)

## Integration Architecture

### OpenRouter Integration
```
Frontend → get-openrouter-activity → OpenRouter API → Return USD data
                                                     ↓
Frontend Hook → Convert USD to SEK → Display in UI

Background: sync-openrouter-activity (cron) → Fetch → Store in ai_usage_logs
```

### Telephony Integration
```
Twilio/Telnyx/Vapi/Retell → Webhook → Edge Function
    → Verify Signature → Parse Payload → Store in telephony_events
    → Trigger Realtime → Frontend Updates
```

### Booking System Integration
```
SimplyBook/Bokamera → Webhook → Edge Function
    → Store in calendar_events → Trigger Realtime
    → Frontend Updates → ROI Calculations
```

## Performance Optimizations

### 1. Database Level
- Indexes on frequently queried columns
- Materialized views for analytics
- Efficient RLS policies

### 2. Application Level
- React Query caching
- Stale-while-revalidate pattern
- Parallel data fetching
- Lazy loading

### 3. Edge Functions
- Shared code reduces cold starts
- Connection pooling
- Batch operations where possible

## Monitoring & Observability

### Logs
- Edge function logs via Supabase dashboard
- Frontend errors via console
- Database query logs

### Metrics
- `ai_usage_logs` - AI costs and usage
- `telephony_events` - Call/SMS metrics
- `calendar_events` - Booking metrics
- `function_logs` - Edge function performance

## Deployment

### Frontend
- Automatic deployment on push to main
- Vite build optimization
- Asset optimization

### Backend
- Edge functions auto-deployed
- Database migrations run on deploy
- Zero-downtime deployments

## Scalability Considerations

1. **Database**: PostgreSQL scales to millions of rows
2. **Edge Functions**: Auto-scaling serverless
3. **Real-time**: Supabase Realtime scales automatically
4. **Storage**: Supabase Storage for files

## Future Enhancements

1. Edge caching for analytics queries
2. WebSocket connections for real-time chat
3. Background job queue for heavy processing
4. Multi-tenancy support
5. Advanced monitoring dashboard
