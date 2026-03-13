'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideInProps {
  children: ReactNode;
  from?: 'left' | 'right';
  delay?: number;
  className?: string;
}

export function SlideIn({ children, from = 'left', delay = 0, className }: SlideInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from === 'left' ? -80 : 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
