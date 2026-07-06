'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Per-page signature graphics for PageHero.
 *
 * Each one shares the same drawing language (ink hairlines on paper, red signal
 * accent, ui-monospace labels, ~200×160 SVG canvas). They read as one family
 * but each says something specific about the page it lives on.
 */

const INK       = 'rgba(31,27,23,0.85)';
const INK_MID   = 'rgba(31,27,23,0.55)';
const INK_LIGHT = 'rgba(31,27,23,0.32)';
const INK_FAINT = 'rgba(31,27,23,0.15)';
const SIGNAL    = 'rgba(168,50,50,0.9)';
const SIGNAL_MID = 'rgba(168,50,50,0.55)';

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface SignatureProps {
  className?: string;
}

const FRAME: React.CSSProperties = { overflow: 'visible' };

// ---------- ABOUT — Anchor + wave motif (from AKIRA logo) --------------------
export function AboutSignature({ className }: SignatureProps) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="AKIRA anchor motif" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="EST · FEB 2026 · ABU DHABI" />
      <g transform="translate(100, 100)">
        {/* Ring */}
        <circle cx="0" cy="-40" r="6" fill="none" stroke={INK} strokeWidth="2" />
        {/* Shank */}
        <line x1="0" y1="-34" x2="0" y2="26" stroke={INK} strokeWidth="2.5" />
        {/* Stock (horizontal bar) */}
        <line x1="-22" y1="-24" x2="22" y2="-24" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        {/* Left fluke */}
        <path d="M -22 26 Q -18 40 -6 40" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M -22 26 Q -30 15 -22 8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        {/* Right fluke */}
        <path d="M 22 26 Q 18 40 6 40" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 22 26 Q 30 15 22 8" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        {/* Wave beneath — signal red */}
        <motion.path
          d="M -38 55 Q -19 45 0 55 T 38 55"
          fill="none" stroke={SIGNAL} strokeWidth="2.5" strokeLinecap="round"
          animate={reduce ? { pathLength: 1 } : { pathLength: [0.4, 1, 0.4] }}
          transition={reduce ? {} : { duration: 4, ease: 'easeInOut', repeat: Infinity }}
        />
      </g>
    </svg>
  );
}

// ---------- SERVICES — Numbered filing tab --------------------------------------
export function ServicesSignature({ className }: SignatureProps) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Services filing tab" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="SVC · 4 LINES" />
      {/* Filing tab stack */}
      {[0, 1, 2, 3].map((i) => (
        <motion.g
          key={i}
          initial={reduce ? {} : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOutExpo, delay: 0.15 * i }}
        >
          <rect
            x={50 - i * 6}
            y={50 + i * 22}
            width={100 + i * 12}
            height="30"
            fill="rgba(255,255,255,0.4)"
            stroke={INK_MID}
            strokeWidth="0.75"
          />
          {/* Red tab marker on active card */}
          {i === 3 && <rect x={50 - i * 6} y={50 + i * 22} width="4" height="30" fill={SIGNAL} />}
          <text
            x={62 - i * 6}
            y={70 + i * 22}
            fill={i === 3 ? INK : INK_MID}
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            letterSpacing="0.22em"
          >
            {`0${i + 1} · ${['PLAN','MAJOR','LNG','24/7'][i]}`}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

// ---------- EXPERTISE — Engineering caliper -------------------------------------
export function ExpertiseSignature({ className }: SignatureProps) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Vernier caliper" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="TOL · ±0.02 mm" />
      {/* Main bar */}
      <rect x="30" y="90" width="140" height="10" fill="rgba(255,255,255,0.4)" stroke={INK} strokeWidth="1.2" />
      {/* Fixed jaw */}
      <rect x="30" y="60" width="14" height="55" fill="rgba(31,27,23,0.05)" stroke={INK} strokeWidth="1.2" />
      {/* Sliding jaw — animated */}
      <motion.g
        animate={reduce ? { x: 0 } : { x: [0, 16, 0] }}
        transition={reduce ? {} : { duration: 5, ease: 'easeInOut', repeat: Infinity }}
      >
        <rect x="110" y="60" width="14" height="55" fill="rgba(31,27,23,0.05)" stroke={INK} strokeWidth="1.2" />
        {/* Vernier scale plate */}
        <rect x="94" y="100" width="48" height="20" fill="rgba(255,255,255,0.55)" stroke={INK_MID} strokeWidth="0.75" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={i}
            x1={97 + i * 5}
            y1={102}
            x2={97 + i * 5}
            y2={i % 5 === 0 ? 112 : 108}
            stroke={INK_MID}
            strokeWidth="0.5"
          />
        ))}
        <text x="118" y="130" fill={SIGNAL} fontSize="6.5" fontFamily="ui-monospace, monospace" letterSpacing="0.16em" textAnchor="middle">
          17.42
        </text>
      </motion.g>
      {/* Main scale ticks */}
      {[45, 55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155].map((x) => (
        <line key={x} x1={x} y1="86" x2={x} y2={x % 20 === 5 ? 78 : 82} stroke={INK_MID} strokeWidth="0.5" />
      ))}
    </svg>
  );
}

