'use client';

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

/**
 * HeroEngineSpecimen — dark ink lines on paper.
 *
 * A precision-drawn dual-fuel 4-stroke marine engine cross-section rendered as
 * a technical service-manual illustration. Warm charcoal ink strokes on cream
 * paper background. Signal-red on live service points only.
 */

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CYLINDER_XS = [160, 260, 360, 460] as const;
const PISTON_TDC = 130;
const PISTON_BDC = 200;

const CALLOUTS = [
  { id: 'head',  label: 'Cylinder head',    x: 340, y: 68,  anchor: 'left'  as const },
  { id: 'rail',  label: 'Common rail',      x: 340, y: 95,  anchor: 'left'  as const },
  { id: 'turbo', label: 'Turbocharger',     x: 655, y: 105, anchor: 'right' as const },
  { id: 'gvu',   label: 'Gas valve unit',   x: 655, y: 280, anchor: 'right' as const },
  { id: 'crank', label: 'Crankshaft',       x: 340, y: 320, anchor: 'left'  as const },
];

// Ink palette values used in stroke/fill attributes
const INK       = 'rgba(31,27,23,0.85)';
const INK_MID   = 'rgba(31,27,23,0.55)';
const INK_LIGHT = 'rgba(31,27,23,0.32)';
const INK_FAINT = 'rgba(31,27,23,0.15)';
const STEEL     = 'rgba(107,100,89,0.7)';
const SIGNAL    = 'rgba(168,50,50,0.9)';
const SIGNAL_MID = 'rgba(168,50,50,0.55)';
const SIGNAL_LIGHT = 'rgba(168,50,50,0.22)';

interface HeroEngineSpecimenProps {
  className?: string;
}

