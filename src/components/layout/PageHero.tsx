'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Crumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  /** Optional italic red accent phrase inserted before/after the title */
  accent?: string;
  lede?: ReactNode;
  crumbs?: Crumb[];
  /** Signature graphic — the page's unique element */
  signature?: ReactNode;
  /** Optional "live status" chip. Renders orange pulsing dot + text */
  statusChip?: string;
  className?: string;
}

/**
 * Shared page-level hero. Enforces theme continuity (paper base, blueprint grid,
 * corner marks, red rule + eyebrow, ink display serif) while giving each page a
 * slot for its own signature graphic.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  lede,
  crumbs,
  signature,
  statusChip,
  className,
}: PageHeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className={`relative pt-32 sm:pt-40 pb-16 overflow-hidden paper-grid ${className ?? ''}`}>
      <div aria-hidden className="absolute inset-0 paper-grid-fine opacity-40 pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 92% 8%, rgba(168,50,50,0.06) 0%, transparent 42%), radial-gradient(ellipse at 8% 92%, rgba(31,27,23,0.05) 0%, transparent 55%)',
        }}
      />

      <CornerMark className="absolute top-24 left-6 sm:left-10" />
      <CornerMark className="absolute top-24 right-6 sm:right-10" flip />

      <Container className="relative z-10">
        {crumbs && crumbs.length > 0 && (
          <div className="mb-8">
            <Breadcrumbs items={crumbs} />
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10 items-end">
          {/* Type column */}
          <div className={signature ? 'lg:col-span-8' : 'lg:col-span-12'}>
            {statusChip && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.05 }}
                className="mb-6 inline-flex items-center gap-2 border border-[rgba(168,50,50,0.35)] bg-[rgba(251,238,237,0.75)] px-3 py-1.5"
              >
                <motion.span
                  animate={reduce ? { opacity: 0.9 } : { opacity: [0.35, 1, 0.35] }}
                  transition={reduce ? {} : { duration: 2.2, ease: 'easeInOut', repeat: Infinity }}
                  className="block w-1.5 h-1.5 rounded-full bg-[var(--color-signal-400)]"
                />
                <span className="eyebrow text-[var(--color-signal-400)] text-[0.6rem]">{statusChip}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="signal-rule" />
              <span className="eyebrow text-[var(--color-ink-400)]">{eyebrow}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.2 }}
              className="serif-display text-[var(--color-ink-400)] text-[clamp(2rem,4.4vw,4.25rem)] leading-[1.05]"
            >
              {title}
              {accent && (
                <>
                  {' '}
                  <span className="italic text-[var(--color-signal-400)] font-normal">{accent}</span>
                </>
              )}
            </motion.h1>

            {lede && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.35 }}
                className="mt-8 max-w-2xl text-lg text-[var(--color-ink-100)] leading-relaxed font-light"
              >
                {lede}
              </motion.p>
            )}
          </div>

          {/* Signature column (page's unique element) */}
          {signature && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.4 }}
              className="lg:col-span-4 hidden md:flex justify-end items-end"
            >
              {signature}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}

function CornerMark({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <div className={`pointer-events-none ${className ?? ''}`} aria-hidden>
      <svg width="18" height="18" viewBox="0 0 18 18" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
        <path d="M 1 6 L 1 1 L 6 1" fill="none" stroke="rgba(168,50,50,0.55)" strokeWidth="1" />
      </svg>
    </div>
  );
}
