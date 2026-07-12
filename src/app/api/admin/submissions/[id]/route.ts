import { NextResponse } from 'next/server';
import { getOwnerSession } from '@/lib/auth/owner';
import { deleteSubmission } from '@/lib/onboarding/submissions';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await getOwnerSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteSubmission(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
