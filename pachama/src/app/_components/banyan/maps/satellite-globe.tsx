"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../../cn";
import { BN } from "../ui";

/* Banyan's minimap globe, live: the satellite earth from the Figma (with
 * its fires) wrapped onto a sphere and drawn per pixel on a canvas, in a
 * soft glacier glow. It turns on its own, a drag turns it by hand, and the
 * four buttons fly to the views the Figma shows. The globe and the buttons
 * can be placed apart (globeClassName, pillsClassName), for a big globe. */
const VIEWS = [
  { id: "sa", label: "South America", lon: -60, lat: -15 },
  { id: "af", label: "Africa", lon: 20, lat: 2 },
  { id: "as", label: "Asia", lon: 95, lat: 25 },
  { id: "na", label: "North America", lon: -100, lat: 38 },
] as const;
type ViewId = (typeof VIEWS)[number]["id"];

const RAD = Math.PI / 180;
const TEX_W = 2048;
const TEX_H = 1024;
// The canvas's own size, at most: a big globe is drawn at this and scaled
// up, which the texture's detail allows, so every frame stays quick.
const MAX_PX = 760;

const loadPixels = (src: string) =>
  new Promise<Uint8ClampedArray>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = TEX_W;
      c.height = TEX_H;
      const g = c.getContext("2d", { willReadFrequently: true });
      if (!g) return reject(new Error("no 2d"));
      g.drawImage(img, 0, 0, TEX_W, TEX_H);
      resolve(g.getImageData(0, 0, TEX_W, TEX_H).data);
    };
    img.onerror = reject;
    img.src = src;
  });

export const SatelliteGlobe = ({ className, globeClassName, pillsClassName }: { className?: string; globeClassName?: string; pillsClassName?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<ViewId>("sa");
  const target = useRef<{ lon: number; lat: number }>({ lon: VIEWS[0].lon, lat: VIEWS[0].lat });

  useEffect(() => {
    const v = VIEWS.find((x) => x.id === view);
    if (v) target.current = { lon: v.lon, lat: v.lat };
  }, [view]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let earth: Uint8ClampedArray | null = null;
    let fires: Uint8ClampedArray | null = null;
    Promise.all([loadPixels("/screens/earth.jpg"), loadPixels("/screens/fires.png")])
      .then(([e, f]) => {
        earth = e;
        fires = f;
        kick();
      })
      .catch(() => {});

    const now = { lon: target.current.lon, lat: target.current.lat };
    let lastInput = 0;
    let raf = 0;
    let visible = true;
    const drag = { on: false, x: 0, y: 0 };

    const draw = (t: number) => {
      raf = 0;
      if (!earth || !fires) return;
      // Left alone for a moment, it turns again, about ten degrees a second.
      const idle = !drag.on && t - lastInput > 1500;
      if (!still && idle) target.current = { ...target.current, lon: target.current.lon + 0.16 };
      const ease = still ? 1 : 0.08;
      let dLon = target.current.lon - now.lon;
      dLon = ((((dLon + 180) % 360) + 360) % 360) - 180;
      now.lon += dLon * ease;
      now.lat += (target.current.lat - now.lat) * ease;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const size = Math.min(MAX_PX, Math.round(canvas.clientWidth * dpr));
      if (canvas.width !== size || canvas.height !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      const out = ctx.createImageData(size, size);
      const d = out.data;
      const r = size / 2 - 1;
      const sl = Math.sin(now.lat * RAD);
      const cl = Math.cos(now.lat * RAD);
      const lon0 = now.lon * RAD;
      for (let py = 0; py < size; py++) {
        const y = (r - py) / r;
        for (let px = 0; px < size; px++) {
          const x = (px - r) / r;
          const rho2 = x * x + y * y;
          if (rho2 > 1) continue;
          const z = Math.sqrt(1 - rho2);
          // Inverse orthographic: screen point -> latitude, longitude.
          const lat = Math.asin(z * sl + y * cl);
          const lon = lon0 + Math.atan2(x, z * cl - y * sl);
          let u = ((lon / (2 * Math.PI) + 0.5) % 1 + 1) % 1;
          const v = 0.5 - lat / Math.PI;
          u = Math.floor(u * TEX_W);
          const ti = (Math.min(TEX_H - 1, Math.floor(v * TEX_H)) * TEX_W + u) * 4;
          // Light from the upper left, a touch of limb darkening.
          const shade = 0.55 + 0.45 * Math.max(0, z * 0.8 + (-x + y) * 0.25);
          const fa = fires[ti + 3] / 255;
          const o = (py * size + px) * 4;
          d[o] = Math.min(255, earth[ti] * shade * (1 - fa) + 255 * fa);
          d[o + 1] = Math.min(255, earth[ti + 1] * shade * (1 - fa) + 90 * fa);
          d[o + 2] = Math.min(255, earth[ti + 2] * shade * (1 - fa) + 40 * fa);
          d[o + 3] = rho2 > 0.985 ? Math.round(255 * (1 - rho2) / 0.015) : 255;
        }
      }
      ctx.putImageData(out, 0, 0);
      if (!still && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onDown = (e: PointerEvent) => {
      drag.on = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.on) return;
      const k = 180 / canvas.clientWidth;
      target.current = {
        lon: target.current.lon - (e.clientX - drag.x) * k,
        lat: Math.max(-60, Math.min(60, target.current.lat + (e.clientY - drag.y) * k)),
      };
      drag.x = e.clientX;
      drag.y = e.clientY;
      lastInput = performance.now();
      kick();
    };
    const onUp = () => {
      drag.on = false;
      lastInput = performance.now();
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
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, []);

  // Without motion the loop doesn't run: redraw on a new view.
  useEffect(() => {
    ref.current?.dispatchEvent(new PointerEvent("pointerup"));
  }, [view]);

  return (
    <div className={cn("grid w-full justify-items-center gap-5", className)}>
      {/* A soft glow of atmosphere around it, glacier fading into the dark. */}
      <div className={cn("relative aspect-square w-full max-w-[16rem] rounded-full bg-[#0b1630] shadow-[0_0_24px_4px_rgb(132_225_255/0.45),0_0_80px_24px_rgb(132_225_255/0.16)]", globeClassName)}>
        <canvas ref={ref} role="img" aria-label={`A satellite globe, turned to ${VIEWS.find((v) => v.id === view)?.label}, with fires in red`} className="block size-full cursor-grab touch-none rounded-full active:cursor-grabbing" />
      </div>
      <div role="group" aria-label="Turn the globe to" className={cn("flex flex-wrap justify-center gap-1.5", pillsClassName)}>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => setView(v.id)}
            className={cn("rounded-full border px-3 py-1 text-[12px] leading-5 font-medium transition-colors", view === v.id ? "border-white bg-white text-bn-heavy" : "border-white/30 text-white hover:bg-white/10", BN.focus, "focus-visible:outline-white")}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
};
