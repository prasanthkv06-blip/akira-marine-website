'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/animations/Reveal';
import { MagneticButton } from '@/components/interactive/MagneticButton';

export function ExpertisePreview() {
  return (
    <>
      <StatementSection />
      <SplitSection />
    </>
  );
}

/** Philosophy statement paired with a real LNG carrier photograph */
function StatementSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.08, 1]);

  return (
    <section
      ref={ref}
      className="relative py-28 sm:py-36 overflow-hidden bg-[var(--color-paper-50)]"
    >
      <div aria-hidden className="absolute inset-0 paper-grid-fine opacity-40 pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(31,27,23,0.15), transparent)' }}
      />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="signal-rule" />
                <span className="eyebrow text-[var(--color-signal-400)]">Philosophy</span>
              </div>
              <h2 className="serif-display text-[var(--color-ink-400)] text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.03]">
                We bring the workshop{' '}
                <span className="italic text-[var(--color-signal-400)]">to your vessel.</span>
              </h2>
              <p className="mt-8 max-w-lg text-lg text-[var(--color-ink-100)] leading-relaxed font-light">
                The complexity of LNG-powered vessels demands more than general
                mechanical knowledge — it requires deep fluency in integrated
                fuel systems, electronic control, and combustion dynamics.
              </p>
              <div className="mt-10">
                <MagneticButton href="/expertise" variant="outline">
                  Our Capabilities
                  <span aria-hidden>→</span>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          {/* Aerial LNG carrier photograph */}
          <div className="lg:col-span-6">
            <Reveal delay={0.15}>
              <figure className="relative overflow-hidden border border-[rgba(31,27,23,0.14)]">
                <div className="relative w-full" style={{ aspectRatio: '16 / 10' }}>
                  <motion.div style={{ scale: imgScale }} className="absolute inset-0">
                    <Image
                      src="/images/lng-carrier-aerial.jpg"
                      alt="Aerial view of a Moss-type LNG carrier at a loading terminal"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
                {/* Caption overlay */}
                <figcaption className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-5 py-3 bg-gradient-to-t from-[rgba(6,18,35,0.75)] to-transparent">
                  <span className="h-px w-8 bg-[var(--color-signal-300)]" />
                  <span className="eyebrow text-white text-[0.6rem]">
                    LNG carrier · Moss-type containment
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function SplitSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const revealClip = useTransform(
    scrollYProgress,
    [0, 0.6],
    reduce ? ['inset(0 0 0 0)', 'inset(0 0 0 0)'] : ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
  );

  return (
    <section ref={ref} className="py-28 sm:py-36 bg-white">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="signal-rule" />
                <span className="eyebrow">Discipline</span>
              </div>
              <h2 className="serif-display text-[clamp(2.25rem,4.6vw,4.25rem)] text-[var(--color-ink-400)] leading-[1.02]">
                Built for{' '}
                <span className="italic text-[var(--color-signal-400)]">precision.</span>
              </h2>
              <p className="mt-8 text-lg text-[var(--color-ink-100)] leading-relaxed max-w-lg font-light">
                Our field engineers execute overhauls, diagnostics, and repairs on
                the world&apos;s most sophisticated marine engines — ensuring
                maximum uptime and operational safety across every mile at sea.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  'Medium-speed dual-fuel platform specialists',
                  'Mobile workshop, no dry-docking required',
                  'Documented to OEM warranty standard',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-4 text-[var(--color-ink-200)]">
                    <span className="mt-2 h-px w-6 bg-[var(--color-signal-400)] shrink-0" />
                    <span className="text-sm leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <MagneticButton href="/about" variant="ghost">
                  About AKIRA
                  <span aria-hidden>→</span>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          {/* Marine engine — white studio backdrop dissolved via multiply blend */}
          <div className="lg:col-span-6">
            <motion.figure
              className="relative"
              style={{ clipPath: revealClip as unknown as string }}
            >
              <div className="relative w-full flex items-center justify-center" style={{ aspectRatio: '4 / 3' }}>
                <Image
                  src="/images/marine-engine.jpg"
                  alt="Medium-speed dual-fuel marine engine"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain mix-blend-multiply"
                />
              </div>
              <figcaption className="mt-2 flex items-center gap-3">
                <span className="h-px w-8 bg-[var(--color-signal-400)]" />
                <span className="eyebrow text-[var(--color-signal-400)] text-[0.65rem]">
                  Dual-fuel 4-stroke platform
                </span>
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </Container>
    </section>
  );
}
