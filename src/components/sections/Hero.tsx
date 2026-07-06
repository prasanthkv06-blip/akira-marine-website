'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { HeroVesselCutaway } from '@/components/interactive/HeroVesselCutaway';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HEADLINE_START_DELAY = 0.28;
const WORD_STAGGER = 0.06;

const LINE_1 = ['Precision', 'engineering'];
const LINE_2_LEAD = ['for', 'the', 'vessels', 'that'];
const LINE_2_ACCENT = ['move', 'the', 'world.'];

const TOTAL_WORDS = LINE_1.length + LINE_2_LEAD.length + LINE_2_ACCENT.length;
const HEADLINE_END = HEADLINE_START_DELAY + (TOTAL_WORDS - 1) * WORD_STAGGER + 0.7;

const SPEC_STRIP = [
  { k: 'Platforms', v: 'Dual-fuel · 4-stroke' },
  { k: 'Est.', v: 'Feb 2026' },
  { k: 'HQ', v: 'Abu Dhabi, UAE' },
];

export function Hero() {
  const reduce = useReducedMotion();
  const [sweepFired, setSweepFired] = useState(false);

  return (
    <section className="relative flex flex-col overflow-hidden paper-grid">
      {/* Fine grid overlay */}
      <div aria-hidden className="absolute inset-0 paper-grid-fine opacity-40 pointer-events-none" />

      {/* Ambient washes */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 92% 5%, rgba(168,50,50,0.06) 0%, transparent 42%), radial-gradient(ellipse at 8% 92%, rgba(31,27,23,0.05) 0%, transparent 55%)',
        }}
      />

      {/* Corner registration marks */}
      <CornerMark className="absolute top-24 left-6 sm:left-10" />
      <CornerMark className="absolute top-24 right-6 sm:right-10" flip />

      <Container className="relative z-10 w-full pt-32 pb-10 lg:pt-28 lg:pb-8">
        <div className="grid lg:grid-cols-12 gap-8 xl:gap-14 items-center">
          {/* Type column — left half */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.12 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="signal-rule" />
              <span className="eyebrow text-[var(--color-ink-400)]">AKIRA · Marine Solutions</span>
            </motion.div>

            <h1 className="serif-display text-[var(--color-ink-400)] text-[clamp(2.25rem,3.6vw,4rem)] leading-[1.05] tracking-tight">
              <span className="sr-only">Precision engineering for the vessels that move the world.</span>
              <WordLine
                words={LINE_1}
                baseDelay={HEADLINE_START_DELAY}
                wordDelay={WORD_STAGGER}
                index={0}
              />
              <span className="block">
                <WordLine
                  words={LINE_2_LEAD}
                  baseDelay={HEADLINE_START_DELAY}
                  wordDelay={WORD_STAGGER}
                  index={LINE_1.length}
                  inline
                />{' '}
                <span className="italic text-[var(--color-signal-400)] font-normal">
                  <WordLine
                    words={LINE_2_ACCENT}
                    baseDelay={HEADLINE_START_DELAY}
                    wordDelay={WORD_STAGGER}
                    index={LINE_1.length + LINE_2_LEAD.length}
                    inline
                    onLastWord={() => setSweepFired(true)}
                  />
                </span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: HEADLINE_END + 0.05 }}
              className="mt-6 max-w-xl text-base xl:text-lg text-[var(--color-ink-100)] leading-relaxed font-light"
            >
              Specialist maintenance, overhaul, and field service for
              dual-fuel marine engines — delivered to your vessel at any
              port, under any deadline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: HEADLINE_END + 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-medium uppercase tracking-[0.24em] text-white transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-signal-400)',
                  boxShadow: '0 8px 20px -8px rgba(168,50,50,0.5)',
                }}
              >
                Request Consultation
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.28em] text-[var(--color-ink-200)] hover:text-[var(--color-signal-400)] transition-colors"
              >
                Explore Services
                <span
                  aria-hidden
                  className="w-8 h-px bg-[var(--color-steel-300)] group-hover:bg-[var(--color-signal-400)] group-hover:w-12 transition-all duration-500"
                />
              </Link>
            </motion.div>
          </div>

          {/* Globe column — right half, larger */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, ease: easeOutExpo, delay: 0.35 }}
            className="lg:col-span-5 xl:col-span-5 hidden md:block relative"
          >
            <div className="relative max-w-[720px] mx-auto">
              {/* Globe */}
              <HeroVesselCutaway className="relative" />
            </div>
          </motion.div>
        </div>

        {/* One-shot specular sweep across the whole hero */}
        {!reduce && sweepFired && (
          <motion.span
            aria-hidden
            initial={{ x: '-40%', opacity: 0 }}
            animate={{ x: '140%', opacity: [0, 0.35, 0] }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], times: [0, 0.5, 1] }}
            className="pointer-events-none absolute inset-y-0 left-0 w-[40%] z-10"
            style={{
              background:
                'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 48%, rgba(255,255,255,0.15) 52%, transparent 70%)',
              mixBlendMode: 'screen',
              willChange: 'transform, opacity',
            }}
          />
        )}
      </Container>

      {/* Bottom spec strip — anchors the hero to the viewport bottom like a chart title block */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeOutExpo, delay: HEADLINE_END + 0.6 }}
        className="relative z-10 border-t border-[rgba(31,27,23,0.10)] bg-[rgba(251,246,236,0.55)] backdrop-blur-sm"
      >
        <Container className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-6 py-5 text-[var(--color-ink-100)]">
            {SPEC_STRIP.map((item, i) => (
              <div key={item.k} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden className="hidden md:block w-1 h-1 rounded-full bg-[var(--color-signal-400)]" />
                )}
                <span className="eyebrow text-[var(--color-ink-100)] text-[0.6rem]">{item.k}</span>
                <span className="font-sans text-sm sm:text-base font-medium text-[var(--color-ink-400)] tracking-tight">
                  {item.v}
                </span>
              </div>
            ))}
            {/* Scroll cue integrated on the right */}
            <motion.div
              aria-hidden
              className="hidden lg:flex items-center gap-3 text-[var(--color-ink-100)]"
            >
              <span className="eyebrow text-[0.6rem]">Scroll</span>
              <span className="scroll-cue block w-px h-6 bg-gradient-to-b from-[var(--color-signal-400)] to-transparent" />
            </motion.div>
          </div>
        </Container>
      </motion.div>
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

