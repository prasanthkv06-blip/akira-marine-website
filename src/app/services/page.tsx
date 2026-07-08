import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { services } from '@/data/services';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Dual-Fuel Marine Engine Field Service',
  description: 'Maximise the reliability of your LNG-powered vessels with specialised dual-fuel engine maintenance, overhauls, and emergency field response.',
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
        image={{ src: "/images/engine-room.jpg", alt: "Interior of a ship engine room with pipework and machinery" }}
      />

      <section className="bg-white py-16 sm:py-24">
        <Container>
          {services.map((service, index) => {
            const flip = index % 2 === 1;
            return (
              <article
                key={service.id}
                id={service.id}
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
                      {service.title}
                    </h2>
                    <p className="mt-4 leading-relaxed text-[var(--color-ink-100)]">{service.shortDescription}</p>
                  </div>

                  <div className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`}>
                    <p className="text-lg leading-relaxed text-[var(--color-ink-200)]">{service.fullDescription}</p>
                    <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                      {service.features.map((feature) => (
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

      <CTABanner
        headline="Need immediate engine support?"
        description="Tell us your engine platform and port of call. We'll mobilise the right technicians and respond with scope, timeline, and a documented plan."
        buttonText="Contact Us Now"
      />
    </>
  );
}
