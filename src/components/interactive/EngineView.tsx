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
      <div className="paper-grid border border-[rgba(31,27,23,0.15)] p-4 sm:p-8 overflow-hidden relative">
        <div aria-hidden className="absolute inset-0 paper-grid-fine opacity-40 pointer-events-none" />
        <svg
          viewBox="0 0 800 500"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive dual-fuel marine engine diagram"
        >
          {/* Background grid */}
          <defs>
            <pattern id="engineGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(138, 163, 204, 0.06)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d5a80" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1b2d4f" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="pistonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a7ab0" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3d5a80" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#engineGrid)" />

          {/* ===== DETAILED ENGINE CROSS-SECTION ===== */}

          {/* Main engine block */}
          <rect x="100" y="60" width="480" height="340" rx="6" fill="url(#metalGrad)" stroke="#5a7ab0" strokeWidth="1.5" />

          {/* Cylinder liners (4 cylinders) */}
          {[160, 260, 360, 460].map((x, i) => (
            <g key={`cyl-${i}`}>
              {/* Cylinder wall */}
              <rect x={x} y="75" width="60" height="180" rx="3" fill="none" stroke="#6b8fc4" strokeWidth="1" opacity="0.6" />
              {/* Piston */}
              <rect x={x + 5} y={130 + (i % 2) * 40} width="50" height="30" rx="4" fill="url(#pistonGrad)" stroke="#7b9fd4" strokeWidth="1" />
              {/* Piston pin */}
              <circle cx={x + 30} cy={145 + (i % 2) * 40} r="4" fill="none" stroke="#8bb0e0" strokeWidth="1" />
              {/* Connecting rod */}
              <line x1={x + 30} y1={160 + (i % 2) * 40} x2={x + 30} y2="310" stroke="#6b8fc4" strokeWidth="2" opacity="0.5" />
              {/* Valve stems */}
              <line x1={x + 15} y1="60" x2={x + 15} y2="90" stroke="#8bb0e0" strokeWidth="1.5" opacity="0.5" />
              <line x1={x + 45} y1="60" x2={x + 45} y2="90" stroke="#8bb0e0" strokeWidth="1.5" opacity="0.5" />
            </g>
          ))}

          {/* Crankshaft */}
          <g opacity="0.5">
            <line x1="130" y1="320" x2="560" y2="320" stroke="#8bb0e0" strokeWidth="3" />
            {[190, 290, 390, 490].map((x, i) => (
              <g key={`crank-${i}`}>
                <circle cx={x} cy="320" r="15" fill="none" stroke="#6b8fc4" strokeWidth="1.5" />
                <circle cx={x} cy="320" r="5" fill="#4a6fa5" opacity="0.6" />
              </g>
            ))}
          </g>

          {/* Cylinder head area (top) */}
          <rect x="140" y="55" width="400" height="25" rx="3" fill="none" stroke="#6b8fc4" strokeWidth="1.5" opacity="0.5" />

          {/* Exhaust manifold */}
          <path d="M 180 55 Q 180 30 220 30 L 480 30 Q 520 30 520 55" fill="none" stroke="#6b8fc4" strokeWidth="1.5" opacity="0.4" />

          {/* Turbocharger housing */}
          <g>
            <rect x="590" y="60" width="120" height="130" rx="10" fill="url(#metalGrad)" stroke="#5a7ab0" strokeWidth="1.5" />
            {/* Turbine wheel */}
            <circle cx="650" cy="100" r="30" fill="none" stroke="#6b8fc4" strokeWidth="1" opacity="0.5" />
            <circle cx="650" cy="100" r="15" fill="none" stroke="#8bb0e0" strokeWidth="1" opacity="0.4" />
            {/* Compressor wheel */}
            <circle cx="650" cy="160" r="25" fill="none" stroke="#6b8fc4" strokeWidth="1" opacity="0.5" />
            <circle cx="650" cy="160" r="10" fill="none" stroke="#8bb0e0" strokeWidth="1" opacity="0.4" />
            {/* Shaft */}
            <line x1="650" y1="70" x2="650" y2="190" stroke="#8bb0e0" strokeWidth="1.5" opacity="0.4" />
            {/* Exhaust connection */}
            <path d="M 520 40 Q 560 40 590 80" fill="none" stroke="#6b8fc4" strokeWidth="1.5" opacity="0.4" />
          </g>

          {/* Gas Valve Unit */}
          <g>
            <rect x="600" y="230" width="110" height="100" rx="8" fill="url(#metalGrad)" stroke="#5a7ab0" strokeWidth="1.5" />
            {/* Gas piping */}
            <path d="M 580 260 L 600 260" stroke="#6b8fc4" strokeWidth="1.5" opacity="0.5" />
            <path d="M 580 290 L 600 290" stroke="#6b8fc4" strokeWidth="1.5" opacity="0.5" />
            {/* Valve symbols */}
            <circle cx="630" cy="260" r="8" fill="none" stroke="#8bb0e0" strokeWidth="1" opacity="0.5" />
            <circle cx="630" cy="290" r="8" fill="none" stroke="#8bb0e0" strokeWidth="1" opacity="0.5" />
            {/* Gas pipe to cylinders */}
            <path d="M 580 275 L 540 275 L 540 120" stroke="#6b8fc4" strokeWidth="1" opacity="0.3" strokeDasharray="4 3" />
          </g>

          {/* Fuel injection rail */}
          <g opacity="0.4">
            <line x1="140" y1="95" x2="540" y2="95" stroke="#8bb0e0" strokeWidth="2" />
            {[190, 290, 390, 490].map((x, i) => (
              <g key={`inj-${i}`}>
                <line x1={x} y1="95" x2={x} y2="80" stroke="#8bb0e0" strokeWidth="1.5" />
                <circle cx={x} cy="80" r="3" fill="#5a7ab0" />
              </g>
            ))}
          </g>

          {/* Control system panel */}
          <g>
            <rect x="600" y="365" width="120" height="80" rx="6" fill="url(#metalGrad)" stroke="#5a7ab0" strokeWidth="1.5" />
            {/* Screen */}
            <rect x="615" y="378" width="55" height="30" rx="2" fill="rgba(46, 134, 193, 0.15)" stroke="#5a9cc8" strokeWidth="0.5" />
            {/* Status LEDs */}
            <circle cx="685" cy="385" r="3" fill="#4CAF50" opacity="0.6" />
            <circle cx="685" cy="395" r="3" fill="#4CAF50" opacity="0.6" />
            <circle cx="685" cy="405" r="3" fill="#FFC107" opacity="0.6" />
            {/* Connection lines */}
            <path d="M 600 405 L 560 405 L 560 350" stroke="#5a9cc8" strokeWidth="1" opacity="0.3" strokeDasharray="4 3" />
          </g>

          {/* Oil sump */}
          <rect x="120" y="350" width="440" height="40" rx="4" fill="rgba(139, 176, 224, 0.08)" stroke="#5a7ab0" strokeWidth="1" opacity="0.4" />

          {/* Labels */}
          <text x="340" y="380" textAnchor="middle" fill="#5a7ab0" fontSize="10" fontFamily="var(--font-inter), system-ui, sans-serif" opacity="0.5">
            DF-4S
          </text>
          <text x="650" y="125" textAnchor="middle" fill="#5a7ab0" fontSize="8" fontFamily="var(--font-inter), system-ui, sans-serif" opacity="0.5">
            TURBO
          </text>
          <text x="655" y="280" textAnchor="middle" fill="#5a7ab0" fontSize="8" fontFamily="var(--font-inter), system-ui, sans-serif" opacity="0.5">
            GVU
          </text>
          <text x="660" y="425" textAnchor="middle" fill="#5a7ab0" fontSize="8" fontFamily="var(--font-inter), system-ui, sans-serif" opacity="0.5">
            ECU
          </text>

          {/* Instruction text */}
          <text x="400" y="475" textAnchor="middle" fill="#5A7AB0" fontSize="12" fontFamily="var(--font-inter), system-ui, sans-serif">
            Click on a highlighted component to learn about our services
          </text>

          {/* Engine components (interactive hotspots) */}
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
