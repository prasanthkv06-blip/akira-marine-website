'use client';

import { useEffect, useRef } from 'react';

/**
 * Molten Sump at Dawn — WebGL2 fragment shader hero background.
 *
 * Design constants (locked, treat as brand assets — do NOT tune during polish):
 *   - Anisotropic stretch:    3:1 along axis, rotated 15deg off horizontal
 *   - Slow noise period:      ~47s (drift speeds 0.04 / 0.09 uv/s on two octaves)
 *   - Specular smoothstep:    0.62 → 0.68 (narrow highlight band)
 *   - Cursor gaussian radius: 0.18 uv, exp falloff
 *   - Palette:                navy #030711, gold #C5A24C, gold-peak #E8CC7A
 *
 * Runtime:
 *   - rAF loop guarded by document.visibilityState (zero CPU when tab hidden)
 *   - Warm-start: uTime seeded at +8s so first paint has already-drifted metal
 *   - DPR halved on mobile (<= 768px) — shader is fill-rate bound
 *   - prefers-reduced-motion: renders one static frame, then bails out of the loop
 */

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;

in  vec2 vUv;
out vec4 outColor;

uniform float uTime;
uniform vec2  uMouse;         // 0..1, or (-1,-1) when unavailable
uniform vec2  uResolution;
uniform float uReducedMotion; // 0 or 1

// -- hash + value noise ---------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(233.34, 851.73));
  p += dot(p, p + 23.45);
  return fract(p.x * p.y);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.05;
    a *= 0.5;
  }
  return v;
}

// -- anisotropic transforms ------------------------------------------------
mat2 rot(float rad) {
  float c = cos(rad);
  float s = sin(rad);
  return mat2(c, -s, s, c);
}
// 3:1 stretch along axis then rotate 15deg off horizontal — machined-metal grain, not lava-lamp goo
vec2 aniso(vec2 uv) {
  vec2 centred = uv - 0.5;
  mat2 stretch = mat2(1.0/3.0, 0.0, 0.0, 1.0);
  vec2 s = stretch * centred;
  return rot(radians(15.0)) * s + 0.5;
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 uv = vUv;
  vec2 uvAsp = vec2(uv.x * aspect, uv.y);

  // Cursor gaussian bump — parts the surface like oil skin
  float bump = 0.0;
  if (uReducedMotion < 0.5 && uMouse.x >= 0.0) {
    vec2 mouseAsp = vec2(uMouse.x * aspect, uMouse.y);
    float d = distance(uvAsp, mouseAsp);
    bump = exp(-pow(d / 0.18, 2.0));
  }

  vec2 sp = aniso(uv);
  vec2 disp = (uv - uMouse) * bump * 0.055;
  sp += disp;

  // Two octaves drifting in slightly different directions — no dominant beat
  vec2 flow1 = vec2( uTime * 0.010,  uTime * 0.0028);   // slow, along stretch axis
  vec2 flow2 = vec2(-uTime * 0.008,  uTime * 0.014);    // slower, cross direction
  float n1 = fbm(sp * 3.2 + flow1);
  float n2 = fbm(sp * 5.4 + flow2);
  float n  = n1 * 0.6 + n2 * 0.4;

  // Palette
  vec3 navy      = vec3(0.012, 0.028, 0.067); // #030711
  vec3 wellNavy  = vec3(0.038, 0.052, 0.080); // #0A0D14 — deep well shadow
  vec3 gold      = vec3(0.773, 0.635, 0.298); // #C5A24C
  vec3 goldPeak  = vec3(0.910, 0.800, 0.478); // #E8CC7A

  // Base is a soft radial well toward navy — the eye reads a container, not a wall
  float vig = smoothstep(0.95, 0.15, distance(uv, vec2(0.5, 0.55)));
  vec3 base = mix(wellNavy, navy, vig);

  // Gold film — brushed
  float goldMask = smoothstep(0.52, 0.74, n);
  vec3 col = mix(base, gold, goldMask * 0.55);

  // Narrow specular crest — the highlight that makes it read as light on liquid
  float spec = smoothstep(0.62, 0.68, n);
  col = mix(col, goldPeak, spec * 0.65);

  // Cursor slightly warms the local specular
  col += goldPeak * bump * 0.05;

  // Micro grain — kills WebGL banding, adds material warmth
  float g = fract(sin(dot(uv * uResolution, vec2(12.9898, 78.233))) * 43758.5453);
  col += (g - 0.5) * 0.025;

  // Edge vignette — keeps eye on centre without a hard mask
  float edge = smoothstep(0.45, 1.05, distance(uv - vec2(0.0, 0.05), vec2(0.5)));
  col *= mix(1.0, 0.72, edge);

  outColor = vec4(col, 1.0);
}
`;

interface HeroLiquidMetalProps {
  className?: string;
}

const WARM_START_SECONDS = 8;
const MOBILE_BREAKPOINT = 768;

export function HeroLiquidMetal({ className }: HeroLiquidMetalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) {
      // Silent fallback — background will show the CSS gradient already on the parent.
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;

    // -- compile ---------------------------------------------------------
    function compile(type: number, src: string): WebGLShader {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // Compilation failure: bail out silently — hero still legible on gradient bg.
      return;
    }
    gl.useProgram(prog);

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uResolution = gl.getUniformLocation(prog, 'uResolution');
    const uReducedMotion = gl.getUniformLocation(prog, 'uReducedMotion');
    gl.uniform1f(uReducedMotion, reduce);

    // -- resize ---------------------------------------------------------
    function resize() {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);
      const scale = isMobile ? 0.5 : 1;      // shader is fill-rate bound — halve on mobile
      const w = Math.floor(canvas!.clientWidth * dpr * scale);
      const h = Math.floor(canvas!.clientHeight * dpr * scale);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
        gl!.uniform2f(uResolution, w, h);
      }
    }

    // -- mouse ----------------------------------------------------------
    let mouseX = -1;
    let mouseY = -1;
    function onMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouseX = (e.clientX - r.left) / r.width;
      mouseY = 1.0 - (e.clientY - r.top) / r.height;
    }
    function onLeave() {
      mouseX = -1;
      mouseY = -1;
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave, { passive: true });

    // -- render loop ----------------------------------------------------
    resize();
    const resizeObs = new ResizeObserver(resize);
    resizeObs.observe(canvas);

    const start = performance.now() / 1000 - WARM_START_SECONDS;

    function frame() {
      if (document.visibilityState !== 'visible') {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      const t = performance.now() / 1000 - start;
      gl!.uniform1f(uTime, t);
      gl!.uniform2f(uMouse, mouseX, mouseY);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      if (reduce) return; // static frame, no loop
      rafRef.current = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      resizeObs.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(vbo);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{
        // CSS fallback — visible until WebGL first draws, and if WebGL is unavailable
        background:
          'radial-gradient(ellipse at 50% 55%, #0A0D14 0%, #030711 65%)',
      }}
    />
  );
}
