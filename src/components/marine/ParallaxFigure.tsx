'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

interface ParallaxFigureProps {
  src: string;
  alt: string;
  caption?: string;
  /** CSS aspect-ratio for the band, e.g. "21 / 9" */
  aspect?: string;
  priority?: boolean;
}

/**
 * Full-bleed cinematic image band with a gentle scroll parallax. The moving
 * layer is oversized so no edges reveal during travel. Caption sits in the
 * content column below. Reduced-motion holds the image still.
 */
export function ParallaxFigure({ src, alt, caption, aspect = '21 / 9', priority = false }: ParallaxFigureProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <figure>
      <div ref={ref} className="relative overflow-hidden" style={{ aspectRatio: aspect }}>
        <motion.div className="absolute inset-[-8%]" style={{ y }}>
          <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-cover object-center" />
        </motion.div>
      </div>
      {caption && (
        <Container>
          <figcaption className="mt-5 text-sm text-[var(--color-ink-100)]">{caption}</figcaption>
        </Container>
      )}
    </figure>
  );
}
