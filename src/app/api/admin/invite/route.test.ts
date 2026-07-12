import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth/owner', () => ({ getOwnerSession: vi.fn() }));
vi.mock('@/lib/onboarding/invites', () => ({
  createInvite: vi.fn(async () => ({ id: 'inv-1', token: 'tok', url: 'https://x/onboarding/tok' })),
}));

import { POST } from './route';
import { getOwnerSession } from '@/lib/auth/owner';
import { createInvite } from '@/lib/onboarding/invites';

function reqWith(payload: unknown) {
  return new Request('http://x/api/admin/invite', { method: 'POST', body: JSON.stringify(payload) });
}

describe('POST /api/admin/invite', () => {
  beforeEach(() => vi.clearAllMocks());

  it('401 when not the owner', async () => {
    (getOwnerSession as any).mockResolvedValue(null);
    const res = await POST(reqWith({ name: 'A', email: 'a@b.com' }));
    expect(res.status).toBe(401);
    expect(createInvite).not.toHaveBeenCalled();
  });

  it('422 when the body is invalid', async () => {
    (getOwnerSession as any).mockResolvedValue({ email: 'owner@akira.com' });
    const res = await POST(reqWith({ name: '', email: 'not-an-email' }));
    expect(res.status).toBe(422);
    expect(createInvite).not.toHaveBeenCalled();
  });

  it('returns a url for the owner', async () => {
    (getOwnerSession as any).mockResolvedValue({ email: 'owner@akira.com' });
    const res = await POST(reqWith({ name: 'A', email: 'a@b.com' }));
    expect(res.status).toBe(200);
    expect((await res.json()).url).toContain('/onboarding/');
  });

  it('500 when createInvite throws', async () => {
    (getOwnerSession as any).mockResolvedValue({ email: 'owner@akira.com' });
    (createInvite as any).mockRejectedValue(new Error('db down'));
    const res = await POST(reqWith({ name: 'A', email: 'a@b.com' }));
    expect(res.status).toBe(500);
  });
});
