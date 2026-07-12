import { getServerClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';

export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === env.adminOwnerEmail;
}

export async function getOwnerSession(): Promise<{ email: string } | null> {
  const supabase = await getServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;
  return isOwnerEmail(email) ? { email: email as string } : null;
}
