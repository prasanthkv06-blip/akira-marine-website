import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { createMetadata } from '@/lib/metadata';
import { COMPANY, SITE } from '@/lib/constants';

export const metadata: Metadata = createMetadata({
  title: 'Privacy Policy',
  description: `${SITE.name} privacy policy — how we collect, use, and protect your information.`,
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <section className="pt-40 pb-24">
      <Container>
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="gold-rule" />
            <span className="eyebrow">Legal</span>
          </div>
          <h1 className="serif-display text-[clamp(2.25rem,4.6vw,4.25rem)] text-[var(--color-ink-400)] leading-[1.02]">
            Privacy <span className="italic text-[var(--color-signal-400)]">policy.</span>
          </h1>
          <p className="mt-8 text-lg text-[var(--color-ink-100)] leading-relaxed font-light">
            {COMPANY.shortName} respects your privacy. This page outlines how we handle
            information collected through this website and our client engagements.
            A complete policy — covering data collection, storage, third-party
            processors, and your rights under GDPR and applicable UAE law — is
            being finalised by counsel and will be published here shortly.
          </p>
          <p className="mt-6 text-base text-[var(--color-ink-100)] leading-relaxed">
            For privacy questions in the meantime, contact{' '}
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