// ---------- CAPABILITIES — Gauge cluster ---------------------------------------
export function CapabilitiesSignature({ className }: SignatureProps) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Instrument gauges" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="GAUGE · LIVE" />
      {/* Two gauges */}
      {[{ cx: 68, label: 'RPM' }, { cx: 132, label: 'BAR' }].map((g, i) => (
        <g key={g.label} transform={`translate(${g.cx}, 100)`}>
          <circle cx="0" cy="0" r="34" fill="rgba(255,255,255,0.55)" stroke={INK} strokeWidth="1.2" />
          <circle cx="0" cy="0" r="28" fill="none" stroke={INK_FAINT} strokeWidth="0.5" />
          {/* Ticks */}
          {Array.from({ length: 11 }).map((_, k) => {
            const ang = -Math.PI * 0.75 + (k / 10) * Math.PI * 1.5;
            const inner = k % 5 === 0 ? 22 : 26;
            return (
              <line
                key={k}
                x1={Math.cos(ang) * inner}
                y1={Math.sin(ang) * inner}
                x2={Math.cos(ang) * 30}
                y2={Math.sin(ang) * 30}
                stroke={k > 7 ? SIGNAL_MID : INK_MID}
                strokeWidth={k % 5 === 0 ? 1 : 0.5}
              />
            );
          })}
          {/* Needle — sweeps */}
          <motion.line
            x1="0" y1="0"
            x2={reduce ? Math.cos(-Math.PI * 0.15) * 26 : 0}
            y2={reduce ? Math.sin(-Math.PI * 0.15) * 26 : 0}
            stroke={SIGNAL} strokeWidth="1.5" strokeLinecap="round"
            animate={
              reduce
                ? {}
                : (() => {
                    const arr = Array.from({ length: 12 }, (_, j) => {
                      const t = j / 11;
                      const a = -Math.PI * 0.75 + t * Math.PI * 1.3;
                      return { x2: Math.cos(a) * 26, y2: Math.sin(a) * 26 };
                    });
                    return {
                      x2: arr.map((p) => p.x2),
                      y2: arr.map((p) => p.y2),
                    };
                  })()
            }
            transition={reduce ? {} : { duration: 5 + i, ease: 'easeInOut', repeat: Infinity, delay: i * 0.5 }}
          />
          <circle cx="0" cy="0" r="2.5" fill={INK} />
          <text x="0" y="18" fill={INK_MID} fontSize="6.5" fontFamily="ui-monospace, monospace" letterSpacing="0.2em" textAnchor="middle">
            {g.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ---------- TECHNICAL — Mini engine cutaway -------------------------------------
export function TechnicalSignature({ className }: SignatureProps) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Engine cutaway" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="DF-4S · 4-STROKE" />
      {/* Block */}
      <rect x="35" y="60" width="130" height="90" fill="rgba(255,255,255,0.4)" stroke={INK} strokeWidth="1.2" />
      {/* 3 cylinders */}
      {[55, 90, 125].map((x, i) => (
        <g key={x}>
          <rect x={x - 8} y="65" width="16" height="60" fill="rgba(31,27,23,0.06)" stroke={INK_MID} strokeWidth="0.75" />
          {/* Piston — moving */}
          <motion.rect
            x={x - 6} width="12" height="12" fill={INK_MID}
            animate={reduce ? { y: 90 } : { y: [72, 108, 72] }}
            transition={reduce ? {} : { duration: 2.6, ease: 'easeInOut', repeat: Infinity, delay: i * 0.4 }}
          />
          {/* Injector — red */}
          <motion.circle
            cx={x} cy="60" r="2.5" fill={SIGNAL}
            animate={reduce ? { opacity: 0.9 } : { opacity: [0.6, 1, 0.6] }}
            transition={reduce ? {} : { duration: 1.8, ease: 'easeInOut', repeat: Infinity, delay: i * 0.3 }}
          />
        </g>
      ))}
      {/* Common rail */}
      <line x1="45" y1="60" x2="155" y2="60" stroke={INK} strokeWidth="1.2" />
      {/* Crankshaft */}
      <line x1="45" y1="140" x2="155" y2="140" stroke={INK} strokeWidth="1.5" />
      {[55, 90, 125].map((x) => (
        <circle key={x} cx={x} cy="140" r="4" fill="rgba(31,27,23,0.06)" stroke={INK} strokeWidth="0.75" />
      ))}
    </svg>
  );
}

// ---------- CERTIFICATIONS — Wax-seal badge -------------------------------------
export function CertificationsSignature({ className }: SignatureProps) {
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Certification seal" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="CERT · ATTESTED" />
      {/* Outer scalloped seal */}
      <g transform="translate(100, 100)">
        <path
          d={buildScallop(40, 16)}
          fill="rgba(168,50,50,0.12)"
          stroke={SIGNAL_MID}
          strokeWidth="0.75"
        />
        <circle cx="0" cy="0" r="34" fill="rgba(255,255,255,0.6)" stroke={INK} strokeWidth="1" />
        <circle cx="0" cy="0" r="28" fill="none" stroke={INK_LIGHT} strokeWidth="0.5" strokeDasharray="2 3" />
        {/* Star */}
        <path
          d="M 0 -18 L 4.5 -6 L 18 -6 L 7 3 L 11 15 L 0 8 L -11 15 L -7 3 L -18 -6 L -4.5 -6 Z"
          fill={SIGNAL}
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="0.5"
        />
        {/* Ribbon tails */}
        <path d="M -8 32 L -12 55 L -6 50 L -4 60 L 0 45" fill={SIGNAL} stroke={SIGNAL_MID} strokeWidth="0.5" />
        <path d="M  8 32 L 12 55 L  6 50 L  4 60 L 0 45" fill={SIGNAL} stroke={SIGNAL_MID} strokeWidth="0.5" />
      </g>
    </svg>
  );
}

// ---------- CONTACT — Signal beacon / dispatch tag ------------------------------
export function ContactSignature({ className }: SignatureProps) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Signal beacon" className={`w-full max-w-[220px] h-auto ${className ?? ''}`} style={FRAME}>
      <SignatureFrame label="DISPATCH · LIVE" />
      {/* Base */}
      <rect x="70" y="140" width="60" height="14" fill="rgba(31,27,23,0.08)" stroke={INK} strokeWidth="1" />
      <line x1="65" y1="154" x2="135" y2="154" stroke={INK} strokeWidth="1.2" />
      {/* Mast */}
      <line x1="100" y1="140" x2="100" y2="70" stroke={INK} strokeWidth="1.5" />
      {/* Lamp housing */}
      <rect x="86" y="55" width="28" height="18" rx="3" fill="rgba(255,255,255,0.55)" stroke={INK} strokeWidth="1.2" />
      {/* Emitting waves — signal pulses */}
      {!reduce &&
        [0, 0.7, 1.4].map((delay, i) => (
          <motion.circle
            key={i}
            cx="100" cy="64" r={16}
            fill="none" stroke={SIGNAL} strokeWidth="1"
            initial={{ scale: 1, opacity: 0.9 }}
            animate={{ scale: [1, 3.2], opacity: [0.9, 0] }}
            transition={{ duration: 2.1, ease: 'easeOut', repeat: Infinity, delay }}
            style={{ transformOrigin: '100px 64px', transformBox: 'view-box' as 'view-box' }}
          />
        ))}
      {/* Lamp — steady red */}
      <circle cx="100" cy="64" r="4" fill={SIGNAL} />
      <text x="100" y="180" fill={INK_MID} fontSize="7" fontFamily="ui-monospace, monospace" letterSpacing="0.24em" textAnchor="middle">
        24/7
      </text>
    </svg>
  );
}

