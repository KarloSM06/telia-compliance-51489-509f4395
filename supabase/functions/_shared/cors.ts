/**
 * Standard CORS headers for all edge functions
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Handles OPTIONS preflight requests
 * @returns Response with CORS headers
 */
export function handleCorsPreFlight(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Creates a success response with CORS headers
 * @param data - Response data
 * @param status - HTTP status code (default: 200)
 * @returns Response object
 */
export function corsResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Wraps an edge function handler with CORS support
 * @param handler - The function handler
 * @returns Wrapped handler that handles CORS
 */
export function withCors(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return handleCorsPreFlight();
    }

    // Execute handler and ensure response has CORS headers
    try {
      const response = await handler(req);
      
      // Add CORS headers if not already present
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      console.error('Handler error:', error);
      return new Response(
        JSON.stringify({
          error: {
            message: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error',
          },
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
}
