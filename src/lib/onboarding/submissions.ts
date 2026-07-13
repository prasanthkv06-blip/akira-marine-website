import { getAdminClient } from '@/lib/supabase/admin';
import type { OnboardingSubmission } from './schema';
import type { SubmissionRow } from './types';

const BUCKET = 'onboarding-docs';

export function pathBelongsToInvite(path: string, inviteId: string): boolean {
  if (path.includes('..')) return false;
  return path.startsWith(`onboarding/${inviteId}/`);
}

export async function createSubmission(inviteId: string, d: OnboardingSubmission) {
  const db = getAdminClient();
  const { data, error } = await db.from('submissions').insert({
    invite_id: inviteId,
    full_name: d.fullName,
    date_of_birth: d.dateOfBirth,
    nationality: d.nationality,
    email: d.email,
    mobile: d.mobile,
    address_street: d.addressStreet,
    address_city: d.addressCity,
    address_country: d.addressCountry,
    address_postcode: d.addressPostcode || null,
    passport_number: d.passportNumber,
    passport_issuing_country: d.passportIssuingCountry,
    passport_place_of_issue: d.passportPlaceOfIssue,
    passport_date_of_issue: d.passportDateOfIssue,
    passport_date_of_expiry: d.passportDateOfExpiry,
    prev_employer: d.prevEmployer,
    prev_job_title: d.prevJobTitle,
    prev_from: d.prevFrom,
    prev_to: d.prevTo,
    years_experience: d.yearsExperience,
    reference_name: d.referenceName,
    reference_phone: d.referencePhone,
    nok_name: d.nokName,
    nok_relationship: d.nokRelationship,
    nok_address: d.nokAddress,
    nok_contact: d.nokContact,
    insurance_beneficiary: d.insuranceBeneficiary,
    bank_beneficiary_name: d.bankBeneficiaryName,
    bank_name: d.bankName,
    bank_branch: d.bankBranch,
    bank_address: d.bankAddress,
    bank_account_number: d.bankAccountNumber,
    bank_swift: d.bankSwift,
    bank_currency: d.bankCurrency,
    photo_path: d.photoPath,
    passport_front_path: d.passportFrontPath,
    passport_back_path: d.passportBackPath,
    consent_at: new Date().toISOString(),
  }).select('id').single();
  if (error) throw new Error(`createSubmission failed: ${error.message}`);
  return { id: data.id as string };
}

export async function listSubmissions(): Promise<Array<{ id: string; full_name: string; created_at: string }>> {
  const db = getAdminClient();
  const { data, error } = await db.from('submissions')
    .select('id, full_name, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Array<{ id: string; full_name: string; created_at: string }>;
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  const db = getAdminClient();
  const { data, error } = await db.from('submissions').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(`getSubmission failed: ${error.message}`);
  return (data as SubmissionRow) ?? null;
}

export async function signDownloadUrl(path: string): Promise<string> {
  const db = getAdminClient();
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error || !data) throw new Error(`signDownloadUrl failed: ${error?.message}`);
  return data.signedUrl;
}

export async function deleteSubmission(id: string): Promise<void> {
  const db = getAdminClient();
  const row = await getSubmission(id);
  if (!row) return;
  const { error: storageError } = await db.storage.from(BUCKET)
    .remove([row.photo_path, row.passport_front_path, row.passport_back_path]);
  if (storageError) throw new Error(`deleteSubmission (storage) failed: ${storageError.message}`);
  const { error } = await db.from('submissions').delete().eq('id', id);
  if (error) throw new Error(`deleteSubmission (row) failed: ${error.message}`);
}
