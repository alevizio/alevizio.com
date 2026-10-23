"use client";

import { useEffect, useRef } from "react";
import { cn } from "../cn";

/* The dotted globe for Insights, in the brand's dot-grid language: land as
 * dots (public/screens/globe-dots.bin, from scripts/globe/land-dots.cjs),
 * lit by how squarely they face you, drawn on a canvas in orthographic
 * projection. Pick a project and the globe turns to it, its land lights up
 * and a ring ripples out from it. Idle, it turns on its own; drag to turn
 * it yourself; click a pin to pick it. Flat, the same dots unroll into a
 * map centred on where the globe faced, and drag pans it. Without motion
 * it stays still and jumps to each pick and between the two. */
export type GlobePin = { id: string; lon: number; lat: number; on: boolean };

const RAD = Math.PI / 180;
const TILT_LIMIT = 1.05;
const IDLE_MS = 6000;
const SPIN = 0.0016;
const MORPH_MS = 900;

// Low to high, the dots run from pine to lidar green; the glow and the
// ripple are glacier.
const BUCKETS = 7;
const shade = (k: number) => {
  const t = k / (BUCKETS - 1);
  const r = Math.round(46 + (129 - 46) * t);
  const g = Math.round(92 + (241 - 92) * t);
  const b = Math.round(66 + (142 - 66) * t);
  return `rgba(${r},${g},${b},${(0.28 + 0.62 * t).toFixed(2)})`;
};
const SHADES = Array.from({ length: BUCKETS }, (_, k) => shade(k));

