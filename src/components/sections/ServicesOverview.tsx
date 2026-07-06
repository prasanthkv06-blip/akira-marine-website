'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Reveal, RevealGroup, RevealChild } from '@/components/animations/Reveal';
import { services } from '@/data/services';

export function ServicesOverview() {
  return (
    <section className="py-28 sm:py-36 bg-white relative">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-signal-400)]/40 to-transparent"
      />
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20">
          <Reveal className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="signal-rule" />
              <span className="eyebrow">Services</span>
            </div>
            <h2 className="serif-display text-[clamp(2.25rem,4.6vw,4.25rem)] text-[var(--color-ink-400)] leading-[1.02]">
              A workshop-grade discipline,{' '}
              <span className="italic text-[var(--color-signal-400)]">
                delivered dockside.
              </span>
            </h2>
            <p className="mt-8 text-lg text-[var(--color-ink-100)] leading-relaxed max-w-xl font-light">
              Four service lines, one operating standard. Every intervention is
              executed to OEM specification — planned, precise,
              and fully documented.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 border-b border-[var(--color-ink-400)] pb-1 text-sm uppercase tracking-[0.28em] text-[var(--color-ink-400)] hover:text-[var(--color-signal-400)] hover:border-[var(--color-signal-400)] transition-colors"
            >
              View All Services
              <span
                aria-hidden
                className="transition-transform duration-500 group-hover:translate-x-2"
              >
                →
              </span>
            </Link>
          </Reveal>
        </div>

        <RevealGroup
          className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-4"
          stagger={0.1}
        >
          {services.map((service, index) => (
            <RevealChild key={service.id}>
              <ServiceCard
                index={index}
                title={service.title}
                description={service.shortDescription}
                href={`/services#${service.id}`}
              />
            </RevealChild>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}

interface ServiceCardProps {
  index: number;
  title: string;
  description: string;
  href: string;
}

function ServiceCard({ index, title, description, href }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full pt-6 overflow-hidden"
    >
      <span className="absolute top-0 left-0 h-px w-8 bg-[var(--color-signal-400)] transition-all duration-500 group-hover:w-full" />

      {/* Diagonal red-tinged wash on hover — subtle, one-shot */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[900ms] ease-out"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(168,50,50,0.10) 50%, transparent 60%)',
          willChange: 'transform',
        }}
      />

      <span className="number-outline text-6xl sm:text-7xl leading-none block relative">
        {String(index + 1).padStart(2, '0')}
      </span>

      <h3 className="mt-8 font-sans text-lg font-semibold text-[var(--color-ink-400)] leading-snug tracking-tight relative">
        {title}
      </h3>
      <p className="mt-4 text-sm text-[var(--color-ink-100)] leading-relaxed relative">
        {description}
      </p>

      <Link
        href={href}
        aria-label={`Learn more about ${title}`}
        className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[var(--color-ink-200)] group-hover:text-[var(--color-signal-400)] transition-colors relative"
      >
        Detail
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </Link>
    </motion.div>
  );
}
