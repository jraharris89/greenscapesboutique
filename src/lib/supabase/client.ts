/**
 * Supabase Client Configuration
 *
 * This module provides Supabase client instances for both
 * server-side and client-side usage.
 *
 * Note: Database types can be generated using the Supabase CLI:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to avoid build-time errors
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    // Return placeholder during build to allow static analysis
    // The client will fail at runtime if not configured properly
    if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
      console.warn("NEXT_PUBLIC_SUPABASE_URL is not set");
    }
    return "https://placeholder.supabase.co";
  }
  return url;
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key) {
    if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
      console.warn("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
    }
    return "placeholder-anon-key";
  }
  return key;
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
      console.warn("SUPABASE_SERVICE_ROLE_KEY is not set");
    }
    return "placeholder-service-key";
  }
  return key;
}

/**
 * Client-side Supabase client (uses anon key)
 * Safe to use in browser - respects Row Level Security
 */
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return _supabase;
}

/**
 * Server-side Supabase client (uses service role key)
 * Only use in API routes, server components, or cron jobs
 * Bypasses Row Level Security - use with caution
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabaseAdmin;
}

// Proxy object for backwards compatibility
// Allows code to use supabaseAdmin.from() without immediate initialization
export const supabaseAdmin = {
  from: (table: string) => getSupabaseAdmin().from(table),
  rpc: (fn: string, params?: Record<string, unknown>) => getSupabaseAdmin().rpc(fn, params),
};

export const supabase = {
  from: (table: string) => getSupabase().from(table),
  rpc: (fn: string, params?: Record<string, unknown>) => getSupabase().rpc(fn, params),
};

/**
 * Create a server-side client for use in Server Components
 */
export function createServerClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