interface SatelliteAnnotationProps {
  label: string;
  sub: string;
  align?: 'left' | 'right';
  className?: string;
}

function SatelliteAnnotation({ label, sub, align = 'left', className }: SatelliteAnnotationProps) {
  const alignClass = align === 'right' ? 'items-end text-right' : 'items-start text-left';
  const ruleAlign = align === 'right' ? 'self-end' : 'self-start';
  return (
    <div className={`hidden lg:flex flex-col gap-1 ${alignClass} ${className ?? ''}`}>
      <span className={`h-px w-8 bg-[var(--color-signal-400)]/50 ${ruleAlign}`} />
      <span className="text-[0.6rem] font-mono uppercase tracking-[0.24em] text-[var(--color-signal-400)] font-semibold">
        {label}
      </span>
      <span className="text-[0.55rem] font-mono uppercase tracking-[0.2em] text-[var(--color-ink-100)]">
        {sub}
      </span>
    </div>
  );
}

interface WordLineProps {
  words: readonly string[];
  baseDelay: number;
  wordDelay: number;
  index: number;
  inline?: boolean;
  onLastWord?: () => void;
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '55%', filter: 'blur(4px)' },
  visible: { opacity: 1, y: '0%', filter: 'blur(0px)' },
};

function WordLine({ words, baseDelay, wordDelay, index, inline, onLastWord }: WordLineProps) {
  return (
    <span className={inline ? 'inline' : 'block'}>
      {words.map((w, i) => {
        const isLast = i === words.length - 1;
        return (
          <span key={`${w}-${i}`}>
            <span
              className="inline-block overflow-hidden align-baseline"
              style={{ paddingBottom: '0.12em' }}
            >
              <motion.span
                className="inline-block will-change-transform"
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.7,
                  ease: easeOutExpo,
                  delay: baseDelay + (index + i) * wordDelay,
                }}
                onAnimationComplete={isLast && onLastWord ? onLastWord : undefined}
              >
                {w}
              </motion.span>
            </span>
            {!isLast && ' '}
          </span>
        );
      })}
    </span>
  );
}
