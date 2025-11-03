# Currency Conversion Strategy

## Overview

This application uses Swedish Kronor (SEK) as the primary display currency for all costs and revenue. External APIs (such as OpenRouter) return costs in USD, which are converted to SEK using a centralized exchange rate.

## Exchange Rate

**Central Constant:** `USD_TO_SEK = 10.5`

**Location:** `src/lib/constants.ts`

```typescript
export const USD_TO_SEK = 10.5;
```

## Data Storage

### Database Tables

All cost tables store **both** USD and SEK values:

#### `ai_usage_logs`
- `cost_usd` (numeric): Original cost from API in USD
- `cost_sek` (numeric): Converted cost in SEK (cost_usd * 10.5)

#### `telephony_events`
- `cost_usd` (numeric): Original cost in USD
- `cost_sek` (numeric): Converted cost in SEK

#### `message_logs`
- `cost` (numeric): Cost (usually USD)
- `metadata.cost_sek` (numeric): Converted cost in SEK

### Why Store Both?

1. **Historical Accuracy**: We preserve the original USD amounts for auditing
2. **Exchange Rate Changes**: If the exchange rate changes, we can recalculate without losing original data
3. **Multi-Currency Support**: Future support for other currencies is easier

## Conversion Flow

### 1. Incoming Data (External APIs → Database)

```
External API (USD) → Edge Function → Convert USD to SEK → Store both USD & SEK
```

**Example (OpenRouter):**
```typescript
// supabase/functions/sync-openrouter-activity/index.ts
const costUSD = row.cost || 0;
const costSEK = costUSD * 10.5;

const log = {
  cost_usd: costUSD,
  cost_sek: costSEK,
  // ... other fields
};
```

### 2. Frontend Display (Database → UI)

```
Database (cost_sek) → Hook → Component → Display as SEK
```

**Example:**
```typescript
// Always use cost_sek for display
const totalCost = data.reduce((sum, item) => sum + item.cost_sek, 0);
```

### 3. Real-time Data (External API → Frontend)

For data fetched directly from external APIs (like OpenRouter activity):

```
External API (USD) → Hook → Convert to SEK → Display
```

**Example:**
```typescript
// src/hooks/useOpenRouterActivitySEK.tsx
import { USD_TO_SEK } from '@/lib/constants';

const convertedData = rawData.activity.map(item => ({
  ...item,
  usage: (item.usage || 0) * USD_TO_SEK,
}));
```

## Format Functions

### SEK Formatting

```typescript
// src/lib/format.ts

// Full format with currency symbol
export const formatSEK = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0,00 SEK';
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Compact format
export const formatSEKCompact = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '0 kr';
  if (amount < 1) return `${amount.toFixed(2)} kr`;
  return `${amount.toFixed(0)} kr`;
};
```

### USD Formatting (for reference only)

```typescript
export const formatDollar = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
};
```

## Usage Examples

### Edge Functions

```typescript
// Always use the centralized constant
const USD_TO_SEK = 10.5;

// Convert when storing
const costSEK = costUSD * USD_TO_SEK;
await supabase.from('ai_usage_logs').insert({
  cost_usd: costUSD,
  cost_sek: costSEK,
});
```

### Frontend Components

```typescript
import { USD_TO_SEK } from '@/lib/constants';
import { formatSEK } from '@/lib/format';

// Convert real-time data
const costSEK = costUSD * USD_TO_SEK;

// Display with proper formatting
<div>{formatSEK(costSEK)}</div>
```

### Hooks

```typescript
import { USD_TO_SEK } from '@/lib/constants';

// Create a SEK-converting hook wrapper
export const useDataSEK = (data) => {
  return useMemo(() => {
    return data?.map(item => ({
      ...item,
      cost: (item.cost || 0) * USD_TO_SEK,
    }));
  }, [data]);
};
```

## Important Rules

### ✅ DO:

1. **Always import USD_TO_SEK from constants.ts**
   ```typescript
   import { USD_TO_SEK } from '@/lib/constants';
   ```

2. **Store both USD and SEK in database**
   ```typescript
   { cost_usd: 1.50, cost_sek: 15.75 }
   ```

3. **Display SEK in UI**
   ```typescript
   {formatSEK(item.cost_sek)}
   ```

4. **Convert at data boundaries** (API → DB, API → UI)

### ❌ DON'T:

1. **Don't hardcode exchange rates**
   ```typescript
   // ❌ WRONG
   const costSEK = costUSD * 11;
   ```

2. **Don't convert multiple times**
   ```typescript
   // ❌ WRONG - data is already in SEK
   const doubleCost = (item.cost_sek || 0) * USD_TO_SEK;
   ```

3. **Don't mix currencies without labels**
   ```typescript
   // ❌ WRONG - unclear which currency
   <div>Cost: {item.cost}</div>
   
   // ✅ CORRECT
   <div>Cost: {formatSEK(item.cost_sek)}</div>
   ```

## Testing Currency Conversion

### Unit Tests

```typescript
import { USD_TO_SEK } from '@/lib/constants';

describe('Currency Conversion', () => {
  it('should convert USD to SEK correctly', () => {
    const usd = 10;
    const sek = usd * USD_TO_SEK;
    expect(sek).toBe(105);
  });
});
```

### Integration Tests

- Verify all edge functions use the same USD_TO_SEK
- Check that stored data has both USD and SEK
- Confirm UI displays SEK correctly

## Future Enhancements

1. **Dynamic Exchange Rates**: Fetch rates from an API
2. **Multi-Currency Support**: Allow users to choose display currency
3. **Historical Exchange Rates**: Store rate used for each conversion
4. **Currency Recalculation**: Update all SEK values if rate changes

## Troubleshooting

### Issue: Wrong amounts displayed

1. Check if data is already in SEK (don't convert twice)
2. Verify USD_TO_SEK is imported from constants
3. Check database values (both USD and SEK should be present)

### Issue: Inconsistent amounts

1. Ensure all conversions use USD_TO_SEK from constants
2. Check for hardcoded exchange rates (search for `* 11`, `* 10`, etc)
3. Verify edge functions use correct rate

### Issue: Missing SEK values

1. Check if edge function performs conversion before storing
2. Verify database migration added cost_sek columns
3. Run backfill script to convert existing USD data
