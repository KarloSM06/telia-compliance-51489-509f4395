/**
 * Normalizes a phone number to international format
 * Assumes Swedish phone numbers if no country code is provided
 */
export const normalizePhoneNumber = (phone: string): string => {
  // Remove all spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  
  // If it starts with 0, assume it's Swedish and convert to +46
  if (normalized.startsWith('0')) {
    normalized = '+46' + normalized.substring(1);
  }
  // If it doesn't start with +, assume Swedish and add +46
  else if (!normalized.startsWith('+')) {
    normalized = '+46' + normalized;
  }
  
  return normalized;
};
