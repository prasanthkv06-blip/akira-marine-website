import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Dual-Fuel Engine Expertise',
  description: 'Discover our specialized expertise in dual-fuel 4-stroke marine engine maintenance, technical capabilities, and the standards we work to.',
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
        image={{ src: '/images/engine-room.jpg', alt: 'Interior of a ship engine room with pipework and machinery' }}
      />

      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="mx-auto grid max-w-4xl gap-x-16 gap-y-16 md:grid-cols-2">
            {expertiseAreas.map((area) => (
              <Link key={area.href} href={area.href} className="group block">
                <div
                  className="tabular text-3xl font-semibold text-[var(--color-steel-200)] transition-colors duration-300 group-hover:text-[var(--color-signal-400)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {area.num}
                </div>
                <h2 className="mt-6 text-[clamp(1.5rem,2.4vw,1.9rem)] font-semibold leading-tight tracking-tight text-[var(--color-ink-400)]">
                  {area.title}
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-[var(--color-ink-100)]">
                  {area.description}
                </p>
                <span className="mt-6 inline-block text-sm font-medium text-[var(--color-ink-400)] underline decoration-[var(--color-steel-200)] decoration-1 underline-offset-[6px] transition-colors group-hover:text-[var(--color-signal-400)] group-hover:decoration-[var(--color-signal-400)]">
                  Learn more
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
