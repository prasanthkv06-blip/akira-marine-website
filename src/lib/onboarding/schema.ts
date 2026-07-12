import { z } from 'zod';

export const FILE_CONSTRAINTS = {
  maxBytes: 10 * 1024 * 1024,
  accept: ['image/jpeg', 'image/png', 'image/heic', 'application/pdf'],
} as const;

export const UPLOAD_FIELDS = ['photo', 'passportFront', 'passportBack'] as const;
export type UploadField = (typeof UPLOAD_FIELDS)[number];

export const fileMetaSchema = z.object({
  field: z.enum(UPLOAD_FIELDS),
  filename: z.string().min(1).max(200),
  contentType: z.string().refine((t) => FILE_CONSTRAINTS.accept.includes(t), 'Unsupported file type'),
  size: z.number().int().positive().max(FILE_CONSTRAINTS.maxBytes, 'File too large (max 10 MB)'),
});
export type FileMeta = z.infer<typeof fileMetaSchema>;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date');
const storagePath = z.string().min(1).max(300);

export const onboardingSubmissionSchema = z.object({
  fullName: z.string().min(1).max(120),
  dateOfBirth: isoDate,
  nationality: z.string().min(1).max(60),
  email: z.string().email(),
  mobile: z.string().min(5).max(30),
  addressStreet: z.string().min(1).max(160),
  addressCity: z.string().min(1).max(80),
  addressCountry: z.string().min(1).max(80),
  addressPostcode: z.string().max(20).optional().or(z.literal('')),
  passportNumber: z.string().min(3).max(20),
  passportIssuingCountry: z.string().min(1).max(60),
  passportPlaceOfIssue: z.string().min(1).max(80),
  passportDateOfIssue: isoDate,
  passportDateOfExpiry: isoDate,
  prevEmployer: z.string().min(1).max(120),
  prevJobTitle: z.string().min(1).max(120),
  prevFrom: isoDate,
  prevTo: isoDate,
  yearsExperience: z.number().min(0).max(70),
  referenceName: z.string().min(1).max(120),
  referencePhone: z.string().min(5).max(30),
  photoPath: storagePath,
  passportFrontPath: storagePath,
  passportBackPath: storagePath,
  consent: z.literal(true),
});
export type OnboardingSubmission = z.infer<typeof onboardingSubmissionSchema>;
