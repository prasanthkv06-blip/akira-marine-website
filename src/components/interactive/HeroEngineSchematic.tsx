'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

// Editorial engine schematic — gold hairlines on navy, blueprint style
// Non-interactive; decorative hero asset. Reuses geometry vocabulary from
// components/interactive/EngineView so the /expertise/technical detailed
// diagram reads as the same engine.

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CALLOUTS: { id: string; label: string; x: number; y: number; anchor: 'left' | 'right'; }[] = [
  { id: 'head',   label: 'Cylinder head',    x: 340, y: 68,  anchor: 'left' },
  { id: 'rail',   label: 'Common rail',      x: 340, y: 95,  anchor: 'left' },
  { id: 'turbo',  label: 'Turbocharger',     x: 650, y: 125, anchor: 'right' },
  { id: 'gvu',    label: 'Gas valve unit',   x: 655, y: 280, anchor: 'right' },
  { id: 'crank',  label: 'Crankshaft',       x: 340, y: 320, anchor: 'left' },
];

interface HeroEngineSchematicProps {
  className?: string;
}

export function HeroEngineSchematic({ className }: HeroEngineSchematicProps) {
  const reduce = useReducedMotion();

  const parent: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.05,
        delayChildren: reduce ? 0 : 0.3,
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
    <div className={className}>
      <motion.svg
        viewBox="0 0 820 520"
        role="img"
        aria-label="Dual-fuel 4-stroke marine engine — cross-section schematic"
        className="w-full h-auto"
        variants={parent}
        initial="hidden"
        animate="visible"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <pattern id="engineGridGold" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(197,162,76,0.06)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="chamber" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(197,162,76,0.06)" />
            <stop offset="100%" stopColor="rgba(197,162,76,0.02)" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(197,162,76,0.35)" />
            <stop offset="100%" stopColor="rgba(197,162,76,0)" />
          </radialGradient>
        </defs>

        {/* Background grid */}
        <rect width="820" height="520" fill="url(#engineGridGold)" />

        {/* Left margin — technical scale marks */}
        <motion.g variants={fadeVariant} stroke="rgba(214,184,85,0.35)" strokeWidth="0.5">
          {[80, 140, 200, 260, 320, 380].map((y) => (
            <g key={y}>
              <line x1="30" y1={y} x2="38" y2={y} />
              <text x="18" y={y + 3} fill="rgba(214,184,85,0.4)" fontSize="7" fontFamily="ui-monospace, monospace">
                {String(y).padStart(3, '0')}
              </text>
            </g>
          ))}
        </motion.g>

        <g strokeLinejoin="round" strokeLinecap="round" fill="none">
          {/* Engine block outline */}
          <motion.rect
            variants={drawVariant}
            x="100" y="60" width="480" height="340" rx="4"
            stroke="rgba(214,184,85,0.75)" strokeWidth="1.25"
          />

          {/* Oil sump */}
          <motion.rect
            variants={drawVariant}
            x="120" y="360" width="440" height="40" rx="3"
            stroke="rgba(214,184,85,0.35)" strokeWidth="0.75"
            fill="url(#chamber)"
          />

          {/* Cylinder liners × 4 */}
          {[160, 260, 360, 460].map((x, i) => (
            <g key={`cyl-${i}`}>
              <motion.rect
                variants={drawVariant}
                x={x} y="75" width="60" height="180" rx="2"
                stroke="rgba(214,184,85,0.65)" strokeWidth="1"
              />
              {/* Piston */}
              <motion.rect
                variants={drawVariant}
                x={x + 5} y={130 + (i % 2) * 40} width="50" height="30" rx="3"
                fill="url(#chamber)"
                stroke="rgba(230,208,127,0.8)" strokeWidth="0.75"
              />
              {/* Piston pin */}
              <motion.circle
                variants={fadeVariant}
                cx={x + 30} cy={145 + (i % 2) * 40} r="3"
                stroke="rgba(230,208,127,0.7)" strokeWidth="0.75"
              />
              {/* Connecting rod */}
              <motion.line
                variants={drawVariant}
                x1={x + 30} y1={160 + (i % 2) * 40} x2={x + 30} y2="315"
                stroke="rgba(197,162,76,0.5)" strokeWidth="1.25"
              />
              {/* Valve stems */}
              <motion.line variants={drawVariant} x1={x + 18} y1="62" x2={x + 18} y2="86"
                stroke="rgba(230,208,127,0.55)" strokeWidth="1" />
              <motion.line variants={drawVariant} x1={x + 42} y1="62" x2={x + 42} y2="86"
                stroke="rgba(230,208,127,0.55)" strokeWidth="1" />
            </g>
          ))}

          {/* Camshaft rail */}
          <motion.line
            variants={drawVariant}
            x1="140" y1="55" x2="540" y2="55"
            stroke="rgba(214,184,85,0.55)" strokeWidth="1"
          />

          {/* Common rail (fuel) */}
          <motion.line
            variants={drawVariant}
            x1="140" y1="95" x2="540" y2="95"
            stroke="rgba(230,208,127,0.65)" strokeWidth="1.5"
          />
          {[190, 290, 390, 490].map((x, i) => (
            <g key={`inj-${i}`}>
              <motion.line variants={drawVariant} x1={x} y1="95" x2={x} y2="78"
                stroke="rgba(230,208,127,0.55)" strokeWidth="1" />
              <motion.circle variants={fadeVariant} cx={x} cy="78" r="2.5" fill="rgba(214,184,85,0.85)" />
            </g>
          ))}

          {/* Exhaust manifold arc */}
          <motion.path
            variants={drawVariant}
            d="M 180 55 Q 180 26 220 26 L 480 26 Q 520 26 520 55"
            stroke="rgba(197,162,76,0.4)" strokeWidth="1"
          />

          {/* Crankshaft */}
          <g>
            <motion.line variants={drawVariant} x1="130" y1="320" x2="560" y2="320"
              stroke="rgba(230,208,127,0.6)" strokeWidth="2" />
            {[190, 290, 390, 490].map((x, i) => (
              <g key={`crank-${i}`}>
                <motion.circle variants={drawVariant} cx={x} cy="320" r="14"
                  stroke="rgba(214,184,85,0.6)" strokeWidth="1" />
                <motion.circle variants={fadeVariant} cx={x} cy="320" r="4"
                  fill="rgba(214,184,85,0.65)" />
              </g>
            ))}
          </g>

          {/* Turbocharger housing */}
          <g>
            <motion.rect variants={drawVariant} x="590" y="60" width="130" height="140" rx="8"
              stroke="rgba(214,184,85,0.7)" strokeWidth="1.25" fill="url(#chamber)" />
            <motion.circle variants={drawVariant} cx="655" cy="105" r="30"
              stroke="rgba(230,208,127,0.6)" strokeWidth="1" />
            <motion.circle variants={drawVariant} cx="655" cy="105" r="15"
              stroke="rgba(230,208,127,0.4)" strokeWidth="0.75" />
            <motion.circle variants={drawVariant} cx="655" cy="165" r="25"
              stroke="rgba(230,208,127,0.6)" strokeWidth="1" />
            <motion.line variants={drawVariant} x1="655" y1="72" x2="655" y2="195"
              stroke="rgba(214,184,85,0.35)" strokeWidth="1" />
            {/* Turbo blade marks */}
            {[0, 45, 90, 135].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <motion.line
                  key={deg}
                  variants={fadeVariant}
                  x1={655 + Math.cos(rad) * 6}
                  y1={105 + Math.sin(rad) * 6}
                  x2={655 + Math.cos(rad) * 26}
                  y2={105 + Math.sin(rad) * 26}
                  stroke="rgba(230,208,127,0.4)" strokeWidth="0.75"
                />
              );
            })}
            {/* Exhaust connection */}
            <motion.path
              variants={drawVariant}
              d="M 520 40 Q 560 40 590 80"
              stroke="rgba(197,162,76,0.4)" strokeWidth="1"
            />
          </g>

          {/* Gas valve unit */}
          <g>
            <motion.rect variants={drawVariant} x="595" y="230" width="120" height="105" rx="6"
              stroke="rgba(214,184,85,0.65)" strokeWidth="1" fill="url(#chamber)" />
            <motion.circle variants={drawVariant} cx="625" cy="260" r="8"
              stroke="rgba(230,208,127,0.55)" strokeWidth="0.75" />
            <motion.circle variants={drawVariant} cx="625" cy="290" r="8"
              stroke="rgba(230,208,127,0.55)" strokeWidth="0.75" />
            <motion.line variants={drawVariant} x1="580" y1="260" x2="595" y2="260"
              stroke="rgba(214,184,85,0.5)" strokeWidth="1" />
            <motion.line variants={drawVariant} x1="580" y1="290" x2="595" y2="290"
              stroke="rgba(214,184,85,0.5)" strokeWidth="1" />
            {/* Dashed gas line to head */}
            <motion.path
              variants={drawVariant}
              d="M 580 275 L 540 275 L 540 100"
              stroke="rgba(214,184,85,0.35)" strokeWidth="0.75" strokeDasharray="4 3"
            />
          </g>

          {/* Baseplate rails */}
          <motion.line variants={drawVariant} x1="100" y1="400" x2="720" y2="400"
            stroke="rgba(214,184,85,0.65)" strokeWidth="1" />
          <motion.line variants={drawVariant} x1="120" y1="415" x2="700" y2="415"
            stroke="rgba(197,162,76,0.35)" strokeWidth="0.75" />
        </g>

        {/* Callouts */}
        <motion.g variants={fadeVariant}>
          {CALLOUTS.map((c) => (
            <Callout key={c.id} {...c} />
          ))}
        </motion.g>

        {/* Engine ID plate */}
        <motion.g variants={fadeVariant} opacity="0.75">
          <rect x="360" y="440" width="120" height="30" rx="2"
            stroke="rgba(214,184,85,0.5)" fill="none" strokeWidth="0.5" />
          <text x="420" y="452" textAnchor="middle" fill="rgba(230,208,127,0.65)"
            fontSize="7" letterSpacing="0.24em"
            fontFamily="ui-monospace, monospace">
            AKIRA · DF-4S · 001
          </text>
          <text x="420" y="463" textAnchor="middle" fill="rgba(197,162,76,0.5)"
            fontSize="5" letterSpacing="0.2em"
            fontFamily="ui-monospace, monospace">
            DUAL-FUEL · 4-STROKE
          </text>
        </motion.g>

        {/* One-shot gold sweep — brand cue on first paint */}
        {!reduce && (
          <motion.rect
            initial={{ opacity: 0, x: -820 }}
            animate={{ opacity: [0, 0.35, 0], x: [-820, 820, 820] }}
            transition={{ duration: 2.2, delay: 1.6, ease: easeOutExpo, times: [0, 0.5, 1] }}
            y="0" width="240" height="520"
            fill="url(#glow)"
            style={{ mixBlendMode: 'screen' }}
          />
        )}
      </motion.svg>
    </div>
  );
}

function Callout({ label, x, y, anchor }: { label: string; x: number; y: number; anchor: 'left' | 'right' }) {
  const isRight = anchor === 'right';
  // Callout line extends outward from the anchor point
  const lineLen = 40;
  const lineEndX = isRight ? x + lineLen : x - lineLen;
  const textX = isRight ? lineEndX + 4 : lineEndX - 4;
  const textAnchor = isRight ? 'start' : 'end';

  return (
    <g>
      <circle cx={x} cy={y} r="2" fill="rgba(230,208,127,0.9)" />
      <circle cx={x} cy={y} r="4.5" fill="none" stroke="rgba(230,208,127,0.4)" strokeWidth="0.5" />
      <line
        x1={x} y1={y}
        x2={lineEndX} y2={y}
        stroke="rgba(214,184,85,0.55)" strokeWidth="0.5"
      />
      <text
        x={textX} y={y + 3}
        fill="rgba(230,208,127,0.85)"
        textAnchor={textAnchor}
        fontSize="9" letterSpacing="0.18em"
        fontFamily="ui-monospace, monospace"
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </text>
    </g>
  );
}
