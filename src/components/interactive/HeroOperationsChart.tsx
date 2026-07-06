'use client';

import { useMemo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

/**
 * HeroOperationsChart — realistic globe operations chart.
 *
 * Orthographic projection of Earth centred just east of Abu Dhabi so the
 * whole eastern-hemisphere port network sits on the visible face. Continent
 * silhouettes hand-authored at moderate detail from real lat/long polylines
 * so Africa, Europe, Arabia, India, SE Asia, and East Asia read as themselves.
 *
 * - Real orthographic projection (spherical trig, not stylised)
 * - Curved meridians & parallels (graticule)
 * - Real geographic port positions (lat / lon → x / y)
 * - Great-circle route arcs (slerp between endpoints)
 * - Sphere shading vignette
 * - Ships travelling actual great-circle paths
 * - Ports on the far side rendered as small limb indicators
 */

// ---------- projection --------------------------------------------------------

const R = 200;
const CX = 420;
const CY = 260;

// Globe centred at (24° N, 60° E) — puts Abu Dhabi almost dead-centre and shows
// all our ports except Houston (which sits on the far side and gets a limb marker).
const CENTER_LAT = 24;
const CENTER_LON = 60;

const DEG = Math.PI / 180;
const centerLatR = CENTER_LAT * DEG;
const centerLonR = CENTER_LON * DEG;
const cosC = Math.cos(centerLatR);
const sinC = Math.sin(centerLatR);

type Projected = { x: number; y: number; visible: boolean; z: number };

// ponytail: round to 2dp so SSR and CSR produce identical string output; kills hydration mismatch
const q = (n: number) => Math.round(n * 100) / 100;

function project(lon: number, lat: number): Projected {
  const φ = lat * DEG;
  const λ = lon * DEG;
  const dλ = λ - centerLonR;
  const cosPhi = Math.cos(φ);
  const sinPhi = Math.sin(φ);
  const cosDλ = Math.cos(dλ);
  const sinDλ = Math.sin(dλ);
  const cosC_ = sinC * sinPhi + cosC * cosPhi * cosDλ;
  const x = CX + R * cosPhi * sinDλ;
  const y = CY - R * (cosC * sinPhi - sinC * cosPhi * cosDλ);
  return { x: q(x), y: q(y), visible: cosC_ >= -0.02, z: cosC_ };
}

/** Great-circle arc (slerp) from A to B on unit sphere, projected to screen. */
function greatCircle(lon1: number, lat1: number, lon2: number, lat2: number, steps = 64) {
  const φ1 = lat1 * DEG;
  const λ1 = lon1 * DEG;
  const φ2 = lat2 * DEG;
  const λ2 = lon2 * DEG;
  // Cartesian
  const p1 = [Math.cos(φ1) * Math.cos(λ1), Math.cos(φ1) * Math.sin(λ1), Math.sin(φ1)];
  const p2 = [Math.cos(φ2) * Math.cos(λ2), Math.cos(φ2) * Math.sin(λ2), Math.sin(φ2)];
  const dot = p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2];
  const ω = Math.acos(Math.max(-1, Math.min(1, dot)));
  if (ω < 1e-6) {
    const p = project(lon1, lat1);
    return [{ x: p.x, y: p.y, visible: p.visible, z: p.z }];
  }
  const sinω = Math.sin(ω);
  const out: Projected[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = Math.sin((1 - t) * ω) / sinω;
    const b = Math.sin(t * ω) / sinω;
    const x = a * p1[0] + b * p2[0];
    const y = a * p1[1] + b * p2[1];
    const z = a * p1[2] + b * p2[2];
    const norm = Math.sqrt(x * x + y * y + z * z);
    const lat = Math.asin(z / norm) / DEG;
    const lon = Math.atan2(y / norm, x / norm) / DEG;
    out.push(project(lon, lat));
  }
  return out;
}

