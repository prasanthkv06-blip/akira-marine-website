import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

// Cookie-based client for reading the owner's auth session in RSC / route handlers.
export async function getServerClient() {
  const cookieStore = await cookies();
  const cookieMethods: CookieMethodsServer = {
    getAll: () => cookieStore.getAll(),
    setAll: (list) => {
      try {
        list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      } catch {
        // Called from a Server Component render, where cookie writes are disallowed.
        // Safe to ignore — session refresh happens in Route Handlers / on next request.
      }
    },
  };
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: cookieMethods,
  });
}
