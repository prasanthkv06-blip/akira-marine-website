'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  as?: 'div' | 'span' | 'li' | 'section' | 'article';
  className?: string;
  once?: boolean;
  amount?: number;
}

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 0.7,
  as = 'div',
  className,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  const variants: Variants = {
    hidden:  { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration, delay, ease: easeOutExpo } },
  };

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}

interface RevealGroupProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  amount?: number;
  once?: boolean;
}

export function RevealGroup({
  children,
  stagger = 0.08,
  delay = 0,
  className,
  amount = 0.2,
  once = true,
}: RevealGroupProps) {
  const parent: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={parent}
    >
      {children}
    </motion.div>
  );
}

const childEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function RevealChild({
  children,
  y = 24,
  duration = 0.7,
  className,
}: {
  children: ReactNode;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden:  { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration, ease: childEase } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