export function HeroEngineSpecimen({ className }: HeroEngineSpecimenProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rxs = useSpring(rx, { stiffness: 90, damping: 18, mass: 0.6 });
  const rys = useSpring(ry, { stiffness: 90, damping: 18, mass: 0.6 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    rx.set(-ny * 4);
    ry.set( nx * 4);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const perspective = useTransform(
    [rxs, rys] as [typeof rxs, typeof rys],
    ([x, y]) => `perspective(1400px) rotateX(${x}deg) rotateY(${y}deg)`,
  );

  const parent: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.04,
        delayChildren: reduce ? 0 : 0.25,
      },
    },
  };
  const drawVariant: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: reduce ? 0 : 1.4, ease: easeOutExpo },
    },
  };
  const fadeVariant: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduce ? 0 : 0.8, ease: easeOutExpo } },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: '1400px' }}
    >
      <motion.svg
        viewBox="0 0 820 520"
        role="img"
        aria-label="Dual-fuel 4-stroke marine engine — animated technical specimen"
        className="w-full h-auto"
        variants={parent}
        initial="hidden"
        animate="visible"
        style={{
          overflow: 'visible',
          transform: perspective,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <defs>
          {/* Bore — a subtle darker inset so pistons read as being inside */}
          <linearGradient id="boreShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(31,27,23,0.14)" />
            <stop offset="50%" stopColor="rgba(31,27,23,0.06)" />
            <stop offset="100%" stopColor="rgba(31,27,23,0.02)" />
          </linearGradient>

          {/* Piston top — very subtle metal hint on paper */}
          <linearGradient id="pistonInk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="rgba(31,27,23,0.10)" />
            <stop offset="100%" stopColor="rgba(31,27,23,0.02)" />
          </linearGradient>

          {/* Coolant hatch */}
          <pattern id="coolantHatchPaper" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={INK_FAINT} strokeWidth="0.6" />
          </pattern>

          {/* Rail pulse — signal red */}
          <linearGradient id="railPulsePaper" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(168,50,50,0)" />
            <stop offset="30%"  stopColor="rgba(168,50,50,0.85)" />
            <stop offset="45%"  stopColor="rgba(200,80,60,1)" />
            <stop offset="60%"  stopColor="rgba(168,50,50,0.85)" />
            <stop offset="100%" stopColor="rgba(168,50,50,0)" />
          </linearGradient>

          {/* Service-port glow */}
          <radialGradient id="portGlowPaper" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(168,50,50,0.7)" />
            <stop offset="100%" stopColor="rgba(168,50,50,0)" />
          </radialGradient>

          <g id="turboBladesPaper">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1="0" y1="0"
                x2={Math.cos((deg * Math.PI) / 180) * 26}
                y2={Math.sin((deg * Math.PI) / 180) * 26}
                stroke={INK_MID}
                strokeWidth="1.2"
              />
            ))}
          </g>
        </defs>

        {/* Left scale marks */}
        <motion.g variants={fadeVariant} stroke={INK_LIGHT} strokeWidth="0.5">
          {[80, 140, 200, 260, 320, 380].map((y) => (
            <g key={y}>
              <line x1="30" y1={y} x2="38" y2={y} />
              <text x="18" y={y + 3} fill={INK_LIGHT} fontSize="7" fontFamily="ui-monospace, monospace">
                {String(y).padStart(3, '0')}
              </text>
            </g>
          ))}
        </motion.g>

        {/* Engine block — ink hairline outline */}
        <motion.rect
          variants={drawVariant}
          x="100" y="60" width="480" height="340" rx="3"
          fill="none"
          stroke={INK}
          strokeWidth="1.3"
        />
        {/* Coolant jacket band */}
        <motion.rect
          variants={fadeVariant}
          x="105" y="90" width="470" height="14"
          fill="url(#coolantHatchPaper)"
        />
        {/* Head gasket line */}
        <motion.line
          variants={drawVariant}
          x1="100" y1="107" x2="580" y2="107"
          stroke={INK_MID} strokeWidth="0.75"
        />

        {/* Head bolts */}
        <motion.g variants={fadeVariant}>
          {[135, 215, 295, 375, 455, 535].map((x) => (
            <g key={`bolt-${x}`}>
              <circle cx={x} cy="115" r="3.5" fill="rgba(31,27,23,0.06)" stroke={INK_MID} strokeWidth="0.75" />
              <circle cx={x} cy="115" r="1" fill={INK} />
            </g>
          ))}
        </motion.g>

        {/* Oil sump */}
        <motion.rect
          variants={drawVariant}
          x="120" y="360" width="440" height="40" rx="2"
          fill="rgba(31,27,23,0.04)"
          stroke={INK_MID} strokeWidth="0.75"
        />
        {/* Sump drain plug — signal red service point */}
        <motion.g variants={fadeVariant}>
          <rect x="335" y="392" width="10" height="8" rx="1" fill={SIGNAL} />
          <circle cx="340" cy="396" r="1.2" fill="rgba(255,255,255,0.85)" />
        </motion.g>

        {/* Cylinder liners with animated pistons */}
        {CYLINDER_XS.map((x, i) => {
          const pairOffset = i % 2 === 0 ? 0 : 1.8;
          return (
            <g key={`cyl-${i}`}>
              {/* Bore */}
              <motion.rect
                variants={drawVariant}
                x={x} y="75" width="60" height="180" rx="2"
                fill="url(#boreShade)"
                stroke={INK_MID} strokeWidth="1"
              />

              {/* Piston */}
              <motion.rect
                x={x + 4}
                width="52"
                height="32"
                rx="2"
                fill="url(#pistonInk)"
                stroke={INK}
                strokeWidth="0.9"
                animate={
                  reduce
                    ? { y: (PISTON_TDC + PISTON_BDC) / 2 }
                    : { y: [PISTON_TDC, PISTON_BDC, PISTON_TDC] }
                }
                transition={{
                  duration: 3.6,
                  ease: 'easeInOut',
                  repeat: reduce ? 0 : Infinity,
                  delay: pairOffset,
                }}
                style={{ willChange: 'transform' }}
              />
              {/* Piston rings */}
              {!reduce && [8, 14, 20].map((rowOff) => (
                <motion.line
                  key={rowOff}
                  x1={x + 6}
                  x2={x + 54}
                  stroke={INK_LIGHT} strokeWidth="0.5"
                  animate={{ y1: [PISTON_TDC + rowOff, PISTON_BDC + rowOff, PISTON_TDC + rowOff], y2: [PISTON_TDC + rowOff, PISTON_BDC + rowOff, PISTON_TDC + rowOff] }}
                  transition={{ duration: 3.6, ease: 'easeInOut', repeat: Infinity, delay: pairOffset }}
                />
              ))}

              {/* Piston pin */}
              <motion.circle
                cx={x + 30}
                r="3"
                fill="rgba(31,27,23,0.08)"
                stroke={INK} strokeWidth="0.7"
                animate={
                  reduce
                    ? { cy: (PISTON_TDC + PISTON_BDC) / 2 + 15 }
                    : { cy: [PISTON_TDC + 15, PISTON_BDC + 15, PISTON_TDC + 15] }
                }
                transition={{ duration: 3.6, ease: 'easeInOut', repeat: reduce ? 0 : Infinity, delay: pairOffset }}
              />
              {/* Connecting rod */}
              <motion.line
                x1={x + 30}
                x2={x + 30} y2="315"
                stroke={INK} strokeWidth="2"
                animate={
                  reduce
                    ? { y1: (PISTON_TDC + PISTON_BDC) / 2 + 30 }
                    : { y1: [PISTON_TDC + 30, PISTON_BDC + 30, PISTON_TDC + 30] }
                }
                transition={{ duration: 3.6, ease: 'easeInOut', repeat: reduce ? 0 : Infinity, delay: pairOffset }}
              />

              {/* Valve stems */}
              <motion.line variants={drawVariant} x1={x + 18} y1="62" x2={x + 18} y2="86"
                stroke={INK_MID} strokeWidth="1.25" />
              <motion.line variants={drawVariant} x1={x + 42} y1="62" x2={x + 42} y2="86"
                stroke={INK_MID} strokeWidth="1.25" />

              {/* Injector — signal red, pulsing */}
              <motion.circle
                cx={x + 30} cy="78" r="3.5"
                fill={SIGNAL}
                stroke="rgba(255,255,255,0.85)" strokeWidth="0.5"
                animate={reduce ? { opacity: 1 } : { opacity: [0.75, 1, 0.75] }}
                transition={reduce ? {} : { duration: 2.4, ease: 'easeInOut', repeat: Infinity, delay: i * 0.35 }}
              />
              {!reduce && (
                <motion.circle
                  cx={x + 30} cy="78" r="7"
                  fill="url(#portGlowPaper)"
                  animate={{ opacity: [0.15, 0.55, 0.15], r: [6, 9, 6] }}
                  transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, delay: i * 0.35 }}
                />
              )}
            </g>
          );
        })}

        {/* Camshaft rail */}
        <motion.line variants={drawVariant} x1="140" y1="55" x2="540" y2="55"
          stroke={INK_MID} strokeWidth="1" />

        {/* Common rail */}
        <motion.line variants={drawVariant} x1="140" y1="95" x2="540" y2="95"
          stroke={INK} strokeWidth="1.5" />

        {/* Rail pulse — signal red sheen travelling */}
        {!reduce && (
          <motion.line
            x1="140" y1="95" x2="540" y2="95"
            stroke="url(#railPulsePaper)"
            strokeWidth="3.5"
            strokeLinecap="round"
            initial={{ pathLength: 0.22, pathOffset: -0.22 }}
            animate={{ pathOffset: [-0.22, 1.0] }}
            transition={{ duration: 3.2, ease: 'linear', repeat: Infinity, delay: 1.6 }}
            style={{ willChange: 'transform' }}
          />
        )}

        {/* Exhaust manifold arc */}
        <motion.path
          variants={drawVariant}
          d="M 180 55 Q 180 26 220 26 L 480 26 Q 520 26 520 55"
          stroke={INK_MID} strokeWidth="1.25"
          fill="none"
        />

        {/* Crankshaft */}
        <motion.line variants={drawVariant} x1="130" y1="320" x2="560" y2="320"
          stroke={INK} strokeWidth="2.5" />
        {[190, 290, 390, 490].map((x, i) => (
          <g key={`crank-${i}`}>
            <motion.circle variants={drawVariant} cx={x} cy="320" r="14"
              fill="rgba(31,27,23,0.06)"
              stroke={INK} strokeWidth="1.2" />
            <motion.circle variants={fadeVariant} cx={x} cy="320" r="4"
              fill={INK} />
          </g>
        ))}

        {/* Turbocharger */}
        <g>
          <motion.rect variants={drawVariant} x="590" y="60" width="130" height="140" rx="6"
            fill="rgba(31,27,23,0.04)"
            stroke={INK} strokeWidth="1.25" />
          {/* Housing bolts */}
          <motion.g variants={fadeVariant}>
            {[[600, 70], [710, 70], [600, 190], [710, 190]].map(([bx, by], i) => (
              <circle key={i} cx={bx} cy={by} r="2.5" fill="rgba(31,27,23,0.06)" stroke={INK_MID} strokeWidth="0.5" />
            ))}
          </motion.g>
          <motion.circle variants={drawVariant} cx="655" cy="105" r="30"
            stroke={INK} strokeWidth="1.25"
            fill="rgba(31,27,23,0.03)" />
          <motion.circle variants={drawVariant} cx="655" cy="105" r="15"
            stroke={INK_MID} strokeWidth="0.75" />
          <motion.circle variants={drawVariant} cx="655" cy="165" r="25"
            stroke={INK} strokeWidth="1.25"
            fill="rgba(31,27,23,0.03)" />
          <motion.line variants={drawVariant} x1="655" y1="72" x2="655" y2="195"
            stroke={INK_LIGHT} strokeWidth="1" />

          {!reduce ? (
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
              style={{ transformOrigin: '655px 105px', transformBox: 'view-box' as 'view-box', willChange: 'transform' }}
            >
              <use href="#turboBladesPaper" x="655" y="105" />
            </motion.g>
          ) : (
            <use href="#turboBladesPaper" x="655" y="105" />
          )}

          {!reduce ? (
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 9, ease: 'linear', repeat: Infinity }}
              style={{ transformOrigin: '655px 165px', transformBox: 'view-box' as 'view-box', willChange: 'transform' }}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={655}
                    y1={165}
                    x2={655 + Math.cos(rad) * 22}
                    y2={165 + Math.sin(rad) * 22}
                    stroke={INK_MID} strokeWidth="1"
                  />
                );
              })}
            </motion.g>
          ) : null}

          <motion.path
            variants={drawVariant}
            d="M 520 40 Q 560 40 590 80"
            stroke={INK_MID} strokeWidth="1.25"
            fill="none"
          />
        </g>

        {/* Gas valve unit */}
        <g>
          <motion.rect variants={drawVariant} x="595" y="230" width="120" height="105" rx="4"
            fill="rgba(31,27,23,0.04)"
            stroke={INK} strokeWidth="1" />
          <motion.g variants={fadeVariant}>
            {[[603, 238], [707, 238], [603, 327], [707, 327]].map(([bx, by], i) => (
              <circle key={i} cx={bx} cy={by} r="2.2" fill="rgba(31,27,23,0.06)" stroke={INK_MID} strokeWidth="0.4" />
            ))}
          </motion.g>
          {/* State indicators */}
          <motion.circle variants={fadeVariant} cx="625" cy="260" r="6"
            fill={SIGNAL}
            stroke="rgba(255,255,255,0.85)" strokeWidth="0.5" />
          <motion.circle variants={fadeVariant} cx="625" cy="290" r="6"
            fill="rgba(31,27,23,0.15)"
            stroke={INK_MID} strokeWidth="0.5" />
          <motion.text
            variants={fadeVariant}
            x="640" y="263"
            fontSize="6"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.15em"
            fill={SIGNAL}
          >OPEN</motion.text>
          <motion.text
            variants={fadeVariant}
            x="640" y="293"
            fontSize="6"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.15em"
            fill={INK_MID}
          >CLOSED</motion.text>
          <motion.line variants={drawVariant} x1="580" y1="260" x2="595" y2="260"
            stroke={INK_MID} strokeWidth="1.25" />
          <motion.line variants={drawVariant} x1="580" y1="290" x2="595" y2="290"
            stroke={INK_MID} strokeWidth="1.25" />
          <motion.path
            variants={drawVariant}
            d="M 580 275 L 540 275 L 540 100"
            stroke={SIGNAL_MID} strokeWidth="0.75" strokeDasharray="4 3"
            fill="none"
          />
        </g>

        {/* Baseplate */}
        <motion.line variants={drawVariant} x1="100" y1="400" x2="720" y2="400"
          stroke={INK} strokeWidth="1.25" />
        <motion.line variants={drawVariant} x1="120" y1="415" x2="700" y2="415"
          stroke={INK_LIGHT} strokeWidth="0.75" />
        <motion.g variants={fadeVariant}>
          {[150, 350, 550, 680].map((x) => (
            <rect key={x} x={x - 8} y="400" width="16" height="8" fill="rgba(31,27,23,0.06)" stroke={INK_MID} strokeWidth="0.5" />
          ))}
        </motion.g>

        {/* Callouts */}
        <motion.g variants={fadeVariant}>
          {CALLOUTS.map((c, i) => (
            <BreathingCallout key={c.id} {...c} phase={i} reduce={!!reduce} />
          ))}
        </motion.g>

        {/* Engine ID plate */}
        <motion.g variants={fadeVariant} opacity="0.95">
          <rect x="360" y="440" width="120" height="30" rx="1"
            stroke={INK_MID} fill="rgba(255,255,255,0.6)" strokeWidth="0.5" />
          <text x="420" y="452" textAnchor="middle" fill={INK}
            fontSize="7" letterSpacing="0.24em"
            fontFamily="ui-monospace, monospace">
            AKIRA · DF-4S · 001
          </text>
          <text x="420" y="463" textAnchor="middle" fill={SIGNAL}
            fontSize="5" letterSpacing="0.2em"
            fontFamily="ui-monospace, monospace">
            DUAL-FUEL · 4-STROKE
          </text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

