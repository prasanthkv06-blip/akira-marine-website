import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/onboarding/invites', () => ({
  getInviteByToken: vi.fn(),
  isInviteUsable: vi.fn(() => true),
  markInviteUsed: vi.fn(),
}));
vi.mock('@/lib/onboarding/submissions', async (orig) => ({
  ...(await orig<any>()),
  createSubmission: vi.fn(async () => ({ id: 'sub-1' })),
}));
vi.mock('@/lib/onboarding/notify', () => ({ sendSubmissionNotification: vi.fn() }));

import { POST } from './route';
import { getInviteByToken, markInviteUsed } from '@/lib/onboarding/invites';

const valid = {
  fullName: 'John Smith', dateOfBirth: '1990-05-01', nationality: 'Indian',
  email: 'john@example.com', mobile: '+971500000000',
  addressStreet: '1 Road', addressCity: 'Abu Dhabi', addressCountry: 'UAE', addressPostcode: '',
  passportNumber: 'A1234567', passportIssuingCountry: 'India', passportPlaceOfIssue: 'Delhi',
  passportDateOfIssue: '2018-01-01', passportDateOfExpiry: '2028-01-01',
  prevEmployer: 'Acme', prevJobTitle: 'Engineer', prevFrom: '2015-01-01', prevTo: '2020-01-01',
  yearsExperience: 5, referenceName: 'Jane', referencePhone: '+911111111111',
  photoPath: 'onboarding/abc/photo-1.jpg',
  passportFrontPath: 'onboarding/abc/passport_front-1.jpg',
  passportBackPath: 'onboarding/abc/passport_back-1.jpg',
  consent: true,
} as any;

function reqWith(payload: unknown) {
  return new Request('http://x/api/onboarding/submit', { method: 'POST', body: JSON.stringify(payload) });
}

describe('POST /api/onboarding/submit', () => {
  beforeEach(() => vi.clearAllMocks());
  it('403 when the token is invalid', async () => {
    (getInviteByToken as any).mockResolvedValue(null);
    const res = await POST(reqWith({ token: 'bad', data: valid }));
    expect(res.status).toBe(403);
  });
  it('422 when the body is invalid', async () => {
    (getInviteByToken as any).mockResolvedValue({ id: 'abc' });
    const res = await POST(reqWith({ token: 't', data: { ...valid, email: 'no' } }));
    expect(res.status).toBe(422);
  });
  it('201 and marks invite used on the happy path', async () => {
    (getInviteByToken as any).mockResolvedValue({ id: 'abc' });
    const good = { ...valid, photoPath: 'onboarding/abc/photo-1.jpg',
      passportFrontPath: 'onboarding/abc/passport_front-1.jpg',
      passportBackPath: 'onboarding/abc/passport_back-1.jpg' };
    const res = await POST(reqWith({ token: 't', data: good }));
    expect(res.status).toBe(201);
    expect(markInviteUsed).toHaveBeenCalledWith('abc');
  });
});
