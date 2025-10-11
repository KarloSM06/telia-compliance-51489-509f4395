import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizePhoneNumber(number: string, countryCode: string = 'SE'): string | null {
  try {
    const phoneNumber = parsePhoneNumberFromString(number, countryCode as any);
    if (!phoneNumber || !phoneNumber.isValid()) {
      return null;
    }
    return phoneNumber.formatInternational();
  } catch (error) {
    console.error('Phone number validation error:', error);
    return null;
  }
}

export function isValidPhoneNumber(number: string, countryCode: string = 'SE'): boolean {
  try {
    const phoneNumber = parsePhoneNumberFromString(number, countryCode as any);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
}
