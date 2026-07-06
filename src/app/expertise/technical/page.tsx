import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { TechnicalSignature } from '@/components/interactive/PageSignatures';
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
        signature={<TechnicalSignature />}
      />

      {/* Engine platforms */}
      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="text-center mb-16">
            <span className="eyebrow">Platforms Serviced</span>
            <h2 className="mt-3 serif-display text-[clamp(2rem,3.5vw,3.25rem)] text-[var(--color-ink-400)] leading-[1.05]">
              The full range of{' '}
              <span className="italic text-[var(--color-signal-400)]">4-stroke dual-fuel</span> marine engines.
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {engineModels.map((engine, i) => (
              <div key={engine.id} className="border border-[rgba(31,27,23,0.12)] bg-[var(--color-paper-50)] overflow-hidden">
                <div className="border-b border-[rgba(31,27,23,0.12)] p-8 text-center">
                  <span className="eyebrow text-[var(--color-signal-400)] text-[0.6rem]">
                    Class 0{i + 1}
                  </span>
                  <h3 className="mt-2 serif-display text-2xl text-[var(--color-ink-400)]">{engine.name}</h3>
                  <p className="mt-1 text-sm text-[var(--color-ink-100)]">{engine.type}</p>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-[var(--color-ink-100)] leading-relaxed">{engine.description}</p>
                  <dl className="space-y-2 text-sm">
                    {[
                      { k: 'Configurations', v: engine.cylinders },
                      { k: 'Power Range', v: engine.power },
                      { k: 'Speed', v: engine.speed },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between border-b border-[rgba(31,27,23,0.06)] pb-2">
                        <dt className="eyebrow text-[var(--color-ink-100)] text-[0.6rem]">{k}</dt>
                        <dd className="text-[var(--color-ink-400)] font-medium font-variant-numeric-tabular">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="pt-2">
                    <p className="eyebrow text-[var(--color-ink-100)] text-[0.6rem] mb-2">Fuel Modes</p>
                    <div className="flex flex-wrap gap-2">
                      {engine.fuelModes.map((mode) => (
                        <Badge key={mode} text={mode} variant="muted" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
