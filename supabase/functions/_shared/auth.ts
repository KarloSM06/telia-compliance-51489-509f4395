import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2.75.0';

export interface AuthResult {
  user: {
    id: string;
    email?: string;
  };
  supabase: SupabaseClient;
  error?: never;
}

export interface AuthError {
  user?: never;
  supabase?: never;
  error: {
    message: string;
    status: number;
  };
}

/**
 * Authenticates a request and returns the user and Supabase client
 * @param req - The incoming request
 * @returns AuthResult with user and client, or AuthError
 */
export async function authenticateRequest(
  req: Request
): Promise<AuthResult | AuthError> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return {
        error: {
          message: 'Missing Authorization header',
          status: 401,
        },
      };
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        error: {
          message: 'Server configuration error',
          status: 500,
        },
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        error: {
          message: 'Invalid or expired token',
          status: 401,
        },
      };
    }

    return { user, supabase };
  } catch (err) {
    console.error('Authentication error:', err);
    return {
      error: {
        message: 'Authentication failed',
        status: 401,
      },
    };
  }
}

/**
 * Creates a service role Supabase client (bypasses RLS)
 * Use with caution - only for backend operations
 */
export function createServiceClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}
