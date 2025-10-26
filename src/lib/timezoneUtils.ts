import { toZonedTime, fromZonedTime, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

/**
 * Central timezone constant for the entire application
 * Sweden uses Europe/Stockholm which automatically handles:
 * - Winter: CET (UTC+1)
 * - Summer: CEST (UTC+2)
 */
export const STOCKHOLM_TZ = 'Europe/Stockholm';

/**
 * Convert a UTC date to Stockholm time
 * @param date - Date object or ISO string in UTC
 * @returns Date object representing the same moment in Stockholm timezone
 */
export const toStockholmTime = (date: Date | string): Date => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return toZonedTime(dateObj, STOCKHOLM_TZ);
};

/**
 * Convert a Stockholm time to UTC (for storage in database)
 * @param date - Date object in Stockholm time
 * @returns Date object in UTC
 */
export const fromStockholmTime = (date: Date): Date => {
  return fromZonedTime(date, STOCKHOLM_TZ);
};

/**
 * Format a date in Stockholm timezone
 * @param date - Date object or ISO string
 * @param formatStr - date-fns format string
 * @returns Formatted string in Stockholm time
 */
export const formatInStockholm = (date: Date | string, formatStr: string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatInTimeZone(dateObj, STOCKHOLM_TZ, formatStr, { locale: sv });
};

/**
 * Get current time in Stockholm timezone
 * @returns Current Date object in Stockholm time
 */
export const getCurrentStockholmTime = (): Date => {
  return toZonedTime(new Date(), STOCKHOLM_TZ);
};

/**
 * Parse a date string as Stockholm time
 * Useful when user inputs a time that should be interpreted as Stockholm time
 * @param dateStr - ISO date string (e.g., "2024-01-15T14:00:00")
 * @returns Date object in Stockholm time
 */
export const parseStockholmTime = (dateStr: string): Date => {
  const parsed = parseISO(dateStr);
  return toZonedTime(parsed, STOCKHOLM_TZ);
};

/**
 * Check if a date is in daylight saving time (CEST) vs standard time (CET)
 * @param date - Date to check
 * @returns true if in CEST (summer time), false if in CET (winter time)
 */
export const isInDaylightSavingTime = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  // Format in Stockholm timezone and check offset
  const formatted = formatInTimeZone(dateObj, STOCKHOLM_TZ, 'XXX'); // Returns "+01:00" or "+02:00"
  
  return formatted === '+02:00'; // CEST (summer time)
};

/**
 * Get timezone offset string for Stockholm at a given date
 * @param date - Date to check
 * @returns Offset string like "UTC+1" or "UTC+2"
 */
export const getStockholmOffset = (date: Date | string = new Date()): string => {
  return isInDaylightSavingTime(date) ? 'UTC+2 (CEST)' : 'UTC+1 (CET)';
};

/**
 * Create a date in Stockholm timezone from date and time components
 * Use this when user picks a date/time that should be interpreted as Stockholm time
 * @param year - Year
 * @param month - Month (0-11, JavaScript standard)
 * @param day - Day of month
 * @param hour - Hour (0-23)
 * @param minute - Minute (0-59)
 * @returns Date object representing the Stockholm time (not yet converted to UTC)
 */
export const createStockholmDateTime = (
  year: number, 
  month: number, 
  day: number, 
  hour: number = 0, 
  minute: number = 0
): Date => {
  // Create date in Stockholm timezone context
  // This creates a Date object that represents the Stockholm time
  const isoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  
  // Parse as if it's in Stockholm timezone and get the equivalent UTC time
  const parsed = parseISO(isoString);
  return fromZonedTime(parsed, STOCKHOLM_TZ);
};

/**
 * Get detailed timezone info for debugging
 * @param date - Date to analyze
 * @returns Object with timezone information
 */
export const getTimezoneInfo = (date: Date | string = new Date()) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const stockholmTime = toStockholmTime(dateObj);
  
  return {
    input: dateObj.toISOString(),
    stockholmTime: formatInStockholm(dateObj, 'yyyy-MM-dd HH:mm:ss XXX'),
    isDST: isInDaylightSavingTime(dateObj),
    offset: getStockholmOffset(dateObj),
  };
};
