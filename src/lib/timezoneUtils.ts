import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

/**
 * Default timezone for the application
 * Sweden uses Europe/Stockholm which automatically handles:
 * - Winter: CET (UTC+1)
 * - Summer: CEST (UTC+2)
 */
export const DEFAULT_TIMEZONE = 'Europe/Stockholm';

/**
 * Legacy export for backwards compatibility
 * @deprecated Use DEFAULT_TIMEZONE instead, or pass timezone explicitly to functions
 */
export const STOCKHOLM_TZ = DEFAULT_TIMEZONE;

/**
 * Convert a UTC date to a specific timezone
 * @param date - Date object or ISO string in UTC
 * @param timezone - IANA timezone identifier (e.g., 'Europe/Stockholm', 'America/New_York')
 * @returns Date object representing the same moment in specified timezone
 */
export const toTimeZone = (date: Date | string, timezone: string = DEFAULT_TIMEZONE): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(dateObj, timezone);
};

/**
 * Convert a Stockholm time to UTC (for storage in database)
 * @param date - Date object in Stockholm time
 * @returns Date object in UTC
 * @deprecated Use fromTimeZone instead
 */
export const fromStockholmTime = (date: Date): Date => {
  return fromZonedTime(date, DEFAULT_TIMEZONE);
};

/**
 * Convert a time in specific timezone to UTC (for storage in database)
 * @param date - Date object in local timezone
 * @param timezone - IANA timezone identifier
 * @returns Date object in UTC
 */
export const fromTimeZone = (date: Date, timezone: string = DEFAULT_TIMEZONE): Date => {
  return fromZonedTime(date, timezone);
};

/**
 * Format a date in a specific timezone
 * @param date - Date object or ISO string
 * @param formatStr - date-fns format string
 * @param timezone - IANA timezone identifier
 * @returns Formatted string in specified timezone
 */
export const formatInTimeZone_ = (date: Date | string, formatStr: string, timezone: string = DEFAULT_TIMEZONE): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, timezone, formatStr, { locale: sv });
};

/**
 * Convert a UTC date to Stockholm time (legacy compatibility)
 * @deprecated Use toTimeZone(date, timezone) instead
 */
export const toStockholmTime = (date: Date | string): Date => {
  return toTimeZone(date, DEFAULT_TIMEZONE);
};

/**
 * Format a date in Stockholm timezone (legacy compatibility)
 * @deprecated Use formatInTimeZone_(date, formatStr, timezone) instead
 */
export const formatInStockholm = (date: Date | string, formatStr: string): string => {
  return formatInTimeZone_(date, formatStr, DEFAULT_TIMEZONE);
};

/**
 * Get current time in a specific timezone
 * @param timezone - IANA timezone identifier
 * @returns Current Date object in specified timezone
 */
export const getCurrentTimeInZone = (timezone: string = DEFAULT_TIMEZONE): Date => {
  return toZonedTime(new Date(), timezone);
};

/**
 * Get current time in Stockholm timezone (legacy compatibility)
 * @deprecated Use getCurrentTimeInZone(timezone) instead
 */
export const getCurrentStockholmTime = (): Date => {
  return getCurrentTimeInZone(DEFAULT_TIMEZONE);
};

/**
 * Parse a date string as a specific timezone
 * Useful when user inputs a time that should be interpreted in their local timezone
 * @param dateStr - ISO date string (e.g., "2024-01-15T14:00:00")
 * @param timezone - IANA timezone identifier
 * @returns Date object in specified timezone
 */
export const parseTimeZone = (dateStr: string, timezone: string = DEFAULT_TIMEZONE): Date => {
  const parsed = parseISO(dateStr);
  return toZonedTime(parsed, timezone);
};

/**
 * Parse a date string as Stockholm time (legacy compatibility)
 * @deprecated Use parseTimeZone(dateStr, timezone) instead
 */
export const parseStockholmTime = (dateStr: string): Date => {
  return parseTimeZone(dateStr, DEFAULT_TIMEZONE);
};

/**
 * Check if a date is in daylight saving time for a specific timezone
 * @param date - Date to check
 * @param timezone - IANA timezone identifier
 * @returns true if in DST, false otherwise
 */
