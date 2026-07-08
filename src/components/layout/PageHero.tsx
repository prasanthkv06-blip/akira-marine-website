'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Crumb {
  label: string;
  href: string;
}

interface PageHeroImage {
  src: string;
  alt: string;
  /** object-position for the cover crop, e.g. "30% 50%" */
  objectPosition?: string;
}

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  accent?: string;
  lede?: ReactNode;
  crumbs?: Crumb[];
  /** tall cinematic image that fills the right column of the masthead */
  image?: PageHeroImage;
  /** legacy — no longer rendered */
  signature?: ReactNode;
  statusChip?: string;
  className?: string;
}

/**
 * Shared sub-page masthead — a copper kicker over an oversized Archivo title
 * and a measured lede, balanced by a tall cinematic image on the right. Falls
 * back to a single column when no image is supplied.
 */
export function PageHero({ eyebrow, title, accent, lede, crumbs, image, className }: PageHeroProps) {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: EASE },
  });

  return (
    <section className={`relative bg-[var(--color-paper-50)] pt-36 pb-20 sm:pb-28 ${className ?? ''}`}>
      <Container>
        {crumbs && crumbs.length > 0 && (
          <motion.div {...rise(0)} className="mb-12">
            <Breadcrumbs items={crumbs} />
          </motion.div>
        )}

        <div className={image ? 'grid items-center gap-12 lg:grid-cols-12 lg:gap-16' : ''}>
          <div className={image ? 'lg:col-span-7' : ''}>
            <motion.span {...rise(0.06)} className="eyebrow block text-[var(--color-signal-400)]">
              {eyebrow}
            </motion.span>
            <motion.h1
              {...rise(0.16)}
              className="mt-6 text-[clamp(2.2rem,4.6vw,4.75rem)] font-extrabold leading-[1.0] tracking-[-0.025em] text-[var(--color-ink-400)]"
            >
              {title}
              {accent && <> {accent}</>}
            </motion.h1>
            {lede && (
              <motion.p {...rise(0.3)} className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-ink-100)]">
                {lede}
              </motion.p>
            )}
          </div>

          {image && (
            <motion.div {...rise(0.36)} className="lg:col-span-5">
              <MastheadImage src={image.src} alt={image.alt} objectPosition={image.objectPosition} reduce={!!reduce} />
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * Isolated so `useScroll` only runs when an image is actually rendered —
 * otherwise the ref never hydrates and framer-motion throws.
 */
function MastheadImage({
  src,
  alt,
  objectPosition,
  reduce,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <div ref={ref} className="relative aspect-[4/5] overflow-hidden">
      <motion.div className="absolute inset-[-6%]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 42vw"
          className="object-cover"
          style={{ objectPosition: objectPosition ?? 'center' }}
        />
      </motion.div>
    </div>
  );
}