/** Turn a projected polyline into an SVG path, breaking at horizon crossings. */
function polyToPath(points: Projected[]): string {
  let d = '';
  let pen = false;
  for (const p of points) {
    if (!p.visible) {
      pen = false;
      continue;
    }
    d += (pen ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' ';
    pen = true;
  }
  return d.trim();
}

/** Convert a list of [lon, lat] pairs to a projected polyline. */
function projectPoly(coords: readonly [number, number][]): Projected[] {
  return coords.map(([lon, lat]) => project(lon, lat));
}

// ---------- data --------------------------------------------------------------

// Continent outlines — hand-authored simplified coastline polylines.
// Order lon, lat. Each closes back on itself.
const AFRICA: readonly [number, number][] = [
  [-17, 20], [-16, 14], [-13, 12], [-9, 6], [-5, 4], [3, 6], [8, 4], [9, 2],
  [11, 0], [13, -5], [11, -14], [12, -21], [14, -28], [18, -34], [24, -34],
  [27, -33], [30, -30], [33, -25], [37, -20], [40, -15], [42, -10], [43, -4],
  [45, 4], [48, 8], [50, 12], [45, 11], [43, 12], [40, 15], [39, 18],
  [37, 21], [34, 27], [30, 31], [24, 32], [15, 32], [8, 34], [0, 34],
  [-8, 34], [-13, 27], [-17, 20],
];

const EUROPE: readonly [number, number][] = [
  [-9, 44], [-5, 36], [3, 36], [10, 38], [14, 40], [18, 40], [22, 39], [26, 36],
  [30, 36], [34, 36], [40, 36], [46, 40], [50, 45], [45, 48], [40, 55],
  [30, 60], [18, 60], [8, 58], [3, 55], [-1, 55], [-4, 55], [-6, 50], [-9, 44],
];

const UK_IRELAND: readonly [number, number][] = [
  [-10, 50], [-5, 49], [-1, 50], [1, 53], [-2, 58], [-6, 58], [-10, 55], [-10, 50],
];

const SCANDINAVIA: readonly [number, number][] = [
  [5, 58], [12, 55], [16, 58], [22, 60], [28, 65], [30, 70], [22, 70], [12, 66], [5, 60], [5, 58],
];

const ARABIA: readonly [number, number][] = [
  [34, 30], [38, 28], [43, 25], [46, 20], [50, 18], [54, 17], [58, 20], [59, 24],
  [56, 26], [53, 27], [50, 29], [48, 30], [45, 30], [42, 30], [38, 30], [34, 30],
];

const INDIA_SUB: readonly [number, number][] = [
  [60, 30], [67, 27], [72, 21], [73, 15], [78, 8], [80, 13], [83, 18],
  [88, 21], [92, 22], [95, 26], [92, 28], [86, 26], [80, 27], [75, 30], [60, 30],
];

const SE_ASIA_MALAY: readonly [number, number][] = [
  [98, 15], [100, 10], [102, 5], [104, 1], [104, -3], [110, -7], [118, -8],
  [125, -8], [128, -3], [125, 3], [120, 6], [115, 5], [108, 4], [103, 4], [100, 5], [98, 15],
];

const CHINA_EAST_ASIA: readonly [number, number][] = [
  [88, 30], [100, 28], [104, 20], [108, 21], [115, 22], [118, 25], [122, 30],
  [122, 37], [124, 40], [130, 43], [135, 48], [130, 45], [126, 42], [120, 40],
  [115, 37], [110, 34], [104, 34], [95, 34], [88, 30],
];

const KOREA: readonly [number, number][] = [
  [126, 38], [128, 35], [130, 36], [130, 39], [127, 40], [126, 38],
];

const JAPAN_MAIN: readonly [number, number][] = [
  [131, 32], [135, 34], [140, 36], [142, 40], [145, 44], [141, 45], [138, 40], [133, 34], [131, 32],
];

const JAPAN_NORTH: readonly [number, number][] = [
  [140, 42], [144, 42], [146, 46], [141, 46], [140, 42],
];

const MADAGASCAR: readonly [number, number][] = [
  [43, -25], [48, -25], [50, -18], [49, -12], [46, -16], [43, -22], [43, -25],
];

const SRI_LANKA: readonly [number, number][] = [
  [80, 6], [82, 6], [82, 9], [80, 9], [80, 6],
];

const CONTINENTS: readonly (readonly [number, number][])[] = [
  AFRICA, EUROPE, UK_IRELAND, SCANDINAVIA, ARABIA, INDIA_SUB,
  SE_ASIA_MALAY, CHINA_EAST_ASIA, KOREA, JAPAN_MAIN, JAPAN_NORTH,
  MADAGASCAR, SRI_LANKA,
];

// Only Abu Dhabi (HQ) — no other port markers, no routes, no ship animations
type Port = { id: string; label: string; lon: number; lat: number };

const ORIGIN: Port = { id: 'abu-dhabi', label: 'Abu Dhabi', lon: 54.4, lat: 24.5 };

// Retained for import compatibility elsewhere — no markers rendered on the chart
const _UNUSED_PORTS: readonly Port[] = [
  { id: 'dubai',     label: 'Dubai',      lon:  55.3, lat: 25.0 },
  { id: 'fujairah',  label: 'Fujairah',   lon:  56.3, lat: 25.1 },
  { id: 'suez',      label: 'Suez',       lon:  32.5, lat: 30.0 },
  { id: 'piraeus',   label: 'Piraeus',    lon:  23.6, lat: 37.9 },
  { id: 'gibraltar', label: 'Gibraltar',  lon:  -5.4, lat: 36.1 },
  { id: 'rotterdam', label: 'Rotterdam',  lon:   4.5, lat: 51.9 },
  { id: 'hamburg',   label: 'Hamburg',    lon:   9.9, lat: 53.5 },
  { id: 'antwerp',   label: 'Antwerp',    lon:   4.4, lat: 51.2 },
  { id: 'singapore', label: 'Singapore',  lon: 103.8, lat:  1.3 },
  { id: 'busan',     label: 'Busan',      lon: 129.0, lat: 35.1 },
  { id: 'yokohama',  label: 'Yokohama',   lon: 139.6, lat: 35.4 },
  { id: 'houston',   label: 'Houston',    lon: -95.3, lat: 29.7 },
];

// Empty — no active routes claimed
const PORTS: readonly Port[] = [];
const ANIMATED_ROUTES: readonly string[] = [];

// ---------- palette -----------------------------------------------------------

const INK       = 'rgba(31,27,23,0.85)';
const INK_MID   = 'rgba(31,27,23,0.55)';
const INK_LIGHT = 'rgba(31,27,23,0.32)';
const INK_FAINT = 'rgba(31,27,23,0.15)';
const LAND      = 'rgba(31,27,23,0.09)';
const SEA_LIMB  = 'rgba(31,27,23,0.04)';
const SIGNAL    = 'rgba(168,50,50,0.9)';
const SIGNAL_MID = 'rgba(168,50,50,0.55)';

// ---------- component ---------------------------------------------------------

interface HeroOperationsChartProps {
  className?: string;
}

export function HeroOperationsChart({ className }: HeroOperationsChartProps) {
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
    rx.set(-ny * 3);
    ry.set( nx * 3);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  const perspective = useTransform(
    [rxs, rys] as [typeof rxs, typeof rys],
    ([x, y]) => `perspective(1600px) rotateX(${x}deg) rotateY(${y}deg)`,
  );

  // Pre-compute projected geometry
  const continentPaths = useMemo(
    () => CONTINENTS.map((c) => polyToPath(projectPoly(c))),
    [],
  );

  const meridianPaths = useMemo(() => {
    const paths: string[] = [];
    for (let lon = -180; lon < 180; lon += 30) {
      const pts: Projected[] = [];
      for (let lat = -85; lat <= 85; lat += 3) pts.push(project(lon, lat));
      paths.push(polyToPath(pts));
    }
    return paths;
  }, []);

  const parallelPaths = useMemo(() => {
    const paths: string[] = [];
    for (const lat of [-60, -30, 0, 30, 60]) {
      const pts: Projected[] = [];
      for (let lon = -180; lon <= 180; lon += 3) pts.push(project(lon, lat));
      paths.push(polyToPath(pts));
    }
    return paths;
  }, []);

  const originProj = useMemo(() => project(ORIGIN.lon, ORIGIN.lat), []);

  const portProjections = useMemo(
    () => PORTS.map((p) => ({ port: p, proj: project(p.lon, p.lat) })),
    [],
  );

  const routes = useMemo(() =>
    PORTS.map((p) => {
      const arc = greatCircle(ORIGIN.lon, ORIGIN.lat, p.lon, p.lat, 80);
      return { port: p, arc, d: polyToPath(arc) };
    }), []);

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
      transition: { duration: reduce ? 0 : 1.6, ease: [0.16, 1, 0.3, 1] },
    },
  };
  const fadeVariant: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: '1600px' }}
    >
      <motion.svg
        viewBox="0 0 820 520"
        role="img"
        aria-label="Global service network — orthographic operations chart"
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
          {/* Sphere shading — subtle radial for 3D feel */}
          <radialGradient id="sphereShade" cx="42%" cy="38%" r="65%">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.35)" />
            <stop offset="55%" stopColor="rgba(31,27,23,0.02)" />
            <stop offset="100%" stopColor="rgba(31,27,23,0.14)" />
          </radialGradient>

          {/* Ship silhouette */}
          <g id="shipMark">
            <path d="M -7 0 L 6 -3 L 6 3 Z" fill={SIGNAL} stroke="rgba(255,255,255,0.5)" strokeWidth="0.4" />
          </g>

          <clipPath id="globeClip">
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {/* Chart title */}
        <motion.g variants={fadeVariant}>
          <line x1="30" y1="42" x2="170" y2="42" stroke={INK_MID} strokeWidth="0.6" />
          <text x="30" y="35" fill={SIGNAL} fontSize="8.5" fontFamily="ui-monospace, monospace" letterSpacing="0.28em">
            AKIRA · MARINE SOLUTIONS
          </text>
          <text x="30" y="56" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.22em">
            HQ · ABU DHABI · UAE · EST FEB 2026
          </text>
        </motion.g>

        {/* Globe */}
        <g clipPath="url(#globeClip)">
          {/* Sea fill */}
          <motion.circle variants={fadeVariant} cx={CX} cy={CY} r={R} fill={SEA_LIMB} />

          {/* Parallels */}
          <motion.g variants={fadeVariant}>
            {parallelPaths.map((d, i) => (
              <path key={`par-${i}`} d={d} fill="none" stroke={INK_FAINT} strokeWidth="0.45" />
            ))}
          </motion.g>

          {/* Meridians */}
          <motion.g variants={fadeVariant}>
            {meridianPaths.map((d, i) => (
              <path key={`mer-${i}`} d={d} fill="none" stroke={INK_FAINT} strokeWidth="0.45" />
            ))}
          </motion.g>

          {/* Continents */}
          <motion.g variants={fadeVariant}>
            {continentPaths.map((d, i) => (
              <path
                key={`cont-${i}`}
                d={d}
                fill={LAND}
                stroke={INK_MID}
                strokeWidth="0.6"
                strokeLinejoin="round"
              />
            ))}
          </motion.g>

          {/* Sphere shading overlay */}
          <circle cx={CX} cy={CY} r={R} fill="url(#sphereShade)" pointerEvents="none" />
        </g>

        {/* Globe rim */}
        <motion.circle
          variants={fadeVariant}
          cx={CX} cy={CY} r={R}
          fill="none" stroke={INK} strokeWidth="1"
        />
        <motion.circle
          variants={fadeVariant}
          cx={CX} cy={CY} r={R + 3}
          fill="none" stroke={INK_FAINT} strokeWidth="0.6"
        />

        {/* Routes */}
        <g>
          {routes.map(({ port, arc, d }, i) => {
            const isActive = ANIMATED_ROUTES.includes(port.id);
            const endPoint = arc[arc.length - 1];
            const startVisible = originProj.visible;
            if (!d || !startVisible) return null;
            return (
              <g key={`route-${port.id}`}>
                <motion.path
                  variants={drawVariant}
                  d={d}
                  fill="none"
                  stroke={isActive ? SIGNAL_MID : INK_MID}
                  strokeWidth={isActive ? 1 : 0.75}
                  strokeDasharray="4 3"
                  opacity={isActive ? 0.75 : 0.4}
                  strokeLinecap="round"
                />
                {!reduce && isActive && (
                  <motion.path
                    d={d}
                    fill="none"
                    stroke={SIGNAL}
                    strokeWidth="1.2"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 0, opacity: 0 }}
                    animate={{ strokeDashoffset: -80, opacity: 0.9 }}
                    transition={{
                      strokeDashoffset: { duration: 6, ease: 'linear', repeat: Infinity },
                      opacity: { duration: 0.8, delay: 1 + i * 0.2, ease: 'easeOut' },
                    }}
                  />
                )}
                {!reduce && isActive && endPoint.visible && (
                  <ShipOnArc arc={arc} delay={1.5 + i * 0.8} />
                )}
              </g>
            );
          })}
        </g>

        {/* Ports */}
        {portProjections.map(({ port, proj }) => (
          <motion.g key={port.id} variants={fadeVariant}>
            {proj.visible ? (
              <PortMarker port={port} proj={proj} />
            ) : (
              <LimbIndicator port={port} />
            )}
          </motion.g>
        ))}

        {/* Origin — Abu Dhabi */}
        {originProj.visible && (
          <g>
            {!reduce &&
              [0, 1.3, 2.6].map((delay) => (
                <motion.circle
                  key={delay}
                  cx={originProj.x} cy={originProj.y} r={4}
                  fill="none" stroke={SIGNAL} strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.9 }}
                  animate={{ scale: [1, 5], opacity: [0.9, 0] }}
                  transition={{ duration: 3.9, ease: 'easeOut', repeat: Infinity, delay }}
                  style={{ transformOrigin: `${originProj.x}px ${originProj.y}px`, transformBox: 'view-box' as 'view-box' }}
                />
              ))}
            <motion.circle variants={fadeVariant} cx={originProj.x} cy={originProj.y} r="6" fill={SIGNAL} />
            <motion.circle variants={fadeVariant} cx={originProj.x} cy={originProj.y} r="2.5" fill="white" />
            <motion.g variants={fadeVariant}>
              <text
                x={originProj.x + 10}
                y={originProj.y - 8}
                fill={SIGNAL}
                fontSize="8.5"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.14em"
                fontWeight="700"
              >
                ABU DHABI · HQ
              </text>
              <text
                x={originProj.x + 10}
                y={originProj.y + 3}
                fill={INK_MID}
                fontSize="6.5"
                fontFamily="ui-monospace, monospace"
                letterSpacing="0.14em"
              >
                24°32′N 54°36′E
              </text>
            </motion.g>
          </g>
        )}

        {/* Compass rose top-right */}
        <motion.g variants={fadeVariant} transform="translate(740, 90)">
          <CompassRose />
        </motion.g>

        {/* Scale + status */}
        <motion.g variants={fadeVariant} transform="translate(30, 480)">
          <line x1="0" y1="0" x2="80" y2="0" stroke={INK} strokeWidth="0.75" />
          <line x1="0" y1="-3" x2="0" y2="3" stroke={INK} strokeWidth="0.75" />
          <line x1="40" y1="-2" x2="40" y2="2" stroke={INK} strokeWidth="0.5" />
          <line x1="80" y1="-3" x2="80" y2="3" stroke={INK} strokeWidth="0.75" />
          <text x="0" y="14" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">0</text>
          <text x="35" y="14" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">2500</text>
          <text x="72" y="14" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.14em">5000 NM</text>
        </motion.g>

      </motion.svg>
    </div>
  );
}

