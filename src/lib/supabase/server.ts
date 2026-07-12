import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

// Cookie-based client for reading the owner's auth session in RSC / route handlers.
export async function getServerClient() {
  const cookieStore = await cookies();
  const cookieMethods: CookieMethodsServer = {
    getAll: () => cookieStore.getAll(),
    setAll: (list) => list.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
  };
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: cookieMethods,
  });
}
