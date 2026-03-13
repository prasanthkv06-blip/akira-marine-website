'use client';

import { motion } from 'framer-motion';
import type { EngineComponent as EngineComponentType } from '@/types';

interface EngineComponentProps {
  component: EngineComponentType;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
}

export function EngineComponentSVG({
  component,
  isSelected,
  isHovered,
  onSelect,
  onHoverStart,
  onHoverEnd,
}: EngineComponentProps) {
  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-label={component.name}
      aria-expanded={isSelected}
      onClick={() => onSelect(component.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(component.id);
        }
      }}
      onMouseEnter={() => onHoverStart(component.id)}
      onMouseLeave={onHoverEnd}
      style={{ cursor: 'pointer' }}
    >
      <title>{component.name}</title>

      {/* Component shape */}
      <motion.path
        d={component.svgPath}
        fill={isSelected ? 'rgba(211, 84, 0, 0.3)' : isHovered ? 'rgba(211, 84, 0, 0.15)' : 'rgba(58, 90, 148, 0.1)'}
        stroke={isSelected ? '#D35400' : isHovered ? '#E67E22' : 'rgba(138, 163, 204, 0.4)'}
        strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
        initial={false}
        animate={{
          fill: isSelected ? 'rgba(211, 84, 0, 0.3)' : isHovered ? 'rgba(211, 84, 0, 0.15)' : 'rgba(58, 90, 148, 0.1)',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Pulsing hotspot indicator */}
      <motion.circle
        cx={component.hotspotX}
        cy={component.hotspotY}
        r={6}
        fill={isSelected ? '#D35400' : '#E67E22'}
        opacity={isSelected ? 1 : 0.8}
        animate={!isSelected && !isHovered ? {
          r: [6, 9, 6],
          opacity: [0.8, 0.4, 0.8],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle
        cx={component.hotspotX}
        cy={component.hotspotY}
        r={3}
        fill="white"
      />

      {/* Label */}
      <text
        x={component.hotspotX}
        y={component.hotspotY - 16}
        textAnchor="middle"
        fill={isSelected || isHovered ? '#D35400' : '#8BA3CC'}
        fontSize="11"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontWeight={isSelected || isHovered ? '600' : '500'}
      >
        {component.name}
      </text>
    </motion.g>
  );
}
