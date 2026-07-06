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
 * HeroVesselCutaway — Moss-type LNG carrier, technical elevation.
 *
 * Signature Moss details baked in:
 *  - 4 spherical cargo tanks with only the upper ~60% dome above deck
 *  - Tall vent / mooring masts between each pair of tanks (very characteristic)
 *  - 6-story bridge/accommodation block at extreme stern
 *  - Funnel just forward of bridge
 *  - Engine room cutaway directly below the accommodation, aft of tank No.4
 *  - Bulbous bow visible below waterline
 *  - Raised forecastle with anchor cluster
 *  - Cargo manifold + crossover pipework on deck
 *  - Hull sheer curve + waterline weathering
 *  - Rudder + single-screw propeller
 *  - Waterline waves, gentle roll, propeller spin, engine glow
 */

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const INK       = 'rgba(31,27,23,0.85)';
const INK_MID   = 'rgba(31,27,23,0.55)';
const INK_LIGHT = 'rgba(31,27,23,0.32)';
const INK_FAINT = 'rgba(31,27,23,0.15)';
const HULL_FILL = 'rgba(31,27,23,0.11)';
const DECK_FILL = 'rgba(31,27,23,0.06)';
const DOME_FILL = 'rgba(255,255,255,0.65)';
const SIGNAL    = 'rgba(168,50,50,0.9)';
const SIGNAL_MID = 'rgba(168,50,50,0.55)';
const SIGNAL_LIGHT = 'rgba(168,50,50,0.20)';

interface HeroVesselCutawayProps {
  className?: string;
}

// --- geometry ---------------------------------------------------------------
const WL = 300;
const DECK = 248;
const HULL_BOTTOM = 328;

const TANK_R = 46;
const TANK_XS = [235, 355, 475, 595];

const FORECASTLE = 236;

const BRIDGE_X = 90;
const BRIDGE_W = 62;
const BRIDGE_TOP = DECK - 88;

