'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SheetHeadProps {
  /** legacy — no longer shown */
  index?: string;
  /** short kicker above the title, e.g. "Capabilities" */
  category: string;
  title: string;
  /** legacy — no longer shown */
  note?: string;
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Refined section header: a small copper kicker over an oversized headline.
 * Space and type carry the hierarchy — no document codes or ruled lines.
 */
export function SheetHead({ category, title }: SheetHeadProps) {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-90px' },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <div>
      <motion.span {...rise(0)} className="eyebrow block text-[var(--color-signal-400)]">
        {category}
      </motion.span>
      <motion.h2
        {...rise(0.08)}
        className="mt-5 max-w-4xl text-[clamp(2rem,3.8vw,3.75rem)] font-semibold leading-[1.04] tracking-tight text-[var(--color-ink-400)]"
      >
        {title}
      </motion.h2>
    </div>
  );
}
