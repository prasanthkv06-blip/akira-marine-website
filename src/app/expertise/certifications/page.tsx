import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { FadeIn } from '@/components/animations/FadeIn';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { certifications } from '@/data/certifications';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'Standards & Training',
  description: 'The engineering and safety standards our dual-fuel field service is built around, and the continuous training behind it.',
  path: '/expertise/certifications',
});

export default function CertificationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Standards · Practice"
        title="The standards our"
        accent="work is built on."
        lede="The recognised engineering and safety standards our dual-fuel field service follows — and the continuous professional development that keeps every engineer current."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Dual-Fuel Specialists', href: '/expertise' },
          { label: 'Standards & Training', href: '/expertise/certifications' },
        ]}
        image={{ src: "/images/tanker-at-sea.jpg", alt: "Aerial view of a tanker under way at sea" }}
      />

      <section className="py-24 sm:py-32 bg-white">
        <Container>
          <div>
            <span className="eyebrow text-[var(--color-signal-400)]">Standards We Work To</span>
            <h2 className="mt-5 text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-[var(--color-ink-400)]">
              Built around recognised maritime and engineering standards.
            </h2>
          </div>

          <div className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, index) => (
              <FadeIn key={cert.id} delay={index * 0.08}>
                <div>
                  <h3 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-[var(--color-ink-400)]">
                    {cert.name}
                  </h3>
                  <p className="mt-2 eyebrow text-[var(--color-signal-400)]">
                    {cert.issuer}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-200)]">
                    {cert.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Continuous training */}
      <section className="py-24 sm:py-32 bg-[var(--color-paper-50)]">
        <Container>
          <div>
            <span className="eyebrow text-[var(--color-signal-400)]">Continuous Training</span>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-[var(--color-ink-400)]">
              Every technician boarding your vessel is trained to current standards.
            </h2>
          </div>
          <div className="mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-[var(--color-ink-200)]">
            <p>
              We maintain a rigorous continuous professional development program that ensures
              all field engineers are trained on the latest dual-fuel engine technologies,
              control system updates, and safety procedures.
            </p>
            <p>
              This ongoing training ensures every technician who boards your vessel is trained to
              current dual-fuel engine standards and safety procedures.
            </p>
          </div>
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
