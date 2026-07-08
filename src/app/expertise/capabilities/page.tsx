import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { capabilities } from '@/data/capabilities';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Our Capabilities',
  description: 'Field service, engine overhauls, troubleshooting, and retrofits for dual-fuel 4-stroke marine engines.',
  path: '/expertise/capabilities',
});

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities · Field Grade"
        title="On-site service, executed to"
        accent="OEM specification."
        lede="Comprehensive workshop-grade capability delivered directly to your vessel — from planned service to emergency mobilisation."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dual-Fuel Specialists', href: '/expertise' },
          { label: 'Our Capabilities', href: '/expertise/capabilities' },
        ]}
        image={{ src: "/images/shipyard.jpg", alt: "Ships and cranes at an industrial shipyard quay" }}
      />

      <section className="bg-white py-16 sm:py-24">
        <Container>
          {capabilities.map((cap, index) => {
            const flip = index % 2 === 1;
            return (
              <article
                key={cap.id}
                id={cap.id}
                className="scroll-mt-28 border-t border-[rgba(23,25,27,0.12)] py-16 first:border-t-0 sm:py-20"
              >
                <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
                  <div className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                    <div
                      className="tabular text-6xl font-extrabold leading-none text-[var(--color-steel-200)]"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h2 className="mt-6 text-[clamp(1.7rem,2.8vw,2.4rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-ink-400)]">
                      {cap.title}
                    </h2>
                  </div>

                  <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                    <p className="text-lg leading-relaxed text-[var(--color-ink-200)]">{cap.description}</p>
                    <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                      {cap.features.map((feature) => (
                        <li key={feature} className="text-[15px] leading-relaxed text-[var(--color-ink-200)]">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
