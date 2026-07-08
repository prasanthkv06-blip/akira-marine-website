'use client';

import Image from 'next/image';
import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';

interface MediaSplitProps {
  src: string;
  alt: string;
  /** place the image on the right instead of the left */
  flip?: boolean;
  /** CSS aspect-ratio for the image, e.g. "4 / 5" */
  aspect?: string;
  /** "cover" = cinematic photo with parallax; "contain" = product plate (white bg dissolved) */
  fit?: 'cover' | 'contain';
  /** background/surface class for the image cell (used with fit="contain") */
  surface?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Premium editorial split — a cinematic image beside content. "cover" gives a
 * full-bleed photo with a gentle scroll parallax; "contain" presents a product
 * render as a floating plate with its white studio backdrop dissolved via
 * multiply blend. Stacks image-over-content on mobile.
 */
export function MediaSplit({
  src,
  alt,
  flip = false,
  aspect = '4 / 5',
  fit = 'cover',
  surface = '',
  children,
  className = '',
}: MediaSplitProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-5%', '5%']);

  return (
    <Container className={className}>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          ref={ref}
          className={`relative overflow-hidden ${surface} ${flip ? 'lg:order-2' : ''}`}
          style={{ aspectRatio: aspect }}
        >
          {fit === 'contain' ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 mix-blend-multiply sm:p-12"
            />
          ) : (
            <motion.div className="absolute inset-[-6%]" style={{ y }}>
              <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </motion.div>
          )}
        </div>
        <div className={flip ? 'lg:order-1' : ''}>{children}</div>
      </div>
    </Container>
  );
}
