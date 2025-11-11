/**
 * Input validation and sanitization utilities for webhook data
 * Prevents XSS, injection attacks, and data corruption
 */

// Sanitize text fields to prevent XSS
export function sanitizeText(input: string | null | undefined, maxLength = 2000): string | null {
  if (!input || typeof input !== 'string') return null;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/&/g, '&amp;')
    .slice(0, maxLength)
    .trim();
}

// Validate and format phone number to E.164
export function validateAndFormatPhone(phone: string | null | undefined): string | null {
  if (!phone || typeof phone !== 'string') return null;
  
  const cleaned = phone.trim();
  if (!cleaned) return null;
  
  // E.164 format validation: +[1-9][0-9]{1,14}
  const e164Pattern = /^\+[1-9]\d{1,14}$/;
  
  // Already in E.164 format
  if (e164Pattern.test(cleaned)) return cleaned;
  
  // Try to convert to E.164
  if (cleaned.startsWith('00')) {
    const converted = '+' + cleaned.slice(2);
    return e164Pattern.test(converted) ? converted : null;
  }
  
  if (cleaned.startsWith('0')) {
    // Swedish number
    const converted = '+46' + cleaned.slice(1);
    return e164Pattern.test(converted) ? converted : null;
  }
  
  // Invalid format
  return null;
}

// Validate numeric field with bounds
export function validateNumber(
  value: any, 
  options: { min?: number; max?: number; integer?: boolean } = {}
): number | null {
  const { min = -1e10, max = 1e10, integer = false } = options;
  
  if (value === null || value === undefined) return null;
  
  const num = Number(value);
  
  if (isNaN(num) || !isFinite(num)) return null;
  if (num < min || num > max) return null;
  
  return integer ? Math.round(num) : num;
}

// Sanitize JSONB metadata to prevent prototype pollution
export function sanitizeMetadata(data: any, maxDepth = 3, currentDepth = 0): any {
  if (currentDepth >= maxDepth) return null;
  
  if (data === null || data === undefined) return {};
  if (typeof data !== 'object') return {};
  if (Array.isArray(data)) return data.slice(0, 100); // Limit array size
  
  const sanitized: any = {};
  const keys = Object.keys(data).slice(0, 50); // Limit number of keys
  
  for (const key of keys) {
    // Block prototype pollution attempts
    if (key.startsWith('__') || key === 'constructor' || key === 'prototype') {
      continue;
    }
    
    const value = data[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value, 1000);
    } else if (typeof value === 'number') {
      sanitized[key] = validateNumber(value);
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMetadata(value, maxDepth, currentDepth + 1);
    }
  }
  
  return sanitized;
}

// Validate and sanitize telephony event data before database insertion
export interface TelephonyEventInput {
  from_number?: string | null;
  to_number?: string | null;
  duration_seconds?: number | null;
  cost_amount?: number | null;
  status?: string | null;
  sms_body?: string | null;
  metadata?: any;
}

export interface ValidatedTelephonyEvent {
  from_number: string | null;
  to_number: string | null;
  duration_seconds: number | null;
  cost_amount: number | null;
  status: string | null;
  sms_body: string | null;
  metadata: any;
}

export function validateTelephonyEvent(input: TelephonyEventInput): ValidatedTelephonyEvent {
  return {
    from_number: validateAndFormatPhone(input.from_number),
    to_number: validateAndFormatPhone(input.to_number),
    duration_seconds: validateNumber(input.duration_seconds, { 
      min: 0, 
      max: 86400, // Max 24 hours
      integer: true 
    }),
    cost_amount: validateNumber(input.cost_amount, { 
      min: 0, 
      max: 10000 // Max $10,000 per event
    }),
    status: sanitizeText(input.status, 50),
    sms_body: sanitizeText(input.sms_body, 1600), // Max SMS length
    metadata: sanitizeMetadata(input.metadata),
  };
}

// Validate timestamp
export function validateTimestamp(timestamp: any): string {
  if (!timestamp) return new Date().toISOString();
  
  if (typeof timestamp === 'string') {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return new Date().toISOString();
      
      // Reject timestamps too far in past/future (10 years)
      const now = Date.now();
      const tenYears = 10 * 365 * 24 * 60 * 60 * 1000;
      if (Math.abs(date.getTime() - now) > tenYears) {
        return new Date().toISOString();
      }
      
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  if (typeof timestamp === 'number') {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return new Date().toISOString();
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  
  return new Date().toISOString();
}
