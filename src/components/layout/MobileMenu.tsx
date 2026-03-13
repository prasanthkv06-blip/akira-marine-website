'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { navigation } from '@/data/navigation';
import { Button } from '@/components/ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-navy-900 z-50 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-navy-700">
              <span className="font-sans text-lg font-bold text-white">Menu</span>
              <button
                onClick={onClose}
                className="p-2 text-navy-300 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-1">
              {navigation.map((item) => (
                <div key={item.href}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.href ? null : item.href)}
                        className="flex items-center justify-between w-full py-3 font-sans text-base font-medium text-navy-100 hover:text-orange-400 transition-colors"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedItem === item.href ? 'rotate-180' : ''}`} />
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
                            <div className="pl-4 pb-2 space-y-1 border-l-2 border-navy-700 ml-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onClose}
                                  className="block py-2 text-sm font-sans text-navy-300 hover:text-orange-400 transition-colors"
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
                      className="block py-3 font-sans text-base font-medium text-navy-100 hover:text-orange-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-navy-700">
              <Button href="/contact" variant="primary" size="md" className="w-full">
                Get In Touch
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
