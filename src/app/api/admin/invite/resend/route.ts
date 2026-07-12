import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOwnerSession } from '@/lib/auth/owner';
import { getInviteById, isInviteUsable } from '@/lib/onboarding/invites';
import { sendInviteEmail } from '@/lib/onboarding/notify';
import { env } from '@/lib/env';

const schema = z.object({ id: z.string().uuid() });

export async function POST(req: Request) {
  try {
    if (!(await getOwnerSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 422 });

    const invite = await getInviteById(parsed.data.id);
    if (!invite || !isInviteUsable(invite, new Date())) {
      return NextResponse.json({ error: 'Invite is not active' }, { status: 409 });
    }

    await sendInviteEmail({
      name: invite.invitee_name,
      email: invite.invitee_email,
      url: `${env.appUrl}/onboarding/${invite.token}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to resend invite' }, { status: 500 });
  }
}
