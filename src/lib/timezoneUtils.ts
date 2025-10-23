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
  const stockholmDate = toStockholmTime(date);
  const jan = new Date(stockholmDate.getFullYear(), 0, 1);
  const jul = new Date(stockholmDate.getFullYear(), 6, 1);
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return stockholmDate.getTimezoneOffset() < stdOffset;
};

/**
 * Get timezone offset string for Stockholm at a given date
 * @param date - Date to check
 * @returns Offset string like "UTC+1" or "UTC+2"
 */
export const getStockholmOffset = (date: Date | string = new Date()): string => {
  return isInDaylightSavingTime(date) ? 'UTC+2 (CEST)' : 'UTC+1 (CET)';
};
