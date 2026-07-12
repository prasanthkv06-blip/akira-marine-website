// TEMPORARY diagnostic endpoint — REMOVE after debugging Supabase connectivity.
// Exposes no secrets: only URL host, key lengths/equality, and the raw query error.
import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  let urlHost = 'MISSING';
  try { urlHost = new URL(url).host; } catch { urlHost = 'INVALID:' + JSON.stringify(url); }
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const svc = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const info: Record<string, unknown> = {
    urlHost,
    urlHasTrailingSlash: url.endsWith('/'),
    anonKeyLen: anon.length,
    serviceKeyLen: svc.length,
    anonEqualsService: anon.length > 0 && anon === svc,
    adminEmailSet: !!process.env.ADMIN_OWNER_EMAIL,
  };

  try {
    const { error } = await getAdminClient().from('invites').select('id').limit(1);
    info.queryOk = !error;
    info.queryError = error ? error.message : null;
  } catch (e) {
    info.threw = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(info);
}
