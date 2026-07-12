import { describe, it, expect, beforeEach } from 'vitest';
import { isOwnerEmail } from './owner';

describe('isOwnerEmail', () => {
  beforeEach(() => { process.env.ADMIN_OWNER_EMAIL = 'Owner@Akira.com'; });
  it('matches case-insensitively', () => { expect(isOwnerEmail('owner@akira.com')).toBe(true); });
  it('rejects a different email', () => { expect(isOwnerEmail('someone@else.com')).toBe(false); });
  it('rejects null/empty', () => { expect(isOwnerEmail(null)).toBe(false); expect(isOwnerEmail('')).toBe(false); });
});
