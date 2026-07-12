import { NextResponse } from 'next/server';
import { getInviteByToken, isInviteUsable } from '@/lib/onboarding/invites';
import { fileMetaSchema } from '@/lib/onboarding/schema';
import { buildObjectPath } from '@/lib/onboarding/uploads';
import { getAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limiter';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const token = typeof body?.token === 'string' ? body.token : '';
    const meta = fileMetaSchema.safeParse(body?.file);
    if (!token || !meta.success) return NextResponse.json({ error: 'Invalid request' }, { status: 422 });

    const invite = await getInviteByToken(token);
    if (!invite || !isInviteUsable(invite, new Date())) {
      return NextResponse.json({ error: 'This link is no longer valid.' }, { status: 403 });
    }

    const path = buildObjectPath(invite.id, meta.data.field, meta.data.filename);
    const { data, error } = await getAdminClient().storage
      .from('onboarding-docs').createSignedUploadUrl(path);
    if (error || !data) return NextResponse.json({ error: 'Upload init failed' }, { status: 500 });
    return NextResponse.json({ uploadUrl: data.signedUrl, token: data.token, path });
  } catch {
    return NextResponse.json({ error: 'Upload init failed' }, { status: 500 });
  }
}