const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export const Globe = ({
  pins,
  picked,
  onPick,
  label,
  flat = false,
  className,
}: {
  pins: GlobePin[];
  picked: string;
  onPick: (id: string) => void;
  /** The picked pin's name, shown on the globe. */
  label: string;
  /** Unrolled into a flat map instead of a globe. */
  flat?: boolean;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const state = useRef({ pins, picked, onPick, flat });
  const pickAt = useRef(0);
  const redraw = useRef<() => void>(() => {});

  // The draw loop reads the latest props from here. A new pick restarts the
  // ripple and the turn; without motion the loop doesn't run, so draw once.
  useEffect(() => {
    if (state.current.picked !== picked) pickAt.current = performance.now();
    state.current = { pins, picked, onPick, flat };
    redraw.current();
  }, [pins, picked, onPick, flat]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lon: Float32Array | null = null;
    let cosLat: Float32Array | null = null;
    let sinLat: Float32Array | null = null;
    fetch("/screens/globe-dots.bin")
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        const raw = new Int16Array(buf);
        const n = raw.length / 2;
        lon = new Float32Array(n);
        cosLat = new Float32Array(n);
        sinLat = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          lon[i] = (raw[i * 2] / 100) * RAD;
          const lat = (raw[i * 2 + 1] / 100) * RAD;
          cosLat[i] = Math.cos(lat);
          sinLat[i] = Math.sin(lat);
        }
        kick();
      })
      .catch(() => {});

    // Where the globe faces now, and where it's turning to.
    const view = { lam: -60 * RAD, phi: 8 * RAD };
    const target = { lam: -60 * RAD, phi: 8 * RAD };
    let lastPicked = "";
    let raf = 0;
    let visible = true;
    const drag = { on: false, moved: false, x: 0, y: 0 };
    let lastInput = 0;
    // 0 is the globe, 1 the flat map; it eases between them.
    let morph = state.current.flat ? 1 : 0;
    let lastNow = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return { w, h, dpr, R: Math.min(w, h) * 0.43, cx: w / 2, cy: h / 2 + h * 0.03 };
    };

    // On the globe (orthographic) and on the map (equirectangular, centred
    // on the globe's longitude, as wide as fits), then the mix of the two.
    // Dots on the far side come into view as the globe unrolls.
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const project = (lam: number, cl: number, sl: number, R: number, cx: number, cy: number, w = 0, h = 0) => {
      const d = lam - view.lam;
      const cd = Math.cos(d);
      const sp = Math.sin(view.phi);
      const cp = Math.cos(view.phi);
      const depth = sp * sl + cp * cl * cd;
      const gx = cx + R * cl * Math.sin(d);
      const gy = cy - R * (cp * sl - sp * cl * cd);
      const m = ease(morph);
      if (m <= 0) return { depth, x: gx, y: gy };
      const half = Math.min(w * 0.46, h * 0.88);
      const fx = cx + (wrap(d) / Math.PI) * half;
      const fy = h / 2 - (Math.asin(Math.max(-1, Math.min(1, sl))) / (Math.PI / 2)) * (half / 2);
      return { depth: depth + (0.72 - depth) * m, x: gx + (fx - gx) * m, y: gy + (fy - gy) * m };
    };

    const draw = (now: number) => {
      raf = 0;
      const { pins: list, picked: id } = state.current;
      const pin = list.find((p) => p.id === id);

      // Turn: toward a new pick, otherwise on its own when idle.
      if (pin && id !== lastPicked) {
        lastPicked = id;
        target.lam = pin.lon * RAD;
        target.phi = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, pin.lat * RAD * 0.8));
        lastInput = now;
      }
      const idle = !drag.on && now - Math.max(lastInput, pickAt.current) > IDLE_MS;
      if (!still && idle) target.lam += SPIN;
      const glide = still ? 1 : 0.07;
      view.lam += wrap(target.lam - view.lam) * glide;
      view.phi += (target.phi - view.phi) * glide;
      const goal = state.current.flat ? 1 : 0;
      const dt = lastNow ? now - lastNow : 16;
      lastNow = now;
      morph = still ? goal : morph + Math.sign(goal - morph) * Math.min(Math.abs(goal - morph), dt / MORPH_MS);
      const m = ease(morph);

      const { w, h, dpr, R, cx, cy } = size();
      ctx.clearRect(0, 0, w, h);

      // The body and its atmosphere, fading as the globe unrolls.
      ctx.globalAlpha = 1 - m;
      const halo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.2);
      halo.addColorStop(0, "rgba(132,225,255,0.22)");
      halo.addColorStop(1, "rgba(132,225,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#143523");
      body.addColorStop(1, "#07120c");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (lon && cosLat && sinLat) {
        // One pass: project each dot once, bucket it by how squarely it
        // faces you, and note its glow if a pick is lit.
        const s = 1.6 * dpr;
        const since = (now - pickAt.current) / 1000;
        const wave = still ? -1 : since * 0.9;
        const pl = pin ? pin.lon * RAD : 0;
        const pc = pin ? Math.cos(pin.lat * RAD) : 0;
        const ps = pin ? Math.sin(pin.lat * RAD) : 0;
        const buckets: number[][] = Array.from({ length: BUCKETS }, () => []);
        const glowing: number[] = [];
        for (let i = 0; i < lon.length; i++) {
          const q = project(lon[i], cosLat[i], sinLat[i], R, cx, cy, w, h);
          if (q.depth <= 0) continue;
          buckets[Math.min(BUCKETS - 1, Math.floor(q.depth * BUCKETS))].push(q.x, q.y);
          if (!pin) continue;
          const cosd = ps * sinLat[i] + pc * cosLat[i] * Math.cos(lon[i] - pl);
          const dist = Math.acos(Math.max(-1, Math.min(1, cosd)));
          const ring = wave >= 0 && wave < 3 ? Math.exp(-(((dist - wave) / 0.035) ** 2)) * (1 - wave / 3) : 0;
          const glow = Math.min(1, Math.exp(-((dist / 0.11) ** 2)) + ring) * q.depth;
          if (glow > 0.06) glowing.push(q.x, q.y, glow);
        }
        buckets.forEach((pts, k) => {
          ctx.beginPath();
          ctx.fillStyle = SHADES[k];
          for (let j = 0; j < pts.length; j += 2) ctx.rect(pts[j] - s / 2, pts[j + 1] - s / 2, s, s);
          ctx.fill();
        });
        for (let j = 0; j < glowing.length; j += 3) {
          ctx.fillStyle = `rgba(132,225,255,${glowing[j + 2].toFixed(2)})`;
          ctx.fillRect(glowing[j] - s * 0.65, glowing[j + 1] - s * 0.65, s * 1.3, s * 1.3);
        }
      }

      // Pins: the others small, the pick with a ring that breathes.
      let labelAt: { x: number; y: number } | null = null;
      for (const p of list) {
        if (!p.on) continue;
        const q = project(p.lon * RAD, Math.cos(p.lat * RAD), Math.sin(p.lat * RAD), R, cx, cy, w, h);
        if (q.depth <= 0.05) continue;
        const isPick = p.id === id;
        if (isPick) {
          const pulse = still ? 0.5 : (now / 1400) % 1;
          ctx.strokeStyle = `rgba(129,241,142,${(1 - pulse).toFixed(2)})`;
          ctx.lineWidth = 2 * dpr;
          ctx.beginPath();
          ctx.arc(q.x, q.y, (8 + pulse * 18) * dpr, 0, Math.PI * 2);
          ctx.stroke();
          labelAt = { x: q.x / dpr, y: q.y / dpr };
        }
        ctx.fillStyle = isPick ? "#81f18e" : "#ffffff";
        ctx.strokeStyle = "#07120c";
        ctx.lineWidth = 2 * dpr;
        ctx.beginPath();
        ctx.arc(q.x, q.y, (isPick ? 6.5 : 4.5) * dpr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      const tag = labelRef.current;
      if (tag) {
        tag.style.opacity = labelAt ? "1" : "0";
        if (labelAt) tag.style.transform = `translate(${labelAt.x}px, ${labelAt.y}px) translate(-50%, calc(-100% - 16px))`;
      }

      if (visible && !document.hidden && (!still || morph !== goal)) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    redraw.current = kick;

    // Drag to turn; a click without a drag picks the nearest pin.
    const onDown = (e: PointerEvent) => {
      drag.on = true;
      drag.moved = false;
      drag.x = e.clientX;
      drag.y = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.on) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      const R = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.43;
      target.lam -= dx / R;
      // Flat, a drag only pans east and west.
      if (!state.current.flat) target.phi = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, target.phi + dy / R));
      lastInput = performance.now();
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.on) return;
      drag.on = false;
      lastInput = performance.now();
      if (drag.moved) return;
      const box = canvas.getBoundingClientRect();
      const { w, h, dpr, R, cx, cy } = size();
      const mx = (e.clientX - box.left) * dpr;
      const my = (e.clientY - box.top) * dpr;
      let best: { id: string; d: number } | null = null;
      for (const p of state.current.pins) {
        if (!p.on) continue;
        const q = project(p.lon * RAD, Math.cos(p.lat * RAD), Math.sin(p.lat * RAD), R, cx, cy, w, h);
        if (q.depth <= 0.05) continue;
        const d = Math.hypot(q.x - mx, q.y - my);
        if (d < 22 * dpr && (!best || d < best.d)) best = { id: p.id, d };
      }
      if (best) state.current.onPick(best.id);
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    observer.observe(canvas);
    const onResize = () => kick();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", kick);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full cursor-grab touch-none active:cursor-grabbing" />
      <p
        ref={labelRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 rounded-full bg-white px-3 py-1 text-[13px] leading-5 font-medium whitespace-nowrap text-bn-heavy opacity-0 shadow-md transition-opacity duration-300"
      >
        {label}
      </p>
    </div>
  );
};
