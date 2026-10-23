"use client";

import { useEffect, useRef } from "react";
import { LiveMap } from "./banyan/maps/live-map";

/* How the map puts information on top of the imagery, taken apart: Banyan's
 * live map as its five sheets, one over another, tilted and swaying the way
 * the hero's canopy stands (and leaning toward the pointer like it). The
 * imagery is at the bottom; over it what the satellites saw, the boundary,
 * the alerts and, on top, the controls. Scrolling swings the camera
 * overhead and lays the sheets down, the way the hero flattens its
 * heights, until it's the working map. On a phone, and with less motion,
 * it's the map from the start. */
const GAP = 96; // px between sheets, apart
const TILT = 54; // deg, apart
const SPIN = -26; // deg, apart
// Apart, the stack is drawn smaller and lower, so its raised sheets fit.
const SHRINK = 0.22;
const DROP = 110; // px

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp = (t: number) => Math.min(1, Math.max(0, t));

export const MapLayers = ({ caption }: { caption: string }) => {
  const runway = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = runway.current;
    const st = stage.current;
    if (!el || !st) return;
    const apart = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let raf = 0;
    let visible = false;
    const pointer = { x: 0.5, y: 0.5 };
    const lean = { x: 0.5, y: 0.5 };
    const start = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!apart.matches) {
        for (const v of ["--flat", "--gap", "--tilt", "--spin", "--shrink", "--drop"]) st.style.removeProperty(v);
        el.dataset.stage = "map";
        return;
      }
      const box = el.getBoundingClientRect();
      const travel = box.height - window.innerHeight;
      // Apart for the first stretch of the runway, together by four fifths.
      const flat = ease(clamp(((travel > 0 ? -box.top / travel : 1) - 0.12) / 0.68));
      lean.x += (pointer.x - lean.x) * 0.06;
      lean.y += (pointer.y - lean.y) * 0.06;
      const sway = Math.sin(((now - start) / 1000) * 0.35) * 4 + (lean.x - 0.5) * 10;
      const up = 1 - flat;
      st.style.setProperty("--flat", flat.toFixed(3));
      st.style.setProperty("--gap", `${(up * GAP).toFixed(1)}px`);
      st.style.setProperty("--tilt", `${(up * (TILT + (lean.y - 0.5) * 8)).toFixed(2)}deg`);
      st.style.setProperty("--spin", `${(up * (SPIN + sway)).toFixed(2)}deg`);
      st.style.setProperty("--shrink", (1 - up * SHRINK).toFixed(3));
      st.style.setProperty("--drop", `${(up * DROP).toFixed(1)}px`);
      el.dataset.stage = flat > 0.97 ? "map" : "apart";
      // Keep swaying while it's apart and in view.
      if (visible && up > 0 && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    observer.observe(el);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    apart.addEventListener("change", kick);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", onPointer);
      apart.removeEventListener("change", kick);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return (
    <div ref={runway} className="group/layers relative md:h-[250svh] motion-reduce:h-auto">
      <div ref={stage} className="md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center motion-reduce:static motion-reduce:h-auto">
        <div className="mx-auto w-full max-w-[72rem] [perspective:2400px]">
          <div className="[transform-style:preserve-3d] [transform:translateY(var(--drop,0px))_scale(var(--shrink,1))_rotateX(var(--tilt,0deg))_rotateZ(var(--spin,0deg))] group-data-[stage=apart]/layers:pointer-events-none">
            <LiveMap name="The project map, taken apart" />
          </div>
        </div>
        <p className="type-caption mx-auto mt-4 w-full max-w-[72rem] text-(--tone-text) opacity-[var(--flat,1)]">{caption}</p>
      </div>
    </div>
  );
};
