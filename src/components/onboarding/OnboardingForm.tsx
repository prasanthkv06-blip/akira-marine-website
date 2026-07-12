'use client';

import { useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormStatus } from '@/components/forms/FormStatus';
import { Button } from '@/components/ui/Button';
import { onboardingSubmissionSchema, type UploadField } from '@/lib/onboarding/schema';
import { FIELD_GROUPS, initialOnboardingForm, type OnboardingFormState } from './onboardingFields';
import { FileDropField } from './FileDropField';

interface OnboardingFormProps {
  token: string;
  inviteeName: string;
}

type Errors = Partial<Record<string, string>>;
type Status = 'idle' | 'loading' | 'success' | 'error';

// ponytail: paths are unknown until upload completes; this placeholder just satisfies
// the storagePath schema so the text fields can be pre-validated before uploading.
const PENDING_PATH = 'pending';
const PATH_KEYS = ['photoPath', 'passportFrontPath', 'passportBackPath'] as const;

async function uploadOnboardingFile(token: string, field: UploadField, file: File): Promise<string> {
  const initRes = await fetch('/api/onboarding/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, file: { field, filename: file.name, contentType: file.type, size: file.size } }),
  });
  if (!initRes.ok) throw new Error('upload-url failed');
  const { uploadUrl, path } = await initRes.json();

  const putRes = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'content-type': file.type } });
  if (!putRes.ok) throw new Error('upload failed');
  return path as string;
}

export function OnboardingForm({ token, inviteeName }: OnboardingFormProps) {
  const [form, setForm] = useState<OnboardingFormState>(initialOnboardingForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [passportFront, setPassportFront] = useState<File | null>(null);
  const [passportBack, setPassportBack] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState<string | undefined>();

  const updateField = (name: keyof OnboardingFormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  function buildPayload(paths: Record<(typeof PATH_KEYS)[number], string>) {
    return {
      ...form,
      yearsExperience: Number(form.yearsExperience),
      ...paths,
      consent: true as const,
    };
  }

  function issuesToErrors(issues: { path: PropertyKey[]; message: string }[]): Errors {
    const next: Errors = {};
    issues.forEach((issue) => {
      next[String(issue.path[0])] = issue.message;
    });
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const fileErrors: Errors = {};
    if (!photo) fileErrors.photo = 'Please attach a photo.';
    if (!passportFront) fileErrors.passportFront = 'Please attach the passport front page.';
    if (!passportBack) fileErrors.passportBack = 'Please attach the passport back page.';
    if (!consent) fileErrors.consent = 'Please confirm you consent before submitting.';

    const draft = buildPayload({ photoPath: PENDING_PATH, passportFrontPath: PENDING_PATH, passportBackPath: PENDING_PATH });
    const preCheck = onboardingSubmissionSchema.safeParse(draft);
    const textErrors = preCheck.success
      ? {}
      : issuesToErrors(preCheck.error.issues.filter((i) => !PATH_KEYS.includes(i.path[0] as (typeof PATH_KEYS)[number])));

    const combined = { ...textErrors, ...fileErrors };
    if (Object.keys(combined).length > 0) {
      setErrors(combined);
      setStatus('error');
      setStatusMessage('Please fix the highlighted fields.');
      return;
    }

    setStatus('loading');
    setStatusMessage('Uploading documents…');
    try {
      const [photoPath, passportFrontPath, passportBackPath] = await Promise.all([
        uploadOnboardingFile(token, 'photo', photo!),
        uploadOnboardingFile(token, 'passportFront', passportFront!),
        uploadOnboardingFile(token, 'passportBack', passportBack!),
      ]);

      const payload = buildPayload({ photoPath, passportFrontPath, passportBackPath });
      const finalCheck = onboardingSubmissionSchema.safeParse(payload);
      if (!finalCheck.success) {
        setErrors(issuesToErrors(finalCheck.error.issues));
        setStatus('error');
        setStatusMessage('Please fix the highlighted fields.');
        return;
      }

      setStatusMessage('Submitting…');
      const res = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, data: finalCheck.data }),
      });

      if (res.status === 201) {
        setStatus('success');
        setStatusMessage('Thank you — your details have been submitted securely.');
        return;
      }
      if (res.status === 403) {
        setStatus('error');
        setStatusMessage('This link is no longer valid — please contact Akira Marine Solutions.');
        return;
      }
      const body = await res.json().catch(() => null);
      setStatus('error');
      setStatusMessage(body?.error ?? 'Something went wrong. Please try again.');
    } catch {
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return <FormStatus status="success" message={statusMessage} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-14" noValidate>
      <p className="text-lg text-[var(--color-ink-100)] leading-relaxed">
        Welcome, {inviteeName}. Please complete the details below so we can prepare your joining documents.
      </p>

      {FIELD_GROUPS.map((group) => (
        <fieldset key={group.heading} className="m-0 w-full border-0 p-0">
          <legend className="eyebrow mb-6 text-[var(--color-signal-400)]">{group.heading}</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            {group.fields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                required={field.required}
                error={errors[field.name]}
                value={form[field.name]}
                onChange={updateField(field.name)}
              />
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset className="m-0 w-full border-0 p-0">
        <legend className="eyebrow mb-6 text-[var(--color-signal-400)]">Documents</legend>
        <div className="grid gap-6 sm:grid-cols-2">
          <FileDropField label="Photo" name="photo" required error={errors.photo} onChange={setPhoto} />
          <FileDropField
            label="Passport — front page"
            name="passportFront"
            required
            error={errors.passportFront}
            onChange={setPassportFront}
          />
          <FileDropField
            label="Passport — back page"
            name="passportBack"
            required
            error={errors.passportBack}
            onChange={setPassportBack}
          />
        </div>
      </fieldset>

      <section>
        <div className="flex items-start gap-3">
          <input
            id="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              setErrors((prev) => {
                if (!('consent' in prev)) return prev;
                const next = { ...prev };
                delete next.consent;
                return next;
              });
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? 'consent-error' : 'consent-note'}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-signal-400)]"
          />
          <label htmlFor="consent" className="text-sm text-[var(--color-ink-200)] leading-relaxed">
            I consent to Akira Marine Solutions collecting and storing the personal details and
            documents submitted here for the purpose of onboarding and crew documentation.
          </label>
        </div>
        <p id="consent-note" className="mt-2 ml-7 text-xs text-[var(--color-steel-400)]">
          Your documents are stored securely and only used for onboarding purposes.
        </p>
        {errors.consent && (
          <p id="consent-error" className="mt-1 ml-7 text-sm text-red-600 font-sans">{errors.consent}</p>
        )}
      </section>

      <FormStatus status={status} message={statusMessage} />

      <Button type="submit" variant="primary" size="lg" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? 'Submitting…' : 'Submit details'}
      </Button>
    </form>
  );
}