export function HeroVesselCutaway({ className }: HeroVesselCutawayProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rxs = useSpring(rx, { stiffness: 80, damping: 20, mass: 0.7 });
  const rys = useSpring(ry, { stiffness: 80, damping: 20, mass: 0.7 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width  - 0.5;
    const ny = (e.clientY - r.top)  / r.height - 0.5;
    rx.set(-ny * 2);
    ry.set( nx * 2);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const perspective = useTransform(
    [rxs, rys] as [typeof rxs, typeof rys],
    ([x, y]) => `perspective(1600px) rotateX(${x}deg) rotateY(${y}deg)`,
  );

  const parent: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduce ? 0 : 0.04,
        delayChildren: reduce ? 0 : 0.2,
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
    visible: { opacity: 1, transition: { duration: reduce ? 0 : 0.7, ease: easeOutExpo } },
  };

  // Vent mast x-coordinates (between and after each tank)
  const MAST_XS = [187, 295, 415, 535, 655];

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: '1600px' }}
    >
      <motion.svg
        viewBox="0 0 820 460"
        role="img"
        aria-label="Moss-type LNG carrier — technical elevation with dual-fuel engine cutaway"
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
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(31,27,23,0.08)" />
            <stop offset="100%" stopColor="rgba(31,27,23,0.02)" />
          </linearGradient>
          <radialGradient id="engineGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168,50,50,0.65)" />
            <stop offset="100%" stopColor="rgba(168,50,50,0)" />
          </radialGradient>
          <radialGradient id="domeShade" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(31,27,23,0.18)" />
          </radialGradient>
          {/* Prop blades */}
          <g id="propBlade">
            {[0, 72, 144, 216, 288].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={0} y1={0}
                  x2={Math.cos(rad) * 11}
                  y2={Math.sin(rad) * 11}
                  stroke={INK_MID}
                  strokeWidth="1.1"
                />
              );
            })}
          </g>
          {/* Dome clip — only upper hemisphere emerges above deck */}
          {TANK_XS.map((cx, i) => (
            <clipPath key={i} id={`dome-clip-${i}`}>
              <rect x={cx - TANK_R - 2} y={DECK - TANK_R - 8} width={TANK_R * 2 + 4} height={TANK_R + 2} />
            </clipPath>
          ))}
        </defs>

        {/* Chart title */}
        <motion.g variants={fadeVariant}>
          <line x1="30" y1="42" x2="170" y2="42" stroke={INK_MID} strokeWidth="0.6" />
          <text x="30" y="35" fill={SIGNAL} fontSize="8.5" fontFamily="ui-monospace, monospace" letterSpacing="0.28em">
            MOSS-TYPE LNG CARRIER
          </text>
          <text x="30" y="56" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.22em">
            ELEVATION · DUAL-FUEL 4-STROKE MACHINERY · AKIRA SCOPE
          </text>
        </motion.g>

        {/* Sea zone */}
        <motion.rect variants={fadeVariant} x="20" y={WL} width="780" height="130" fill="url(#seaGrad)" />

        {/* Waterline waves */}
        <motion.path
          variants={drawVariant}
          d={`M 20 ${WL} Q 60 ${WL - 4} 100 ${WL} T 180 ${WL} T 260 ${WL} T 340 ${WL} T 420 ${WL} T 500 ${WL} T 580 ${WL} T 660 ${WL} T 740 ${WL} T 800 ${WL}`}
          fill="none"
          stroke={INK_MID}
          strokeWidth="0.8"
        />
        {!reduce && (
          <motion.path
            d={`M 20 ${WL} Q 60 ${WL - 4} 100 ${WL} T 180 ${WL} T 260 ${WL} T 340 ${WL} T 420 ${WL} T 500 ${WL} T 580 ${WL} T 660 ${WL} T 740 ${WL} T 800 ${WL}`}
            fill="none"
            stroke={SIGNAL_LIGHT}
            strokeWidth="1"
            animate={{
              d: [
                `M 20 ${WL} Q 60 ${WL - 4} 100 ${WL} T 180 ${WL} T 260 ${WL} T 340 ${WL} T 420 ${WL} T 500 ${WL} T 580 ${WL} T 660 ${WL} T 740 ${WL} T 800 ${WL}`,
                `M 20 ${WL} Q 60 ${WL + 4} 100 ${WL} T 180 ${WL} T 260 ${WL} T 340 ${WL} T 420 ${WL} T 500 ${WL} T 580 ${WL} T 660 ${WL} T 740 ${WL} T 800 ${WL}`,
                `M 20 ${WL} Q 60 ${WL - 4} 100 ${WL} T 180 ${WL} T 260 ${WL} T 340 ${WL} T 420 ${WL} T 500 ${WL} T 580 ${WL} T 660 ${WL} T 740 ${WL} T 800 ${WL}`,
              ],
            }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
          />
        )}

        {/* --- Vessel: gentle roll --- */}
        <motion.g
          animate={reduce ? {} : { rotate: [-0.3, 0.3, -0.3] }}
          transition={reduce ? {} : { duration: 10, ease: 'easeInOut', repeat: Infinity }}
          style={{ transformOrigin: '420px 300px', transformBox: 'view-box' as 'view-box' }}
        >
          {/* Hull outline with proper LNG carrier proportions */}
          <motion.path
            variants={drawVariant}
            d={`
              M 60 ${DECK}
              L 60 ${WL - 2}
              L 62 ${WL + 8}
              Q 400 ${HULL_BOTTOM + 4} 700 ${WL + 8}
              L 750 ${WL - 6}
              L 762 ${WL - 4}
              Q 775 ${WL - 2} 775 ${WL + 10}
              Q 758 ${WL + 16} 750 ${WL - 2}
              L 748 ${WL - 6}
              L 748 ${FORECASTLE + 8}
              L 720 ${FORECASTLE + 2}
              L 690 ${FORECASTLE + 8}
              L 690 ${DECK}
              Z
            `}
            fill={HULL_FILL}
            stroke={INK}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />

          {/* Bulbous bow — subtle protrusion below waterline forward */}
          <motion.path
            variants={drawVariant}
            d={`M 748 ${WL + 2} Q 780 ${WL + 4} 780 ${WL + 14} Q 762 ${WL + 20} 750 ${WL + 12}`}
            fill={HULL_FILL}
            stroke={INK_MID}
            strokeWidth="0.9"
          />

          {/* Hull sheer highlight — subtle curve suggesting freeboard */}
          <motion.path
            variants={drawVariant}
            d={`M 60 ${WL - 2} Q 400 ${WL - 8} 700 ${WL - 4}`}
            fill="none"
            stroke={INK_LIGHT}
            strokeWidth="0.5"
          />

          {/* Weathering line just above waterline (boot topping) */}
          <motion.path
            variants={fadeVariant}
            d={`M 62 ${WL - 4} Q 400 ${WL - 6} 748 ${WL - 4}`}
            fill="none"
            stroke={SIGNAL_MID}
            strokeWidth="0.5"
            opacity="0.7"
          />

          {/* Main deck line */}
          <motion.line
            variants={drawVariant}
            x1="60" y1={DECK} x2="690" y2={DECK}
            stroke={INK} strokeWidth="1"
          />

          {/* Bulwark — a small vertical wall above the deck line running the length */}
          <motion.line
            variants={drawVariant}
            x1="152" y1={DECK - 5} x2="685" y2={DECK - 5}
            stroke={INK_MID}
            strokeWidth="0.7"
          />

          {/* Small hull portholes near stern */}
          <motion.g variants={fadeVariant}>
            {[80, 96, 112, 128, 144].map((x) => (
              <circle key={x} cx={x} cy={WL - 12} r="1.4" fill="none" stroke={INK_MID} strokeWidth="0.5" />
            ))}
          </motion.g>

          {/* --- 4 Moss spherical tanks --- */}
          {TANK_XS.map((cx, i) => (
            <g key={cx}>
              {/* Dome (upper hemisphere clipped to deck) */}
              <motion.circle
                variants={drawVariant}
                cx={cx} cy={DECK} r={TANK_R}
                fill="url(#domeShade)"
                stroke={INK}
                strokeWidth="1.3"
                clipPath={`url(#dome-clip-${i})`}
              />
              {/* Latitude curves — 3 arcs suggesting the sphere's roundness */}
              {[0.75, 0.5, 0.25].map((r, k) => (
                <motion.path
                  key={k}
                  variants={drawVariant}
                  d={`M ${cx - TANK_R * r} ${DECK - TANK_R * Math.sqrt(1 - r * r)} Q ${cx} ${DECK - TANK_R * Math.sqrt(1 - r * r) - 4} ${cx + TANK_R * r} ${DECK - TANK_R * Math.sqrt(1 - r * r)}`}
                  fill="none"
                  stroke={INK_LIGHT}
                  strokeWidth="0.5"
                  clipPath={`url(#dome-clip-${i})`}
                />
              ))}
              {/* Longitude meridian — visible curved line down centre of dome */}
              <motion.line
                variants={drawVariant}
                x1={cx} y1={DECK - TANK_R} x2={cx} y2={DECK}
                stroke={INK_MID}
                strokeWidth="0.5"
                clipPath={`url(#dome-clip-${i})`}
              />
              {/* Cargo dome cap on the crown */}
              <motion.rect
                variants={fadeVariant}
                x={cx - 10} y={DECK - TANK_R - 8}
                width="20" height="8"
                rx="1"
                fill={DOME_FILL}
                stroke={INK}
                strokeWidth="0.9"
              />
              {/* Cargo manifold pipes rising from crown */}
              <motion.line
                variants={drawVariant}
                x1={cx - 4} y1={DECK - TANK_R - 8} x2={cx - 4} y2={DECK - TANK_R - 20}
                stroke={INK} strokeWidth="0.9"
              />
              <motion.line
                variants={drawVariant}
                x1={cx + 4} y1={DECK - TANK_R - 8} x2={cx + 4} y2={DECK - TANK_R - 20}
                stroke={INK} strokeWidth="0.9"
              />
              {/* Tank number on dome */}
              <motion.text
                variants={fadeVariant}
                x={cx} y={DECK - TANK_R * 0.35}
                fill={INK_MID}
                fontSize="10"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                letterSpacing="0.14em"
                fontWeight="600"
              >
                {`No.${4 - i}`}
              </motion.text>
            </g>
          ))}

          {/* --- Signature Moss detail: tall vent/mooring masts between and after tanks --- */}
          {MAST_XS.map((mx) => (
            <motion.g key={mx} variants={fadeVariant}>
              <line x1={mx} y1={DECK} x2={mx} y2={DECK - 62} stroke={INK} strokeWidth="1.1" />
              {/* Cross-tree at top */}
              <line x1={mx - 5} y1={DECK - 56} x2={mx + 5} y2={DECK - 56} stroke={INK_MID} strokeWidth="0.6" />
              <line x1={mx - 3} y1={DECK - 62} x2={mx + 3} y2={DECK - 62} stroke={INK_MID} strokeWidth="0.5" />
              {/* Small light housing at the very top */}
              <circle cx={mx} cy={DECK - 64} r="1.4" fill={INK_MID} />
              {/* Base */}
              <rect x={mx - 3} y={DECK - 5} width="6" height="5" fill={DECK_FILL} stroke={INK_MID} strokeWidth="0.5" />
            </motion.g>
          ))}

          {/* Cross-deck cargo piping (visible red-tinted lines running between tanks — dashed) */}
          <motion.line
            variants={drawVariant}
            x1="175" y1={DECK - 12} x2="670" y2={DECK - 12}
            stroke={SIGNAL_MID}
            strokeWidth="0.7"
            strokeDasharray="4 3"
            opacity="0.75"
          />

          {/* --- Bridge / accommodation block at EXTREME STERN — 6 stories tall --- */}
          <motion.g variants={fadeVariant}>
            {/* Main block */}
            <rect
              x={BRIDGE_X} y={BRIDGE_TOP}
              width={BRIDGE_W} height={DECK - BRIDGE_TOP}
              fill="rgba(255,255,255,0.75)"
              stroke={INK}
              strokeWidth="1.1"
            />
            {/* 6 story window rows */}
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <g key={row}>
                <line
                  x1={BRIDGE_X + 4} y1={BRIDGE_TOP + 10 + row * 12}
                  x2={BRIDGE_X + BRIDGE_W - 4} y2={BRIDGE_TOP + 10 + row * 12}
                  stroke={INK_MID}
                  strokeWidth="0.5"
                />
                {/* Individual windows suggested by dots */}
                {[0.15, 0.35, 0.55, 0.75].map((t) => (
                  <circle
                    key={t}
                    cx={BRIDGE_X + 4 + (BRIDGE_W - 8) * t}
                    cy={BRIDGE_TOP + 6 + row * 12}
                    r="0.9"
                    fill={INK_MID}
                  />
                ))}
              </g>
            ))}
            {/* Wheelhouse (top level — larger windows) */}
            <rect
              x={BRIDGE_X - 4} y={BRIDGE_TOP - 8}
              width={BRIDGE_W + 8} height="10"
              fill="rgba(255,255,255,0.85)"
              stroke={INK}
              strokeWidth="0.9"
            />
            {/* Wing bridge cabs (extend beyond main block on either side) */}
            <rect x={BRIDGE_X - 12} y={BRIDGE_TOP - 4} width="8" height="8" fill={DECK_FILL} stroke={INK} strokeWidth="0.7" />
            <rect x={BRIDGE_X + BRIDGE_W + 4} y={BRIDGE_TOP - 4} width="8" height="8" fill={DECK_FILL} stroke={INK} strokeWidth="0.7" />
            {/* Radar mast */}
            <line x1={BRIDGE_X + BRIDGE_W / 2} y1={BRIDGE_TOP - 8} x2={BRIDGE_X + BRIDGE_W / 2} y2={BRIDGE_TOP - 50} stroke={INK} strokeWidth="1.2" />
            {/* Radar crossarm */}
            <line x1={BRIDGE_X + BRIDGE_W / 2 - 12} y1={BRIDGE_TOP - 34} x2={BRIDGE_X + BRIDGE_W / 2 + 12} y2={BRIDGE_TOP - 34} stroke={INK_MID} strokeWidth="0.7" />
            <line x1={BRIDGE_X + BRIDGE_W / 2 - 8} y1={BRIDGE_TOP - 42} x2={BRIDGE_X + BRIDGE_W / 2 + 8} y2={BRIDGE_TOP - 42} stroke={INK_MID} strokeWidth="0.6" />
            {/* Radar dome */}
            <circle cx={BRIDGE_X + BRIDGE_W / 2} cy={BRIDGE_TOP - 50} r="2.2" fill={INK} />
            {/* Antenna */}
            <line x1={BRIDGE_X + BRIDGE_W / 2} y1={BRIDGE_TOP - 52} x2={BRIDGE_X + BRIDGE_W / 2} y2={BRIDGE_TOP - 62} stroke={INK} strokeWidth="0.7" />
            {/* Deck access ladder detail */}
            <line x1={BRIDGE_X + BRIDGE_W - 2} y1={BRIDGE_TOP + 4} x2={BRIDGE_X + BRIDGE_W - 2} y2={DECK} stroke={INK_MID} strokeWidth="0.4" strokeDasharray="1 1" />
          </motion.g>

          {/* --- Funnel forward of bridge --- */}
          <motion.g variants={fadeVariant}>
            <rect x="158" y={DECK - 58} width="28" height="58" fill="rgba(255,255,255,0.7)" stroke={INK} strokeWidth="1.1" />
            {/* Funnel cap */}
            <rect x="154" y={DECK - 64} width="36" height="7" fill={INK_LIGHT} stroke={INK_MID} strokeWidth="0.7" />
            {/* Company band (red hint) */}
            <rect x="158" y={DECK - 50} width="28" height="6" fill={SIGNAL_LIGHT} stroke={SIGNAL_MID} strokeWidth="0.5" />
            {/* Exhaust hint */}
            <motion.line
              x1="172" y1={DECK - 64} x2="172" y2={DECK - 96}
              stroke={SIGNAL_MID}
              strokeWidth="0.8"
              strokeDasharray="2 3"
              animate={reduce ? { opacity: 0.5 } : { opacity: [0.35, 0.7, 0.35] }}
              transition={reduce ? {} : { duration: 3, ease: 'easeInOut', repeat: Infinity }}
            />
          </motion.g>

          {/* --- Engine room cutaway BELOW the accommodation --- */}
          <motion.rect
            variants={drawVariant}
            x="88" y={DECK + 4} width="98" height={WL - DECK - 8}
            fill="rgba(168,50,50,0.05)"
            stroke={SIGNAL}
            strokeWidth="1.4"
            strokeDasharray="3 2"
          />
          {!reduce && (
            <motion.ellipse
              cx="137" cy={(DECK + WL) / 2} rx="52" ry="20"
              fill="url(#engineGlow)"
              animate={{ opacity: [0.4, 0.75, 0.4] }}
              transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity }}
            />
          )}
          {/* Engine block */}
          <motion.rect
            variants={drawVariant}
            x="98" y={DECK + 15} width="78" height="24" rx="2"
            fill="rgba(168,50,50,0.20)"
            stroke={SIGNAL}
            strokeWidth="1.1"
          />
          {/* 6 cylinder heads */}
          {[108, 121, 134, 147, 160, 173].map((cx) => (
            <motion.rect
              key={cx}
              variants={drawVariant}
              x={cx - 3} y={DECK + 10} width="6" height="6" rx="1"
              fill={SIGNAL}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="0.4"
            />
          ))}
          {/* Crankshaft base */}
          <motion.line
            variants={drawVariant}
            x1="98" y1={DECK + 39} x2="176" y2={DECK + 39}
            stroke={SIGNAL}
            strokeWidth="1.5"
          />
          {/* Turbocharger housing at the aft end */}
          <motion.circle
            variants={drawVariant}
            cx="94" cy={DECK + 22} r="7"
            fill="rgba(168,50,50,0.15)"
            stroke={SIGNAL}
            strokeWidth="1"
          />
          <motion.line
            variants={drawVariant}
            x1="94" y1={DECK + 22} x2="98" y2={DECK + 26}
            stroke={SIGNAL_MID}
            strokeWidth="0.6"
          />
          {/* Coupling to propeller shaft */}
          <motion.line
            variants={drawVariant}
            x1="98" y1={DECK + 39} x2="88" y2={WL + 15}
            stroke={SIGNAL_MID}
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <motion.text
            variants={fadeVariant}
            x="137" y={DECK + 52}
            fill={SIGNAL}
            fontSize="5.5"
            fontFamily="ui-monospace, monospace"
            textAnchor="middle"
            letterSpacing="0.18em"
            fontWeight="700"
          >
            DUAL-FUEL 4-STROKE
          </motion.text>

          {/* --- Stern: rudder + propeller --- */}
          <motion.path
            variants={drawVariant}
            d={`M 66 ${WL + 6} L 66 ${WL + 34} L 78 ${WL + 34} L 78 ${WL + 6}`}
            fill={HULL_FILL}
            stroke={INK}
            strokeWidth="0.9"
          />
          <motion.line
            variants={drawVariant}
            x1="88" y1={WL + 15} x2="140" y2={WL + 12}
            stroke={INK_MID}
            strokeWidth="0.7"
            strokeDasharray="3 2"
          />
          <g transform={`translate(93, ${WL + 15})`}>
            <motion.circle variants={fadeVariant} cx="0" cy="0" r="12" fill="none" stroke={INK_LIGHT} strokeWidth="0.6" />
            {!reduce ? (
              <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, ease: 'linear', repeat: Infinity }}
                style={{ willChange: 'transform' }}
              >
                <use href="#propBlade" />
              </motion.g>
            ) : (
              <use href="#propBlade" />
            )}
            <circle cx="0" cy="0" r="2" fill={INK} />
          </g>

          {/* --- Bow: forecastle + anchor cluster + jack staff --- */}
          {/* Forecastle raised deck line */}
          <motion.line
            variants={drawVariant}
            x1="690" y1={FORECASTLE + 4} x2="748" y2={FORECASTLE + 8}
            stroke={INK_MID} strokeWidth="0.8"
          />
          {/* Jack staff */}
          <motion.line
            variants={drawVariant}
            x1="740" y1={FORECASTLE + 8} x2="740" y2={FORECASTLE - 14}
            stroke={INK} strokeWidth="0.9"
          />
          {/* Anchor cluster on hull side near bow */}
          <motion.g variants={fadeVariant}>
            <rect x="726" y={WL - 30} width="10" height="7" fill={INK_MID} />
            <line x1="731" y1={WL - 23} x2="731" y2={WL - 10} stroke={INK} strokeWidth="0.8" />
            {/* Anchor stock hint */}
            <path d={`M 727 ${WL - 8} L 731 ${WL - 4} L 735 ${WL - 8}`} fill="none" stroke={INK_MID} strokeWidth="0.6" />
          </motion.g>
          {/* Mooring winch on forecastle */}
          <motion.g variants={fadeVariant}>
            <rect x="700" y={FORECASTLE - 4} width="12" height="8" fill={DECK_FILL} stroke={INK} strokeWidth="0.7" />
            <circle cx="706" cy={FORECASTLE} r="2" fill={INK_MID} />
          </motion.g>
        </motion.g>

        {/* Callouts */}
        <motion.g variants={fadeVariant}>
          <Callout
            fromX={415} fromY={DECK - TANK_R - 12}
            toX={575} toY={95}
            label="CARGO · Moss spheres"
            sub="4 × spherical LNG containment"
          />
          <Callout
            fromX={295} fromY={DECK - 62}
            toX={340} toY={100}
            label="VENT MASTS"
            sub="Cargo tank pressure relief"
          />
          <Callout
            fromX={137} fromY={DECK + 4}
            toX={40} toY={430}
            label="ENGINE ROOM"
            sub="Below accommodation · AKIRA scope"
            signal
          />
          <Callout
            fromX={BRIDGE_X + BRIDGE_W / 2} fromY={BRIDGE_TOP - 50}
            toX={40} toY={100}
            label="BRIDGE · Accommodation"
            sub="Wheelhouse · ECR · 6 decks"
          />
          <Callout
            fromX={93} fromY={WL + 15}
            toX={200} toY={430}
            label="PROPULSION"
            sub="Single screw · rudder"
          />
          <Callout
            fromX={717} fromY={FORECASTLE + 2}
            toX={780} toY={100}
            label="BOW · Forecastle"
            sub="Anchors · mooring · bulbous bow"
            align="right"
          />
        </motion.g>

        {/* Scale bar */}
        <motion.g variants={fadeVariant} transform="translate(660, 430)">
          <line x1="0" y1="0" x2="120" y2="0" stroke={INK} strokeWidth="0.75" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke={INK} strokeWidth="0.75" />
          <line x1="60" y1="-2" x2="60" y2="2" stroke={INK} strokeWidth="0.5" />
          <line x1="120" y1="-3" x2="120" y2="3" stroke={INK} strokeWidth="0.75" />
          <text x="0" y="14" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">0</text>
          <text x="56" y="14" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">145</text>
          <text x="108" y="14" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">290 m</text>
        </motion.g>
      </motion.svg>
    </div>
  );
}

interface CalloutProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  label: string;
  sub: string;
  signal?: boolean;
  align?: 'left' | 'right';
}

function Callout({ fromX, fromY, toX, toY, label, sub, signal, align }: CalloutProps) {
  const stroke = signal ? SIGNAL_MID : INK_MID;
  const fill = signal ? SIGNAL : INK;
  const rightSide = align ? align === 'right' : toX > fromX;
  const anchor: 'start' | 'end' = rightSide ? 'start' : 'end';
  const labelX = rightSide ? toX + 4 : toX - 4;
  return (
    <g>
      <circle cx={fromX} cy={fromY} r="2.5" fill={fill} />
      <line
        x1={fromX} y1={fromY}
        x2={toX} y2={toY}
        stroke={stroke}
        strokeWidth="0.6"
        strokeDasharray="2 2"
      />
      <text
        x={labelX} y={toY}
        fill={fill}
        textAnchor={anchor}
        fontSize="8"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.16em"
        fontWeight="600"
      >
        {label}
      </text>
      <text
        x={labelX} y={toY + 11}
        fill={INK_MID}
        textAnchor={anchor}
        fontSize="6.5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        {sub}
      </text>
    </g>
  );
}
