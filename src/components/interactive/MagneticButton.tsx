'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  href: string;
  variant?: 'gold' | 'outline' | 'ghost';
  className?: string;
  pull?: number;
}

const spring = { stiffness: 220, damping: 20, mass: 0.6 };

export function MagneticButton({
  children,
  href,
  variant = 'gold',
  className,
  pull = 0.28,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * pull);
    y.set((e.clientY - r.top - r.height / 2) * pull);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    'group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-medium tracking-wide uppercase transition-colors duration-300 will-change-transform';
  const styles: Record<string, string> = {
    gold:    'bg-[var(--color-signal-400)] text-white hover:bg-[var(--color-signal-500)]',
    outline: 'border border-[var(--color-signal-400)] text-[var(--color-signal-400)] hover:bg-[var(--color-signal-400)] hover:text-white',
    ghost:   'text-[var(--color-ink-400)] border-b border-[var(--color-signal-400)] rounded-none px-0 py-2 hover:text-[var(--color-signal-400)]',
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`${base} ${styles[variant]} ${className ?? ''}`}
    >
      <span className="relative z-10 flex items-center gap-3">{children}</span>
      {variant === 'gold' && (
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.35),transparent_60%)]" />
      )}
    </motion.a>
  );
}

// Non-magnetic ghost link kept as a plain Link for internal SSR-friendliness where needed
export function GhostLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-sm tracking-wider uppercase text-[var(--color-ink-200)] hover:text-[var(--color-signal-400)] transition-colors ${className ?? ''}`}
    >
      {children}
      <span aria-hidden className="translate-y-[-1px]">↗</span>
    </Link>
  );
}
