import { describe, it, expect } from 'vitest';
import { onboardingSubmissionSchema, fileMetaSchema, FILE_CONSTRAINTS } from './schema';

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
};

describe('onboardingSubmissionSchema', () => {
  it('accepts a fully valid submission', () => {
    expect(onboardingSubmissionSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects a bad email', () => {
    expect(onboardingSubmissionSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });
  it('rejects missing required field', () => {
    const { fullName, ...rest } = valid;
    expect(onboardingSubmissionSchema.safeParse(rest).success).toBe(false);
  });
  it('rejects when consent is false', () => {
    expect(onboardingSubmissionSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
  });
});

describe('fileMetaSchema', () => {
  it('rejects oversized files', () => {
    const r = fileMetaSchema.safeParse({ field: 'photo', filename: 'a.jpg', contentType: 'image/jpeg', size: FILE_CONSTRAINTS.maxBytes + 1 });
    expect(r.success).toBe(false);
  });
  it('rejects disallowed content types', () => {
    const r = fileMetaSchema.safeParse({ field: 'photo', filename: 'a.exe', contentType: 'application/x-msdownload', size: 100 });
    expect(r.success).toBe(false);
  });
  it('accepts a valid pdf under the limit', () => {
    const r = fileMetaSchema.safeParse({ field: 'passportFront', filename: 'p.pdf', contentType: 'application/pdf', size: 1000 });
    expect(r.success).toBe(true);
  });
});
