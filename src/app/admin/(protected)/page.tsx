import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { InviteForm } from '@/components/admin/InviteForm';
import { listInvites } from '@/lib/onboarding/invites';
import { createMetadata } from '@/lib/metadata';
import type { InviteRow } from '@/lib/onboarding/types';

export const metadata: Metadata = {
  ...createMetadata({ title: 'Invites', path: '/admin' }),
  robots: { index: false, follow: false },
};

function statusBadgeClass(status: InviteRow['status']): string {
  if (status === 'used') return 'bg-green-50 text-green-800';
  if (status === 'expired') return 'bg-red-50 text-red-800';
  return 'bg-[var(--color-paper-50)] text-[var(--color-ink-200)]';
}

export default async function AdminInvitesPage() {
  const invites = await listInvites();

  return (
    <section className="pt-36 pb-24 sm:pb-32 bg-white">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <span className="eyebrow block text-[var(--color-signal-400)]">Admin</span>
            <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink-400)]">
              Crew invites
            </h1>
          </div>
          <Link
            href="/admin/submissions"
            className="text-sm font-medium text-[var(--color-signal-400)] underline underline-offset-4 hover:text-[var(--color-ink-400)]"
          >
            View submissions →
          </Link>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[380px_1fr]">
          <InviteForm />

          <div>
            <h2 className="eyebrow mb-6 text-[var(--color-signal-400)]">Recent invites</h2>
            {invites.length === 0 ? (
              <p className="text-[var(--color-ink-100)]">No invites yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(31,27,23,0.12)] text-[var(--color-steel-400)]">
                      <th className="py-3 pr-4 font-sans font-medium">Name</th>
                      <th className="py-3 pr-4 font-sans font-medium">Email</th>
                      <th className="py-3 pr-4 font-sans font-medium">Status</th>
                      <th className="py-3 pr-4 font-sans font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.map((invite) => (
                      <tr key={invite.id} className="border-b border-[rgba(31,27,23,0.06)]">
                        <td className="py-3 pr-4 text-[var(--color-ink-400)]">{invite.invitee_name}</td>
                        <td className="py-3 pr-4 text-[var(--color-ink-200)]">{invite.invitee_email}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-sans font-medium ${statusBadgeClass(invite.status)}`}>
                            {invite.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-[var(--color-ink-100)]">
                          {new Date(invite.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
