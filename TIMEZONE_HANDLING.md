# Timezone Hantering i Kalendersystemet

## Översikt
Hela kalendersystemet använder **Europe/Stockholm** timezone för konsistent hantering av svensk tid.

## Tidszoner

### CET vs CEST
- **Vintertid (CET)**: UTC+1 (Oktober - Mars)
- **Sommartid (CEST)**: UTC+2 (Mars - Oktober)
- Automatisk övergång hanteras av `date-fns-tz`

### Viktiga Datum för DST-övergångar
- **Vår**: Sista söndagen i mars kl 02:00 → 03:00 (CET → CEST)
- **Höst**: Sista söndagen i oktober kl 03:00 → 02:00 (CEST → CET)

## Arkitektur

### Grundprinciper

1. **Lagring i Databas**: All data lagras i UTC
   ```sql
   -- Exempel: Event sparas som UTC
   INSERT INTO calendar_events (start_time, end_time, timezone)
   VALUES ('2024-01-15 13:00:00+00', '2024-01-15 14:00:00+00', 'Europe/Stockholm');
   ```

2. **Visning i UI**: All visning sker i Stockholm-tid
   ```typescript
   // Konvertera från UTC till Stockholm för visning
   const displayTime = toStockholmTime(event.start_time);
   ```

3. **Användarinput**: All input tolkas som Stockholm-tid
   ```typescript
   // När användaren väljer "14:00" betyder det 14:00 Stockholm-tid
   const utcTime = fromStockholmTime(userSelectedTime);
   ```

4. **Konvertering vid Gränser**: Konvertering sker vid lagring/hämtning
   ```typescript
   // Vid hämtning: UTC → Stockholm
   // Vid lagring: Stockholm → UTC
   ```

## API Reference

### Centrala Funktioner (`src/lib/timezoneUtils.ts`)

#### `toStockholmTime(date: Date | string): Date`
Konverterar UTC-tid till Stockholm-tid.
```typescript
const stockholmTime = toStockholmTime('2024-01-15T13:00:00Z');
// Returnerar: 2024-01-15T14:00:00 (CET, UTC+1)
```

#### `fromStockholmTime(date: Date): Date`
Konverterar Stockholm-tid till UTC för lagring.
```typescript
const utcTime = fromStockholmTime(new Date('2024-01-15T14:00:00'));
// Returnerar: 2024-01-15T13:00:00Z
```

#### `formatInStockholm(date: Date | string, formatStr: string): string`
Formaterar datum i Stockholm-tid.
```typescript
const formatted = formatInStockholm(date, 'EEEE d MMMM yyyy, HH:mm');
// Returnerar: "måndag 15 januari 2024, 14:00"
```

#### `getCurrentStockholmTime(): Date`
Hämtar aktuell tid i Stockholm.
```typescript
const now = getCurrentStockholmTime();
```

#### `parseStockholmTime(dateStr: string): Date`
Tolkar en datumsträng som Stockholm-tid.
```typescript
const parsed = parseStockholmTime('2024-01-15T14:00:00');
```

#### `getStockholmOffset(date?: Date | string): string`
Returnerar tidszonsoffset för Stockholm.
```typescript
const offset = getStockholmOffset();
// Returnerar: "UTC+1 (CET)" eller "UTC+2 (CEST)"
```

## Databasschema

### calendar_events
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY,
  start_time TIMESTAMPTZ NOT NULL,  -- Lagras i UTC
  end_time TIMESTAMPTZ NOT NULL,    -- Lagras i UTC
  timezone TEXT DEFAULT 'Europe/Stockholm',
  ...
);
```

### availability_slots
```sql
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY,
  start_time TIME NOT NULL,         -- Lokal tid (inte timezone-aware)
  end_time TIME NOT NULL,           -- Lokal tid (inte timezone-aware)
  timezone TEXT DEFAULT 'Europe/Stockholm',
  ...
);
```

## Användningsexempel

### Skapa Event
```typescript
// Användaren väljer 15 januari 2024, 14:00-15:00 (Stockholm-tid)
const event = {
  title: "Möte",
  start_time: "2024-01-15T14:00:00", // Stockholm-tid
  end_time: "2024-01-15T15:00:00"
};

// I useCalendarEvents hook konverteras detta till UTC för lagring:
const startUTC = fromStockholmTime(new Date(event.start_time));
// startUTC = "2024-01-15T13:00:00Z" (UTC)
```

### Visa Event
```typescript
// Från databas kommer UTC-tid
const eventFromDB = {
  start_time: "2024-01-15T13:00:00Z",
  end_time: "2024-01-15T14:00:00Z"
};

// Konvertera till Stockholm-tid för visning
const displayStart = toStockholmTime(eventFromDB.start_time);
const formatted = formatInStockholm(displayStart, 'HH:mm');
// formatted = "14:00"
```

### Drag & Drop
```typescript
// När användaren drar ett event till ny position
const newTime = getTimeFromYPosition(mouseY, containerTop);
// newTime är redan i Stockholm-tid

