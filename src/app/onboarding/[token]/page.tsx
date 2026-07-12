import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { OnboardingForm } from '@/components/onboarding/OnboardingForm';
import { getInviteByToken, isInviteUsable } from '@/lib/onboarding/invites';
import { COMPANY } from '@/lib/constants';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...createMetadata({ title: 'Crew Onboarding', path: '/onboarding' }),
  robots: { index: false, follow: false },
};

interface OnboardingPageProps {
  params: Promise<{ token: string }>;
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const { token } = await params;
  const invite = await getInviteByToken(token);

  if (!invite || !isInviteUsable(invite, new Date())) {
    return (
      <section className="relative bg-[var(--color-paper-50)] pt-36 pb-28 min-h-[70vh] flex items-center">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow block text-[var(--color-signal-400)]">Crew Onboarding</span>
            <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink-400)]">
              This link is no longer valid.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-100)]">
              Please contact Akira Marine Solutions to request a new onboarding link.
            </p>
            <a
              href={`mailto:${COMPANY.email}`}
              className="mt-8 inline-block text-[var(--color-signal-400)] underline underline-offset-4 decoration-[var(--color-signal-400)] hover:text-[var(--color-ink-400)]"
            >
              {COMPANY.email}
            </a>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="pt-36 pb-24 sm:pb-32 bg-white">
      <Container>
        <div className="mx-auto max-w-3xl">
          <span className="eyebrow block text-[var(--color-signal-400)]">Crew Onboarding</span>
          <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink-400)]">
            Let&rsquo;s get your documents in order.
          </h1>
          <div className="mt-12">
            <OnboardingForm token={token} inviteeName={invite.invitee_name} />
          </div>
        </div>
      </Container>
    </section>
  );
}
