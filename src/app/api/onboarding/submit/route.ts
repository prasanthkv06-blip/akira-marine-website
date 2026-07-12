import { NextResponse } from 'next/server';
import { onboardingSubmissionSchema } from '@/lib/onboarding/schema';
import { getInviteByToken, isInviteUsable, markInviteUsed } from '@/lib/onboarding/invites';
import { createSubmission, pathBelongsToInvite } from '@/lib/onboarding/submissions';
import { sendSubmissionNotification } from '@/lib/onboarding/notify';
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
    const parsed = onboardingSubmissionSchema.safeParse(body?.data);
    if (!token || !parsed.success) return NextResponse.json({ error: 'Invalid submission' }, { status: 422 });

    const invite = await getInviteByToken(token);
    if (!invite || !isInviteUsable(invite, new Date())) {
      return NextResponse.json({ error: 'This link is no longer valid.' }, { status: 403 });
    }

    const d = parsed.data;
    const paths = [d.photoPath, d.passportFrontPath, d.passportBackPath];
    if (!paths.every((p) => pathBelongsToInvite(p, invite.id))) {
      return NextResponse.json({ error: 'Invalid file references' }, { status: 400 });
    }

    const { id } = await createSubmission(invite.id, d);
    await markInviteUsed(invite.id);
    try {
      await sendSubmissionNotification({ name: d.fullName, submissionId: id });
    } catch {
      console.warn('[onboarding] notification email failed to send');
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
