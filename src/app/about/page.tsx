import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { VisionMission } from '@/components/about/VisionMission';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { AboutSignature } from '@/components/interactive/PageSignatures';
import { createMetadata } from '@/lib/metadata';

export const metadata: Metadata = createMetadata({
  title: 'About Us',
  description: 'Learn about Akira Marine Solutions — bridging advanced marine technology with practical, on-site execution for dual-fuel marine engines.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About · AKIRA"
        title="Bridging marine technology with"
        accent="dockside execution."
        lede="A specialist marine engineering firm — founded to close the gap between advanced dual-fuel technology and the workshop-grade discipline required to keep it running at sea."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us', href: '/about' }]}
        signature={<AboutSignature />}
      />

      {/* Our Story — clean paper section */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(31,27,23,0.12), transparent)' }}
        />
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <span className="signal-rule" />
              <span className="eyebrow">Our Story</span>
            </div>
            <h2 className="serif-display text-[clamp(2rem,3.5vw,3.25rem)] text-[var(--color-ink-400)] leading-[1.05]">
              Founded to bridge the gap between{' '}
              <span className="italic text-[var(--color-signal-400)]">advanced marine technology</span>{' '}
              and practical on-site execution.
            </h2>
            <div className="mt-10 space-y-6 text-lg text-[var(--color-ink-100)] leading-relaxed font-light">
              <p>
                Akira Marine Solutions Private Limited was founded to bridge the gap between
                advanced marine technology and practical, on-site execution. As global shipping
                transitions toward cleaner fuels, we have positioned ourselves at the forefront
                by specializing in the field service maintenance of dual-fuel, four-stroke marine engines.
              </p>
              <p>
                The complexity of LNG-powered vessels requires more than just general mechanical
                knowledge; it demands a deep, intrinsic understanding of integrated fuel systems,
                electronic controls, and combustion dynamics.
              </p>
              <p>
                Our team brings the workshop to your vessel, performing precision overhauls,
                diagnostics, and repairs on the world&rsquo;s most sophisticated marine engines —
                ensuring maximum uptime and operational safety.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32 bg-[var(--color-paper-50)]">
        <Container>
          <div className="text-center mb-12">
            <span className="eyebrow">Foundations</span>
            <h2 className="mt-3 serif-display text-[clamp(2rem,3.5vw,3.25rem)] text-[var(--color-ink-400)] leading-[1.05]">
              Vision &amp; <span className="italic text-[var(--color-signal-400)]">Mission</span>
            </h2>
          </div>
          <VisionMission />
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
