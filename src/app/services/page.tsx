import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { ServicesSignature } from '@/components/interactive/PageSignatures';
import { services } from '@/data/services';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Dual-Fuel Marine Engine Field Service',
  description: 'Maximize the reliability of your LNG-powered vessels with specialized dual-fuel engine maintenance, overhauls, and 24/7 emergency support.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services · 4 Lines"
        title="Onboard expertise for"
        accent="dual-fuel 4-stroke marine engines."
        lede="Four service lines executed to OEM specification. Every intervention planned, precise, and fully documented — no dry-docking required."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]}
        signature={<ServicesSignature />}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div className="space-y-24">
            {services.map((service, index) => (
              <div key={service.id} id={service.id} className="scroll-mt-24">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                  <div className="lg:col-span-4">
                    <span className="number-outline text-6xl leading-none block">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-6 serif-display text-[clamp(1.75rem,3vw,2.5rem)] text-[var(--color-ink-400)] leading-[1.1]">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-[var(--color-ink-100)] leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="text-[var(--color-ink-200)] text-lg leading-relaxed mb-8 font-light">
                      {service.fullDescription}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-[var(--color-ink-200)]">
                          <span className="mt-2 h-px w-4 bg-[var(--color-signal-400)] shrink-0" />
                          <span className="text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {index < services.length - 1 && (
                  <div className="mt-16 h-px bg-[rgba(31,27,23,0.12)]" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTABanner
        headline="Need immediate engine support?"
        description="Our 24/7 emergency response team is ready to mobilize to any port worldwide."
        buttonText="Contact Us Now"
      />
    </>
  );
}
