'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Spec summary — derived from the real platform data in data/technical-specs.ts
const SPEC_ROWS: [string, string][] = [
  ['PLATFORM', 'Dual-fuel 4-stroke'],
  ['BORE CLASSES', '320 / 460 / 500 mm'],
  ['OUTPUT RANGE', '3,480 – 17,550 kW'],
  ['SPEED', '500 – 750 rpm'],
  ['BASE', 'Abu Dhabi, UAE'],
];

const HEADLINE_LINES = ['Field service and overhaul', 'for dual-fuel 4-stroke', 'marine engines.'];

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { y: reduce ? '0%' : '115%' },
    animate: { y: '0%' },
    transition: { duration: 0.95, delay, ease: EASE },
  });
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#081a20]">
      {/* cinematic photograph */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: reduce ? 1 : 1.09 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <Image
          src="/images/shutterstock_2316153079-scaled.jpg"
          alt="Aerial view of a Moss-type LNG carrier moored at a loading terminal"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* directional cinematic scrims for legibility */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(94deg, rgba(8,26,32,0.90) 0%, rgba(8,26,32,0.62) 32%, rgba(8,26,32,0.10) 60%, rgba(8,26,32,0.30) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-72"
        style={{ background: 'linear-gradient(0deg, rgba(8,26,32,0.85), transparent)' }}
      />

      <Container className="relative z-10 flex flex-1 flex-col pt-36 pb-16">
        {/* headline anchored low, editorial */}
        <div className="mt-auto max-w-4xl">
          <h1 className="font-display text-white font-extrabold tracking-[-0.03em] leading-[0.97] text-[clamp(2.5rem,7vw,6rem)]">
            <span className="sr-only">Field service and overhaul for dual-fuel 4-stroke marine engines.</span>
            <span aria-hidden>
              {HEADLINE_LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span className="block will-change-transform" {...rise(0.15 + i * 0.11)}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            {...fade(0.62)}
            className="mt-8 max-w-xl text-white/80 text-base sm:text-lg leading-relaxed"
          >
            We bring workshop-grade capability to your vessel — planned
            maintenance, on-site major overhauls, and LNG fuel-system support,
            carried out at your port of call and documented to OEM standard.
            Established 2026, based in Abu Dhabi.
          </motion.p>

          <motion.div {...fade(0.76)} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact"
              className="group relative inline-flex items-center overflow-hidden px-8 py-4 text-sm font-medium uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: 'var(--color-signal-400)' }}
            >
              <span className="relative z-10">Request service</span>
              <span
                aria-hidden
                className="absolute inset-0 translate-y-full bg-[var(--color-signal-600)] transition-transform duration-300 ease-out group-hover:translate-y-0"
              />
            </Link>
            <Link
              href="/services"
              className="border-b border-white/40 pb-1 text-sm uppercase tracking-[0.14em] text-white/80 transition-colors hover:border-white hover:text-white"
            >
              View service lines
            </Link>
          </motion.div>
        </div>

        {/* spec readout — instrument overlay along the base */}
        <motion.dl
          {...fade(0.9)}
          className="mt-14 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-white/15 pt-5 sm:grid-cols-3 lg:grid-cols-5"
        >
          {SPEC_ROWS.map(([k, v]) => (
            <div key={k}>
              <dt className="ds-meta text-white/50">{k}</dt>
              <dd className="tabular mt-1.5 text-sm font-medium text-white sm:text-base">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