// Uppdatera event
await updateEvent(eventId, {
  start_time: newTime.toISOString()
});
// Hook konverterar automatiskt till UTC innan lagring
```

## DST-hantering

### Vårövergång (CET → CEST)
```typescript
// 2024-03-31 02:00 → 03:00
// Klockan hoppar fram en timme
// Tidsspannet 02:00-03:00 existerar inte!

// date-fns-tz hanterar detta automatiskt:
const beforeDST = parseStockholmTime('2024-03-31T01:59:00');
const afterDST = parseStockholmTime('2024-03-31T03:00:00');
// Ingen 02:xx tid tillåts
```

### Höstövergång (CEST → CET)
```typescript
// 2024-10-27 03:00 → 02:00
// Klockan går tillbaka en timme
// Tidsspannet 02:00-03:00 existerar två gånger!

// date-fns-tz hanterar detta automatiskt:
const firstOccurrence = parseStockholmTime('2024-10-27T02:30:00');
// Tolkas som CEST (UTC+2)
```

## Best Practices

### ✅ GÖR

1. **Använd alltid timezone utils**
   ```typescript
   import { toStockholmTime, formatInStockholm } from '@/lib/timezoneUtils';
   ```

2. **Lagra UTC i databas**
   ```typescript
   const utcTime = fromStockholmTime(stockholmTime);
   await supabase.from('calendar_events').insert({ start_time: utcTime });
   ```

3. **Visa Stockholm-tid för användare**
   ```typescript
   const displayTime = formatInStockholm(utcTime, 'HH:mm');
   ```

4. **Testa runt DST-övergångar**
   ```typescript
   // Test vårövergång
   const springDST = new Date('2024-03-31T02:00:00');
   
   // Test höstövergång
   const fallDST = new Date('2024-10-27T02:00:00');
   ```

### ❌ UNDVIK

1. **Skapa datum utan timezone-awareness**
   ```typescript
   // ❌ FEL
   const time = new Date('2024-01-15T14:00:00');
   
   // ✅ RÄTT
   const time = parseStockholmTime('2024-01-15T14:00:00');
   ```

2. **Använd date-fns format direkt**
   ```typescript
   // ❌ FEL
   format(date, 'HH:mm')
   
   // ✅ RÄTT
   formatInStockholm(date, 'HH:mm')
   ```

3. **Anta att UTC och Stockholm är samma**
   ```typescript
   // ❌ FEL
   const stockholmTime = new Date(utcTime);
   
   // ✅ RÄTT
   const stockholmTime = toStockholmTime(utcTime);
   ```

## Felsökning

### Problem: Event visas på fel tid
**Orsak**: Troligen konverteras inte UTC till Stockholm vid visning.
**Lösning**: Använd `toStockholmTime()` innan visning.

### Problem: Event sparas med fel tid
**Orsak**: Stockholm-tid skickas till databas utan konvertering.
**Lösning**: Använd `fromStockholmTime()` innan lagring.

### Problem: Tiden är en timme fel efter DST-övergång
**Orsak**: Använder `Date` istället för timezone-aware funktioner.
**Lösning**: Använd alltid funktioner från `timezoneUtils.ts`.

### Problem: Drag & drop ger fel tider
**Orsak**: `getTimeFromYPosition` använder inte Stockholm-tid.
**Lösning**: Funktionen uppdaterad att använda `toStockholmTime()`.

## Testing Guide

### Enhetstest
```typescript
import { toStockholmTime, fromStockholmTime } from '@/lib/timezoneUtils';

test('converts UTC to Stockholm time in winter', () => {
  const utc = new Date('2024-01-15T13:00:00Z');
  const stockholm = toStockholmTime(utc);
  expect(stockholm.getHours()).toBe(14); // UTC+1
});

test('converts UTC to Stockholm time in summer', () => {
  const utc = new Date('2024-07-15T12:00:00Z');
  const stockholm = toStockholmTime(utc);
  expect(stockholm.getHours()).toBe(14); // UTC+2
});
```

### Manuella Test-scenarier

1. **Skapa event i vintertid**
   - Välj datum i januari
   - Välj tid 14:00
   - Verifiera att det sparas som 13:00 UTC

2. **Skapa event i sommartid**
   - Välj datum i juli
   - Välj tid 14:00
   - Verifiera att det sparas som 12:00 UTC

3. **Visa event över DST-gräns**
   - Skapa event i mars (före DST)
   - Visa kalendern i april (efter DST)
   - Verifiera korrekt tidsvisning

4. **Drag event över DST-gräns**
   - Skapa event i mars
   - Dra till april
   - Verifiera korrekt ny tid

## Referenser

- [date-fns-tz Documentation](https://github.com/marnusw/date-fns-tz)
- [IANA Timezone Database](https://www.iana.org/time-zones)
- [Swedish DST Rules](https://www.timeanddate.com/time/change/sweden)
- [Europe/Stockholm Timezone Info](https://en.wikipedia.org/wiki/Time_in_Sweden)

## Kontakt & Support

Vid frågor eller problem med timezone-hantering, kontakta utvecklingsteamet eller skapa en issue i projektets repository.

---

**Senast uppdaterad**: 2024-10-22
**Version**: 1.0.0
