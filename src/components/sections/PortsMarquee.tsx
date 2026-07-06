'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const PORTS = [
  'Abu Dhabi · Taweelah',
  'Dubai · Jebel Ali',
  'Rotterdam',
  'Singapore',
  'Fujairah',
  'Hamburg',
  'Antwerp',
  'Busan',
  'Houston',
  'Piraeus',
  'Yokohama',
  'Suez',
  'Gibraltar',
];

export function PortsMarquee() {
  const doubled = [...PORTS, ...PORTS];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const trailX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.5 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
  }

  return (
    <section
      aria-label="Global port network"
      ref={containerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
      className="relative bg-[var(--color-paper-100)] border-y border-[rgba(31,27,23,0.10)] overflow-hidden group/marquee"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-paper-100)] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-paper-100)] to-transparent z-10" />

      <div className="py-5 relative">
        <div
          ref={trackRef}
          className="marquee-track flex gap-16 whitespace-nowrap will-change-transform"
          style={{ animationPlayState: hovered ? 'paused' : 'running' }}
        >
          {doubled.map((port, i) => (
            <span
              key={`${port}-${i}`}
              className="eyebrow text-[var(--color-ink-100)] text-[0.68rem] shrink-0 inline-flex items-center gap-16 transition-colors duration-300 hover:text-[var(--color-signal-400)]"
            >
              {port}
              <span aria-hidden className="text-[var(--color-signal-400)]/50">✦</span>
            </span>
          ))}
        </div>

        {/* Cursor red trail */}
        {!reduce && (
          <motion.span
            aria-hidden
            style={{ x: trailX, opacity: hovered ? 0.8 : 0 }}
            className="pointer-events-none absolute bottom-0 left-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-signal-400)] to-transparent transition-opacity duration-500"
          />
        )}
      </div>
    </section>
  );
}
