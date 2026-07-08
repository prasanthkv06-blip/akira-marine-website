'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { navigation } from '@/data/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[rgba(31,27,23,0.35)] z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            id="mobile-menu"
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[var(--color-paper-50)] z-50 lg:hidden overflow-y-auto border-l border-[rgba(31,27,23,0.10)]"
          >
            <div className="flex items-center justify-between p-6 border-b border-[rgba(31,27,23,0.10)]">
              <div className="flex items-center gap-3">
                <span className="signal-rule" />
                <span className="eyebrow">Menu</span>
              </div>
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="p-2 text-[var(--color-ink-100)] hover:text-[var(--color-signal-400)] transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-6 space-y-1">
              {navigation.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() =>
                          setExpandedItem(expandedItem === item.href ? null : item.href)
                        }
                        className="flex items-center justify-between w-full py-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-400)] hover:text-[var(--color-signal-400)] transition-colors"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expandedItem === item.href ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedItem === item.href && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-1 border-l border-[var(--color-signal-400)]/40 ml-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className="block py-2 text-sm text-[var(--color-ink-100)] hover:text-[var(--color-signal-400)] transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--color-ink-400)] hover:text-[var(--color-signal-400)] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="p-6 border-t border-[rgba(31,27,23,0.10)]">
              <Link
                href="/contact"
                onClick={onClose}
                className="group inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-[0.24em] font-medium text-white transition-all duration-300"
                style={{ backgroundColor: 'var(--color-signal-400)' }}
              >
                Get In Touch
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
