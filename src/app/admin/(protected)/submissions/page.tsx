import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { listSubmissions } from '@/lib/onboarding/submissions';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...createMetadata({ title: 'Submissions', path: '/admin/submissions' }),
  robots: { index: false, follow: false },
};

export default async function AdminSubmissionsPage() {
  const submissions = await listSubmissions();

  return (
    <section className="pt-36 pb-24 sm:pb-32 bg-white">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="eyebrow block text-[var(--color-signal-400)]">Admin</span>
            <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink-400)]">
              Submissions
            </h1>
          </div>
          <Link
            href="/admin"
            className="text-sm font-medium text-[var(--color-signal-400)] underline underline-offset-4 hover:text-[var(--color-ink-400)]"
          >
            ← Invites
          </Link>
        </div>

        <div className="mt-12">
          {submissions.length === 0 ? (
            <p className="text-[var(--color-ink-100)]">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[rgba(31,27,23,0.12)] text-[var(--color-steel-400)]">
                    <th className="py-3 pr-4 font-sans font-medium">Name</th>
                    <th className="py-3 pr-4 font-sans font-medium">Submitted</th>
                    <th className="py-3 pr-4 font-sans font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s) => (
                    <tr key={s.id} className="border-b border-[rgba(31,27,23,0.06)]">
                      <td className="py-3 pr-4 text-[var(--color-ink-400)]">{s.full_name}</td>
                      <td className="py-3 pr-4 text-[var(--color-ink-100)]">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/admin/submissions/${s.id}`}
                          className="text-[var(--color-signal-400)] underline underline-offset-4 hover:text-[var(--color-ink-400)]"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
