import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { engineModels } from '@/data/technical-specs';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Technical Expertise',
  description: 'Deep technical knowledge of medium-speed dual-fuel platforms, electronic engine controls, and LNG fuel handling systems.',
  path: '/expertise/technical',
});

export default function TechnicalPage() {
  return (
    <>
      <PageHero
        eyebrow="Technical · Platforms"
        title="Deep technical knowledge of"
        accent="dual-fuel engine platforms."
        lede="Three power classes, one operating standard. Comprehensive fluency in the fuel systems, electronic controls, and combustion dynamics that keep them turning at sea."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dual-Fuel Specialists', href: '/expertise' },
          { label: 'Technical Expertise', href: '/expertise/technical' },
        ]}
        image={{ src: "/images/marine-engine-cylinders.jpg", alt: "Cylinder heads and fuel lines of a dual-fuel marine engine" }}
      />

      {/* Engine platforms */}
      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <span className="eyebrow text-[var(--color-signal-400)]">Platforms Serviced</span>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-[var(--color-ink-400)]">
            The full range of 4-stroke dual-fuel marine engines.
          </h2>

          <div className="mt-16 grid gap-x-12 gap-y-16 lg:grid-cols-3">
            {engineModels.map((engine) => (
              <div key={engine.id}>
                <h3 className="text-[1.7rem] font-semibold leading-tight tracking-tight text-[var(--color-ink-400)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {engine.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-100)]">{engine.type}</p>
                <p className="mt-5 leading-relaxed text-[var(--color-ink-200)]">{engine.description}</p>

                <dl className="mt-8">
                  {[
                    { k: 'Configurations', v: engine.cylinders },
                    { k: 'Power Range', v: engine.power },
                    { k: 'Speed', v: engine.speed },
                  ].map(({ k, v }) => (
                    <div
                      key={k}
                      className="flex items-baseline justify-between gap-6 border-b border-[rgba(23,25,27,0.10)] py-4"
                    >
                      <dt className="eyebrow font-medium text-[var(--color-steel-400)]">{k}</dt>
                      <dd className="tabular text-right text-[15px] font-medium text-[var(--color-ink-400)]">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-ink-200)]">
                  {engine.fuelModes.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
