import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { DeleteSubmissionButton } from '@/components/admin/DeleteSubmissionButton';
import { getSubmission, signDownloadUrl } from '@/lib/onboarding/submissions';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...createMetadata({ title: 'Submission', path: '/admin/submissions' }),
  robots: { index: false, follow: false },
};

interface SubmissionDetailPageProps {
  params: Promise<{ id: string }>;
}

const FIELD_GROUPS: Array<{ heading: string; fields: Array<{ key: string; label: string }> }> = [
  {
    heading: 'Personal',
    fields: [
      { key: 'full_name', label: 'Full name' },
      { key: 'date_of_birth', label: 'Date of birth' },
      { key: 'nationality', label: 'Nationality' },
      { key: 'email', label: 'Email' },
      { key: 'mobile', label: 'Mobile' },
    ],
  },
  {
    heading: 'Address',
    fields: [
      { key: 'address_street', label: 'Street' },
      { key: 'address_city', label: 'City' },
      { key: 'address_country', label: 'Country' },
      { key: 'address_postcode', label: 'Postcode' },
    ],
  },
  {
    heading: 'Passport',
    fields: [
      { key: 'passport_number', label: 'Passport number' },
      { key: 'passport_issuing_country', label: 'Issuing country' },
      { key: 'passport_place_of_issue', label: 'Place of issue' },
      { key: 'passport_date_of_issue', label: 'Date of issue' },
      { key: 'passport_date_of_expiry', label: 'Date of expiry' },
    ],
  },
  {
    heading: 'Previous employment',
    fields: [
      { key: 'prev_employer', label: 'Employer' },
      { key: 'prev_job_title', label: 'Job title' },
      { key: 'prev_from', label: 'From' },
      { key: 'prev_to', label: 'To' },
      { key: 'years_experience', label: 'Years of experience' },
    ],
  },
  {
    heading: 'Reference',
    fields: [
      { key: 'reference_name', label: 'Name' },
      { key: 'reference_phone', label: 'Phone' },
    ],
  },
  {
    heading: 'Next of kin',
    fields: [
      { key: 'nok_name', label: 'Name' },
      { key: 'nok_relationship', label: 'Relationship' },
      { key: 'nok_address', label: 'Address' },
      { key: 'nok_contact', label: 'Mobile / Email' },
      { key: 'insurance_beneficiary', label: 'Insurance beneficiary' },
    ],
  },
  {
    heading: 'Bank account (USD salary)',
    fields: [
      { key: 'bank_beneficiary_name', label: 'Beneficiary name' },
      { key: 'bank_name', label: 'Bank name' },
      { key: 'bank_branch', label: 'Branch' },
      { key: 'bank_address', label: 'Bank address' },
      { key: 'bank_account_number', label: 'Account number' },
      { key: 'bank_swift', label: 'SWIFT code' },
      { key: 'bank_currency', label: 'Currency' },
    ],
  },
];

function renderValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

export default async function SubmissionDetailPage({ params }: SubmissionDetailPageProps) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  const docs = [
    { label: 'Photo', path: submission.photo_path },
    { label: 'Passport — front page', path: submission.passport_front_path },
    { label: 'Passport — back page', path: submission.passport_back_path },
  ];
  // ponytail: allSettled so one missing/deleted file can't 500 the whole detail page —
  // the owner still needs to see and act on the rest of the submission.
  const signedResults = await Promise.allSettled(docs.map((d) => signDownloadUrl(d.path)));

  return (
    <section className="pt-36 pb-24 sm:pb-32 bg-white">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="eyebrow block text-[var(--color-signal-400)]">Submission</span>
            <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink-400)]">
              {submission.full_name}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-ink-100)]">
              Submitted {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
          <DeleteSubmissionButton id={submission.id} />
        </div>

        <div className="mt-12 grid gap-12 sm:grid-cols-2">
          {FIELD_GROUPS.map((group) => (
            <div key={group.heading}>
              <h2 className="eyebrow mb-4 text-[var(--color-signal-400)]">{group.heading}</h2>
              <dl className="space-y-3">
                {group.fields.map((field) => (
                  <div key={field.key}>
                    <dt className="text-xs font-sans font-medium uppercase tracking-wide text-[var(--color-steel-400)]">
                      {field.label}
                    </dt>
                    <dd className="mt-0.5 text-[var(--color-ink-400)]">{renderValue(submission[field.key])}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="eyebrow mb-4 text-[var(--color-signal-400)]">Documents</h2>
          <ul className="space-y-2">
            {docs.map((doc, i) => {
              const result = signedResults[i];
              const url = result.status === 'fulfilled' ? result.value : null;
              return (
                <li key={doc.path}>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-signal-400)] underline underline-offset-4 hover:text-[var(--color-ink-400)]"
                    >
                      {doc.label} — view / download
                    </a>
                  ) : (
                    <span className="text-[var(--color-ink-100)]">{doc.label} — unavailable</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-16">
          <Button href="/admin/submissions" variant="outline">Back to submissions</Button>
        </div>
      </Container>
    </section>
  );
}