// ---------- port sub-components ----------------------------------------------

function PortMarker({ port, proj }: { port: Port; proj: Projected }) {
  // Label always to the right unless we're on the right edge
  const rightSide = proj.x > CX + 40;
  const labelX = rightSide ? proj.x - 8 : proj.x + 8;
  const textAnchor: 'start' | 'end' = rightSide ? 'end' : 'start';
  return (
    <g>
      <circle cx={proj.x} cy={proj.y} r="3" fill={INK} />
      <circle cx={proj.x} cy={proj.y} r="5.5" fill="none" stroke={INK_MID} strokeWidth="0.5" />
      <text
        x={labelX}
        y={proj.y + 3}
        fill={INK}
        fontSize="7.5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.15em"
        textAnchor={textAnchor}
      >
        {port.label.toUpperCase()}
      </text>
    </g>
  );
}

/**
 * Port sits on the far side — place a small chevron at the globe's limb
 * pointing outward, indicating direction of travel over horizon.
 */
function LimbIndicator({ port }: { port: Port }) {
  // Project onto the horizon by clamping the visibility
  // Use bearing from centre as angle around the limb.
  const φ1 = CENTER_LAT * DEG;
  const λ1 = CENTER_LON * DEG;
  const φ2 = port.lat * DEG;
  const λ2 = port.lon * DEG;
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const bearing = Math.atan2(y, x);
  const px = q(CX + Math.sin(bearing) * (R + 8));
  const py = q(CY - Math.cos(bearing) * (R + 8));
  const labelX = q(CX + Math.sin(bearing) * (R + 22));
  const labelY = q(CY - Math.cos(bearing) * (R + 22));
  const limbX = q(CX + Math.sin(bearing) * R);
  const limbY = q(CY - Math.cos(bearing) * R);
  return (
    <g>
      <circle cx={px} cy={py} r="2.5" fill="none" stroke={INK_MID} strokeWidth="0.6" />
      <line
        x1={limbX}
        y1={limbY}
        x2={px}
        y2={py}
        stroke={INK_LIGHT}
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />
      <text
        x={labelX}
        y={labelY + 3}
        fill={INK_MID}
        fontSize="6.5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.15em"
        textAnchor="middle"
      >
        {port.label.toUpperCase()}
      </text>
      <text
        x={labelX}
        y={labelY + 12}
        fill={INK_LIGHT}
        fontSize="5.5"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.14em"
        textAnchor="middle"
      >
        OVER HORIZON
      </text>
    </g>
  );
}