// ---------- shared frame -------------------------------------------------------

function SignatureFrame({ label }: { label: string }) {
  return (
    <g>
      {/* Border with corner registration marks */}
      <rect x="8" y="8" width="184" height="184" fill="none" stroke={INK_FAINT} strokeWidth="0.5" />
      {[
        { x: 8, y: 8, sx: 1, sy: 1 },
        { x: 192, y: 8, sx: -1, sy: 1 },
        { x: 8, y: 192, sx: 1, sy: -1 },
        { x: 192, y: 192, sx: -1, sy: -1 },
      ].map((c, i) => (
        <path
          key={i}
          d={`M 0 6 L 0 0 L 6 0`}
          transform={`translate(${c.x}, ${c.y}) scale(${c.sx}, ${c.sy})`}
          fill="none" stroke={SIGNAL_MID} strokeWidth="0.75"
        />
      ))}
      {/* Label at bottom */}
      <line x1="20" y1="180" x2="52" y2="180" stroke={SIGNAL_MID} strokeWidth="0.5" />
      <text x="20" y="192" fill={INK_MID} fontSize="6.5" fontFamily="ui-monospace, monospace" letterSpacing="0.24em">
        {label}
      </text>
    </g>
  );
}

// ---------- helpers ------------------------------------------------------------

function buildScallop(r: number, points: number) {
  const path: string[] = [];
  const step = (Math.PI * 2) / points;
  for (let i = 0; i < points; i++) {
    const a1 = i * step;
    const a2 = a1 + step / 2;
    const a3 = (i + 1) * step;
    const p1 = { x: Math.cos(a1) * r, y: Math.sin(a1) * r };
    const p2 = { x: Math.cos(a2) * (r + 5), y: Math.sin(a2) * (r + 5) };
    const p3 = { x: Math.cos(a3) * r, y: Math.sin(a3) * r };
    path.push(i === 0 ? `M ${p1.x} ${p1.y}` : '');
    path.push(`Q ${p2.x} ${p2.y} ${p3.x} ${p3.y}`);
  }
  path.push('Z');
  return path.join(' ');
}
