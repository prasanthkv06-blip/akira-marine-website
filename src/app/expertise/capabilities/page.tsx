import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { CapabilitiesSignature } from '@/components/interactive/PageSignatures';
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
        signature={<CapabilitiesSignature />}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="space-y-20">
            {capabilities.map((cap, index) => (
              <div key={cap.id}>
                <div className="grid items-start gap-12 lg:grid-cols-12">
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <span className="number-outline text-6xl leading-none">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-6 serif-display text-2xl text-[var(--color-ink-400)] leading-tight">
                      {cap.title}
                    </h2>
                    <p className="mt-4 text-[var(--color-ink-100)] leading-relaxed">{cap.description}</p>
                  </div>
                  <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <ul className="space-y-3">
                      {cap.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <span className="mt-2 h-px w-4 bg-[var(--color-signal-400)] shrink-0" />
                          <span className="text-[var(--color-ink-200)]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {index < capabilities.length - 1 && (
                  <div className="mt-16 h-px bg-[rgba(31,27,23,0.12)]" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
