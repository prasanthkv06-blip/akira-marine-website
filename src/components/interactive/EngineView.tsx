'use client';

import { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { engineComponents } from '@/data/engine-components';
import { EngineComponentSVG } from './EngineComponent';
import { ComponentPopup } from './ComponentPopup';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CheckCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import type { EngineComponent } from '@/types';

interface EngineViewProps {
  className?: string;
  compact?: boolean;
}

export function EngineView({ className, compact = false }: EngineViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const selectedComponent = engineComponents.find((c) => c.id === selectedId) || null;

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleHoverStart = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredId(null);
  }, []);

  // Mobile: card list
  if (isMobile) {
    return (
      <div className={className}>
        <MobileEngineCards components={engineComponents} />
      </div>
    );
  }

  // Desktop/Tablet: SVG interactive view
  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 p-4 sm:p-8 overflow-hidden">
        <svg
          viewBox="0 0 800 450"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive Wärtsilä dual-fuel engine diagram"
        >
          {/* Background grid */}
          <defs>
            <pattern id="engineGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(138, 163, 204, 0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="800" height="450" fill="url(#engineGrid)" />

          {/* Engine outline - simplified cross-section */}
          <g opacity="0.15" stroke="#8BA3CC" strokeWidth="1" fill="none">
            {/* Engine block outline */}
            <rect x="130" y="70" width="520" height="320" rx="8" />
            {/* Cylinder bank */}
            <line x1="200" y1="70" x2="200" y2="390" />
            <line x1="350" y1="70" x2="350" y2="390" />
            {/* Crankcase */}
            <line x1="130" y1="240" x2="650" y2="240" />
            {/* Exhaust manifold */}
            <path d="M 380 70 Q 380 40 420 40 L 550 40 Q 570 40 570 60 L 570 80" />
          </g>

          {/* Title */}
          <text x="400" y="435" textAnchor="middle" fill="#5A7AB0" fontSize="12" fontFamily="var(--font-inter), system-ui, sans-serif">
            Click on a component to learn about our services
          </text>

          {/* Engine components */}
          {engineComponents.map((component) => (
            <EngineComponentSVG
              key={component.id}
              component={component}
              isSelected={selectedId === component.id}
              isHovered={hoveredId === component.id}
              onSelect={handleSelect}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            />
          ))}
        </svg>
      </div>

      {/* Popup overlay */}
      <AnimatePresence>
        {selectedComponent && (
          <ComponentPopup
            component={selectedComponent}
            onClose={() => setSelectedId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile fallback: expandable card list
function MobileEngineCards({ components }: { components: EngineComponent[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {components.map((component) => {
        const isExpanded = expandedId === component.id;
        return (
          <div
            key={component.id}
            className="rounded-xl border border-navy-100 overflow-hidden bg-white"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : component.id)}
              className="w-full flex items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="font-sans font-semibold text-navy-900">{component.name}</span>
              </div>
              <ChevronDown className={`h-5 w-5 text-navy-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-navy-50">
                <p className="text-sm text-navy-600 leading-relaxed mt-4 mb-4">{component.description}</p>
                <ul className="space-y-2 mb-4">
                  {component.services.map((service) => (
                    <li key={service} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-navy-700">{service}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={component.relatedLink}
                  className="text-sm font-sans font-semibold text-orange-600 hover:text-orange-700"
                >
                  Learn More &rarr;
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
