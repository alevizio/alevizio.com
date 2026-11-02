"use client";

import cividis from "@/assets/colour/globe-cividis.webp";
import inferno from "@/assets/colour/globe-inferno.webp";
import magma from "@/assets/colour/globe-magma.webp";
import plasma from "@/assets/colour/globe-plasma.webp";
import viridis from "@/assets/colour/globe-viridis.webp";
import { useEffect, useRef } from "react";
import { cn } from "./cn";

/* A small globe in one of the ramps, turning, on its picture's corner in the
 * palette: the hero's wind render set in that ramp (scripts/make-colour-
 * globes.py), wrapped on a sphere in a plain canvas, since five more WebGL
 * globes would each hold the hero's large maps. Lit like the hero's: from
 * the upper left, a soft terminator, a mint rim and a little halo, though
 * with a lighter night side, small as it is, and tipped the other way, the
 * north toward the viewer, since the whole disc shows. The five keep one clock, so they turn together and show the same
 * face; with less motion asked for they rest on the North Atlantic. */
const MAPS = [viridis, plasma, inferno, magma, cividis];
const SPIN = 0.3; // radians per second, west to east
const TILT = -0.42; // radians, the north toward the viewer
const RADIUS = 0.8; // the disc's radius as a share of the canvas's half size: the rest is halo
const FACING = -0.1; // turns, the North Atlantic to the front
const FRAME_MS = 33;
const MINT = [160, 255, 215];
const LIGHT = [-0.55, 0.5, 0.65].map((c, _, all) => c / Math.hypot(...all));
const TURN = 2 * Math.PI;

const smooth = (from: number, to: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

// What each pixel of an n by n globe sees, worked out once: where on the
// map before the turn, how lit, and how much of it is globe and halo.
const lay = (n: number) => {
  const [u, v, lit, rim, cover, halo] = Array.from({ length: 6 }, () => new Float32Array(n * n));
  for (let k = 0; k < n * n; k++) {
    const x = (((k % n) + 0.5) / n - 0.5) * (2 / RADIUS);
    const y = (0.5 - (Math.floor(k / n) + 0.5) / n) * (2 / RADIUS);
    const r = Math.hypot(x, y);
    cover[k] = smooth(1, 1 - 2 / (n * RADIUS), r);
    halo[k] = Math.exp(-Math.max(r - 1, 0) * 12) * 0.35;
    if (r >= 1) continue;
    const z = Math.sqrt(1 - r * r);
    const my = y * Math.cos(TILT) - z * Math.sin(TILT);
    const mz = y * Math.sin(TILT) + z * Math.cos(TILT);
    u[k] = Math.atan2(x, mz) / TURN + 0.5;
    v[k] = 0.5 - Math.asin(Math.min(1, Math.max(-1, my))) / Math.PI;
    lit[k] = 0.32 + 0.82 * smooth(-0.3, 0.5, x * LIGHT[0] + y * LIGHT[1] + z * LIGHT[2]);
    rim[k] = (1 - z) ** 3 * 0.45;
  }
  return { u, v, lit, rim, cover, halo };
};

type Texture = { data: Uint8ClampedArray; w: number; h: number };

// One frame: the map read under every pixel, turned by `turn` (in turns),
// blended between texels across and down, then lit.
const draw = (out: Uint8ClampedArray, map: Texture, { u, v, lit, rim, cover, halo }: ReturnType<typeof lay>, turn: number) => {
  const { data, w, h } = map;
  for (let k = 0, o = 0; k < cover.length; k++, o += 4) {
    const c = cover[k];
    const glow = halo[k] * (1 - c);
    const a = c + glow;
    if (a <= 0) {
      out[o + 3] = 0;
      continue;
    }
    const fx = (((u[k] + turn) % 1) + 1) % 1 * w - 0.5;
    const fy = Math.min(Math.max(v[k] * h - 0.5, 0), h - 1);
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const i00 = (y0 * w + ((x0 + w) % w)) * 4;
    const i10 = (y0 * w + ((x0 + 1) % w)) * 4;
    const y1 = Math.min(y0 + 1, h - 1) * w;
    const i01 = (y1 + ((x0 + w) % w)) * 4;
    const i11 = (y1 + ((x0 + 1) % w)) * 4;
    for (let ch = 0; ch < 3; ch++) {
      const texel = (data[i00 + ch] * (1 - tx) + data[i10 + ch] * tx) * (1 - ty) + (data[i01 + ch] * (1 - tx) + data[i11 + ch] * tx) * ty;
      out[o + ch] = ((texel * lit[k] + MINT[ch] * rim[k]) * c + MINT[ch] * glow) / a;
    }
    out[o + 3] = a * 255;
  }
};

export const RampGlobe = ({ ramp, className }: { ramp: number; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const n = Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 3));
    canvas.width = canvas.height = n;
    const layout = lay(n);
    const frame = ctx.createImageData(n, n);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let map: Texture | null = null;
    let raf = 0;
    let last = 0;
    let shown = false;
    let gone = false;

    const paint = (now: number) => {
      if (!map) return;
      draw(frame.data, map, layout, FACING - (still ? 0 : (SPIN * now) / 1000 / TURN));
      ctx.putImageData(frame, 0, 0);
    };
    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        paint(now);
      }
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      if (shown && map && !still) raf = requestAnimationFrame(tick);
    };

    // The map at about a texel a pixel round the equator, so it doesn't shimmer as it turns.
    const image = new Image();
    image.src = MAPS[ramp].src;
    image
      .decode()
      .then(() => {
        if (gone) return;
        const w = 2 * Math.round(Math.min(image.width, Math.max(128, TURN * n * RADIUS * 0.5)) / 2);
        const scaled = document.createElement("canvas");
        scaled.width = w;
        scaled.height = w / 2;
        const sctx = scaled.getContext("2d");
        if (!sctx) return;
        sctx.imageSmoothingQuality = "high";
        sctx.drawImage(image, 0, 0, w, w / 2);
        map = { data: sctx.getImageData(0, 0, w, w / 2).data, w, h: w / 2 };
        paint(performance.now());
        canvas.dataset.ready = "";
        run();
      })
      .catch(() => {});

    const seen = new IntersectionObserver(([entry]) => {
      shown = entry.isIntersecting;
      run();
    });
    seen.observe(canvas);
    return () => {
      gone = true;
      seen.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ramp]);

  return <canvas ref={ref} aria-hidden className={cn("block aspect-square opacity-0 transition-opacity duration-500 data-ready:opacity-100", className)} />;
};
