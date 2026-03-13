'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import type { EngineComponent } from '@/types';

interface ComponentPopupProps {
  component: EngineComponent;
  onClose: () => void;
  containerRect?: DOMRect | null;
}

export function ComponentPopup({ component, onClose, containerRect }: ComponentPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    // Focus trap
    if (popupRef.current) {
      popupRef.current.focus();
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      ref={popupRef}
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-x-4 bottom-4 sm:inset-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-96 z-30 bg-white rounded-xl shadow-2xl border border-navy-100 overflow-y-auto"
      role="dialog"
      aria-label={`Details for ${component.name}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-sans font-bold text-navy-900">{component.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-navy-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-navy-400" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-navy-600 leading-relaxed mb-6">{component.description}</p>

        {/* Services */}
        <div className="mb-6">
          <h4 className="text-sm font-sans font-semibold text-navy-800 mb-3">Our Services</h4>
          <ul className="space-y-2">
            {component.services.map((service) => (
              <li key={service} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-navy-700">{service}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href={component.relatedLink}
          className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-orange-600 hover:text-orange-700 transition-colors"
        >
          Learn More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
