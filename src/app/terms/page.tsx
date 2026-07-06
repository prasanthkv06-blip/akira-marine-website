import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { createMetadata } from '@/lib/metadata';
import { COMPANY, SITE } from '@/lib/constants';

export const metadata: Metadata = createMetadata({
  title: 'Terms of Service',
  description: `${SITE.name} terms of service and website use.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <section className="pt-40 pb-24">
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="gold-rule" />
            <span className="eyebrow">Legal</span>
          </div>
          <h1 className="serif-display text-[clamp(2.25rem,4.6vw,4.25rem)] text-[var(--color-ink-400)] leading-[1.02]">
            Terms of <span className="italic text-[var(--color-signal-400)]">service.</span>
          </h1>
          <p className="mt-8 text-lg text-[var(--color-ink-100)] leading-relaxed font-light">
            These terms govern your use of {SITE.url} and any information
            provided through it. Formal service contracts, warranties, and
            liability terms are executed separately for each engagement and
            take precedence over anything on this website.
          </p>
          <p className="mt-6 text-base text-[var(--color-ink-100)] leading-relaxed">
            A full terms document is being finalised by counsel. For contract
            or engagement questions, contact{' '}
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-[var(--color-signal-400)] hover:text-[var(--color-ink-400)] underline underline-offset-4 decoration-[var(--color-signal-400)]"
            >
              {COMPANY.email}
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