// ---------- ship animation ----------------------------------------------------

function ShipOnArc({ arc, delay }: { arc: Projected[]; delay: number }) {
  const visiblePoints = arc.filter((p) => p.visible);
  if (visiblePoints.length < 2) return null;
  const withAngle = visiblePoints.map((p, i) => {
    const next = visiblePoints[Math.min(i + 1, visiblePoints.length - 1)];
    const angle = (Math.atan2(next.y - p.y, next.x - p.x) * 180) / Math.PI;
    return { x: p.x, y: p.y, angle };
  });

  return (
    <motion.g
      animate={{
        x: withAngle.map((p) => p.x),
        y: withAngle.map((p) => p.y),
        rotate: withAngle.map((p) => p.angle),
      }}
      transition={{
        duration: 8,
        ease: 'linear',
        repeat: Infinity,
        delay,
      }}
      style={{ willChange: 'transform' }}
    >
      <use href="#shipMark" />
    </motion.g>
  );
}

// ---------- compass rose ------------------------------------------------------

function CompassRose() {
  return (
    <g>
      <circle cx="0" cy="0" r="42" fill="none" stroke={INK_MID} strokeWidth="0.7" />
      <circle cx="0" cy="0" r="34" fill="none" stroke={INK_LIGHT} strokeWidth="0.4" />

      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={Math.cos(rad) * 34} y1={Math.sin(rad) * 34}
            x2={Math.cos(rad) * 42} y2={Math.sin(rad) * 42}
            stroke={INK_MID} strokeWidth="0.7"
          />
        );
      })}
      {[45, 135, 225, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={Math.cos(rad) * 36} y1={Math.sin(rad) * 36}
            x2={Math.cos(rad) * 42} y2={Math.sin(rad) * 42}
            stroke={INK_LIGHT} strokeWidth="0.4"
          />
        );
      })}

      <text x="0" y="-46" fill={SIGNAL} fontSize="7"
        fontFamily="ui-monospace, monospace" letterSpacing="0.2em"
        textAnchor="middle" fontWeight="700">N</text>
      <path d="M 0 -30 L -3 -20 L 0 -22 L 3 -20 Z" fill={SIGNAL} />

      {/* Anchor + wave — AKIRA motif */}
      <g transform="translate(0, 4)">
        <line x1="-8" y1="-10" x2="8" y2="-10" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="0"  y1="-10" x2="0" y2="8"  stroke={INK} strokeWidth="1.4" />
        <circle cx="0" cy="-12" r="2" fill="none" stroke={INK} strokeWidth="1" />
        <path d="M -8 8 Q -6 12 -3 12" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M  8 8 Q  6 12  3 12" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M -14 15 Q -7 11 0 15 T 14 15" fill="none" stroke={SIGNAL} strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </g>
  );
}
