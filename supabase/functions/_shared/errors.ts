export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED';

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  status: number;
  details?: any;
}

const errorMap: Record<ErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_ERROR: 500,
  EXTERNAL_API_ERROR: 502,
  VALIDATION_ERROR: 422,
  RATE_LIMITED: 429,
};

/**
 * Creates a standardized error response
 * @param code - Error code
 * @param message - Human-readable error message
 * @param details - Additional error details
 * @returns ErrorDetails object
 */
export function createError(
  code: ErrorCode,
  message: string,
  details?: any
): ErrorDetails {
  return {
    code,
    message,
    status: errorMap[code],
    details,
  };
}

/**
 * Converts an ErrorDetails object to a Response
 * @param error - ErrorDetails object
 * @param corsHeaders - CORS headers to include
 * @returns Response object
 */
export function errorToResponse(
  error: ErrorDetails,
  corsHeaders: Record<string, string>
): Response {
  return new Response(
    JSON.stringify({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    }),
    {
      status: error.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Logs an error with context
 * @param functionName - Name of the edge function
 * @param error - Error object or message
 * @param context - Additional context (user_id, etc)
 */
export function logError(
  functionName: string,
  error: any,
  context?: Record<string, any>
): void {
  console.error(`[${functionName}] Error:`, {
    message: error?.message || error,
    stack: error?.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Safely extracts error message from unknown error type
 * @param error - Unknown error object
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'An unexpected error occurred';
}

/**
 * Handles unexpected errors and returns a standardized response
 * @param functionName - Name of the edge function
 * @param error - The error that occurred
 * @param corsHeaders - CORS headers
 * @returns Response object
 */
export function handleUnexpectedError(
  functionName: string,
  error: unknown,
  corsHeaders: Record<string, string>
): Response {
  logError(functionName, error);
  
  const errorDetails = createError(
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? getErrorMessage(error) : undefined
  );
  
  return errorToResponse(errorDetails, corsHeaders);
}
