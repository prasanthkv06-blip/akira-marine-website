import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { VisionMission } from '@/components/about/VisionMission';
import { CTABanner } from '@/components/sections/CTABanner';
import { PageHero } from '@/components/layout/PageHero';
import { MediaSplit } from '@/components/marine/MediaSplit';
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
        image={{ src: "/images/engine-overhaul.jpg", alt: "Close-up of an engineer's hands working on engine components during an overhaul" }}
      />

      {/* Our Story — asymmetric editorial */}
      <section className="bg-white py-24 sm:py-32">
        <MediaSplit
          src="/images/marine-engine-df.jpg"
          alt="Medium-speed dual-fuel four-stroke marine engine — the core platform we service"
          aspect="4 / 3"
          fit="contain"
          surface="bg-[var(--color-paper-50)]"
        >
          <span className="eyebrow text-[var(--color-signal-400)]">Our Story</span>
          <h2 className="mt-6 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold leading-[1.06] tracking-tight text-[var(--color-ink-400)]">
            Founded to bridge the gap between advanced marine technology and practical on-site execution.
          </h2>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-[var(--color-ink-100)]">
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
        </MediaSplit>
      </section>

      {/* Vision & Mission */}
      <section className="bg-[var(--color-paper-50)] py-24 sm:py-32">
        <Container>
          <span className="eyebrow text-[var(--color-signal-400)]">Foundations</span>
          <h2 className="mb-16 mt-6 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold tracking-tight text-[var(--color-ink-400)]">
            Vision &amp; Mission
          </h2>
          <VisionMission />
        </Container>
      </section>

      <CTABanner />
    </>
  );
}
