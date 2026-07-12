import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOwnerSession } from '@/lib/auth/owner';
import { createInvite } from '@/lib/onboarding/invites';
import { sendInviteEmail } from '@/lib/onboarding/notify';

const schema = z.object({ name: z.string().min(1).max(120), email: z.string().email() });

export async function POST(req: Request) {
  try {
    if (!(await getOwnerSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 422 });

    const { url } = await createInvite({ name: parsed.data.name, email: parsed.data.email });

    // Email the joiner the link. If it fails, still return the link so the owner
    // can copy-send manually — the `emailed` flag drives the UI message.
    let emailed = false;
    try {
      await sendInviteEmail({ name: parsed.data.name, email: parsed.data.email, url });
      emailed = true;
    } catch {
      emailed = false;
    }

    return NextResponse.json({ url, emailed });
  } catch {
    return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 });
  }
}