interface CalloutProps {
  label: string;
  x: number;
  y: number;
  anchor: 'left' | 'right';
  phase: number;
  reduce: boolean;
}

function BreathingCallout({ label, x, y, anchor, phase, reduce }: CalloutProps) {
  const isRight = anchor === 'right';
  const lineLen = 40;
  const lineEndX = isRight ? x + lineLen : x - lineLen;
  const textX = isRight ? lineEndX + 4 : lineEndX - 4;
  const textAnchor = isRight ? 'start' : 'end';

  return (
    <motion.g
      animate={reduce ? { opacity: 1 } : { opacity: [0.6, 1, 0.6] }}
      transition={reduce ? {} : { duration: 5, ease: 'easeInOut', repeat: Infinity, delay: phase * 0.9 }}
    >
      <circle cx={x} cy={y} r="2" fill={INK} />
      <circle cx={x} cy={y} r="4.5" fill="none" stroke={INK_MID} strokeWidth="0.5" />
      <line x1={x} y1={y} x2={lineEndX} y2={y}
        stroke={INK_MID} strokeWidth="0.5" />
      <text
        x={textX} y={y + 3}
        fill={INK}
        textAnchor={textAnchor}
        fontSize="9" letterSpacing="0.18em"
        fontFamily="ui-monospace, monospace"
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </text>
    </motion.g>
  );
}
