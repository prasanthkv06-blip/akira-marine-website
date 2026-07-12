import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

// Server-only. Uses the service-role key; bypasses RLS. NEVER import in client code.
export function getAdminClient(): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
