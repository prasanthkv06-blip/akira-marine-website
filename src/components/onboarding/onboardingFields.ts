import type { OnboardingSubmission } from '@/lib/onboarding/schema';

/** Text-entry portion of the submission — everything except uploaded paths and consent. */
export type OnboardingFormState = Record<
  Exclude<keyof OnboardingSubmission, 'photoPath' | 'passportFrontPath' | 'passportBackPath' | 'consent' | 'yearsExperience'>,
  string
> & { yearsExperience: string };

export const initialOnboardingForm: OnboardingFormState = {
  fullName: '',
  dateOfBirth: '',
  nationality: '',
  email: '',
  mobile: '',
  addressStreet: '',
  addressCity: '',
  addressCountry: '',
  addressPostcode: '',
  passportNumber: '',
  passportIssuingCountry: '',
  passportPlaceOfIssue: '',
  passportDateOfIssue: '',
  passportDateOfExpiry: '',
  prevEmployer: '',
  prevJobTitle: '',
  prevFrom: '',
  prevTo: '',
  yearsExperience: '',
  referenceName: '',
  referencePhone: '',
};

export interface FieldConfig {
  name: keyof OnboardingFormState;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
}

export interface FieldGroup {
  heading: string;
  fields: FieldConfig[];
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    heading: 'Personal details',
    fields: [
      { name: 'fullName', label: 'Full name', required: true },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
      { name: 'nationality', label: 'Nationality', required: true },
      { name: 'email', label: 'Email address', type: 'email', required: true },
      { name: 'mobile', label: 'Mobile number', type: 'tel', required: true, placeholder: '+971 5X XXX XXXX' },
      { name: 'addressStreet', label: 'Street address', required: true },
      { name: 'addressCity', label: 'City', required: true },
      { name: 'addressCountry', label: 'Country', required: true },
      { name: 'addressPostcode', label: 'Postcode' },
    ],
  },
  {
    heading: 'Passport details',
    fields: [
      { name: 'passportNumber', label: 'Passport number', required: true },
      { name: 'passportIssuingCountry', label: 'Issuing country', required: true },
      { name: 'passportPlaceOfIssue', label: 'Place of issue', required: true },
      { name: 'passportDateOfIssue', label: 'Date of issue', type: 'date', required: true },
      { name: 'passportDateOfExpiry', label: 'Date of expiry', type: 'date', required: true },
    ],
  },
  {
    heading: 'Sea/work experience',
    fields: [
      { name: 'prevEmployer', label: 'Previous employer', required: true },
      { name: 'prevJobTitle', label: 'Previous job title', required: true },
      { name: 'prevFrom', label: 'Employed from', type: 'date', required: true },
      { name: 'prevTo', label: 'Employed to', type: 'date', required: true },
      { name: 'yearsExperience', label: 'Years of experience', type: 'number', required: true },
    ],
  },
  {
    heading: 'Reference',
    fields: [
      { name: 'referenceName', label: 'Reference name', required: true },
      { name: 'referencePhone', label: 'Reference phone', type: 'tel', required: true },
    ],
  },
];
