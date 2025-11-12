import { formatInTimeZone as formatInTZ } from 'npm:date-fns-tz@3.2.0';
import { sv } from 'npm:date-fns@3.6.0/locale/sv';

export const DEFAULT_TIMEZONE = 'Europe/Stockholm';

export function formatInTimeZone(
  date: Date | string,
  formatStr: string,
  timezone: string = DEFAULT_TIMEZONE,
  options?: { locale?: any }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatInTZ(dateObj, timezone, formatStr, options);
}

export { sv };
