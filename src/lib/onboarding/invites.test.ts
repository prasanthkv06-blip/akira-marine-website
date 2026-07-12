import { describe, it, expect } from 'vitest';
import { generateInviteToken, isInviteUsable } from './invites';
import type { InviteRow } from './types';

const base: InviteRow = {
  id: '1', token: 't', invitee_name: 'A', invitee_email: 'a@b.com',
  status: 'pending', created_at: '2026-01-01T00:00:00Z',
  expires_at: '2026-01-15T00:00:00Z', used_at: null,
};
const now = new Date('2026-01-10T00:00:00Z');

describe('generateInviteToken', () => {
  it('is url-safe and long', () => {
    const t = generateInviteToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]{32,}$/);
  });
  it('is unique across calls', () => {
    expect(generateInviteToken()).not.toBe(generateInviteToken());
  });
});

describe('isInviteUsable', () => {
  it('true for pending, unexpired, unused', () => {
    expect(isInviteUsable(base, now)).toBe(true);
  });
  it('false when used', () => {
    expect(isInviteUsable({ ...base, status: 'used', used_at: '2026-01-05T00:00:00Z' }, now)).toBe(false);
  });
  it('false when expired', () => {
    expect(isInviteUsable({ ...base, expires_at: '2026-01-05T00:00:00Z' }, now)).toBe(false);
  });
});