export const isInDaylightSavingTime = (date: Date | string, timezone: string = DEFAULT_TIMEZONE): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Format in timezone and check offset
  const formatted = formatInTimeZone(dateObj, timezone, 'XXX');
  
  // For Stockholm: "+02:00" is CEST (summer), "+01:00" is CET (winter)
  // For other timezones, we compare against standard time offset
  // This is a simplified check - for production, consider more robust DST detection
  return formatted.includes('+02:00') || formatted.includes('+03:00'); // Common DST offsets
};

/**
 * Get timezone offset string for a specific timezone at a given date
 * @param date - Date to check
 * @param timezone - IANA timezone identifier
 * @returns Offset string with timezone abbreviation
 */
export const getTimezoneOffset = (date: Date | string = new Date(), timezone: string = DEFAULT_TIMEZONE): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const formatted = formatInTimeZone(dateObj, timezone, 'XXX zzz');
  return formatted;
};

/**
 * Get Stockholm timezone offset (legacy compatibility)
 * @deprecated Use getTimezoneOffset(date, timezone) instead
 */
export const getStockholmOffset = (date: Date | string = new Date()): string => {
  const isDST = isInDaylightSavingTime(date, DEFAULT_TIMEZONE);
  return isDST ? 'UTC+2 (CEST)' : 'UTC+1 (CET)';
};

/**
 * Create a date in a specific timezone from date and time components
 * Use this when user picks a date/time that should be interpreted in their timezone
 * @param year - Year
 * @param month - Month (0-11, JavaScript standard)
 * @param day - Day of month
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @param timezone - IANA timezone identifier
 * @returns Date object in UTC representing the specified local time
 */
export const createDateTimeInZone = (
  year: number, 
  month: number, 
  day: number, 
  hour: number = 0, 
  minute: number = 0,
  timezone: string = DEFAULT_TIMEZONE
): Date => {
  const isoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  const parsed = parseISO(isoString);
  return fromZonedTime(parsed, timezone);
};

/**
 * Create a date in Stockholm timezone (legacy compatibility)
 * @deprecated Use createDateTimeInZone(year, month, day, hour, minute, timezone) instead
 */
export const createStockholmDateTime = (
  year: number, 
  month: number, 
  day: number, 
  hour: number = 0, 
  minute: number = 0
): Date => {
  return createDateTimeInZone(year, month, day, hour, minute, DEFAULT_TIMEZONE);
};

/**
 * Get detailed timezone info for debugging
 * @param date - Date to analyze
 * @param timezone - IANA timezone identifier
 * @returns Object with timezone information
 */
export const getTimezoneInfo = (date: Date | string = new Date(), timezone: string = DEFAULT_TIMEZONE) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const localTime = toTimeZone(dateObj, timezone);
  
  return {
    input: dateObj.toISOString(),
    timezone,
    localTime: formatInTimeZone_(dateObj, 'yyyy-MM-dd HH:mm:ss XXX', timezone),
    isDST: isInDaylightSavingTime(dateObj, timezone),
    offset: getTimezoneOffset(dateObj, timezone),
  };
};

/**
 * Format time as ISO string with timezone offset
 * This creates a string like "2025-10-27T09:00:00+01:00"
 * @param date - Date to format
 * @param timezone - IANA timezone identifier
 * @returns ISO string with timezone offset
 */
export const toISOStringWithOffset = (date: Date | string, timezone: string = DEFAULT_TIMEZONE): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, timezone, "yyyy-MM-dd'T'HH:mm:ssXXX");
};

/**
 * Convert calendar event times from UTC to local timezone with offset
 * Use this when exporting events to external systems or AI models
 * @param event - Event object with start_time and end_time in UTC
 * @param timezone - IANA timezone identifier
 * @returns Event with times converted to local timezone with offset
 */
export const convertEventToLocalTime = (
  event: { start_time: string; end_time: string },
  timezone: string = DEFAULT_TIMEZONE
): { start_time: string; end_time: string } => {
  return {
    start_time: toISOStringWithOffset(event.start_time, timezone),
    end_time: toISOStringWithOffset(event.end_time, timezone),
  };
};

/**
 * Convert multiple events to local timezone
 * Use this when exporting multiple events to external systems or AI models
 * @param events - Array of events with start_time and end_time in UTC
 * @param timezone - IANA timezone identifier
 * @returns Array of events with times converted to local timezone with offset
 */
export const convertEventsToLocalTime = <T extends { start_time: string; end_time: string }>(
  events: T[],
  timezone: string = DEFAULT_TIMEZONE
): T[] => {
  return events.map(event => ({
    ...event,
    ...convertEventToLocalTime(event, timezone)
  }));
};
