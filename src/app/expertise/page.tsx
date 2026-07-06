import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { ExpertiseSignature } from '@/components/interactive/PageSignatures';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Dual-Fuel Engine Expertise',
  description: 'Discover our specialized expertise in dual-fuel 4-stroke marine engine maintenance, technical capabilities, and industry certifications.',
  path: '/expertise',
});

const expertiseAreas = [
  {
    num: '01',
    title: 'Our Capabilities',
    description: 'Field service, engine overhauls, troubleshooting, and retrofits — all delivered on-site to your vessel.',
    href: '/expertise/capabilities',
  },
  {
    num: '02',
    title: 'Technical Expertise',
    description: 'Deep knowledge of medium-speed dual-fuel platforms, electronic engine controls, and LNG fuel handling systems.',
    href: '/expertise/technical',
  },
];

export default function ExpertisePage() {
  return (
    <>
      <PageHero
        eyebrow="Expertise · Precision"
        title="Deep knowledge, executed to"
        accent="OEM tolerance."
        lede="Two disciplines — Capabilities and Technical Expertise — organised around one operating standard. Diagnosis, execution, documentation."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Dual-Fuel Specialists', href: '/expertise' }]}
        signature={<ExpertiseSignature />}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 max-w-4xl mx-auto">
            {expertiseAreas.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group block relative pt-6 overflow-hidden"
              >
                <span className="absolute top-0 left-0 h-px w-8 bg-[var(--color-signal-400)] transition-all duration-500 group-hover:w-full" />
                <span className="number-outline text-6xl leading-none block">{area.num}</span>
                <h2 className="mt-6 serif-display text-2xl text-[var(--color-ink-400)] leading-tight">
                  {area.title}
                </h2>
                <p className="mt-3 text-[var(--color-ink-100)] leading-relaxed">{area.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--color-ink-200)] group-hover:text-[var(--color-signal-400)] transition-colors">
                  Learn more
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
