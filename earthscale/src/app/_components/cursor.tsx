"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

/* A cursor that says what a thing does before it's pressed: a mint ring
 * that trails the pointer, a step behind, and grows over anything to press.
 * Over something marked with data-cursor it becomes a pill with that word
 * in it: Open on a picture, Drag on the globe, Scroll on a device's screen.
 * Small things marked data-magnetic lean toward the pointer as it nears and
 * settle back when it leaves. Only for a mouse or trackpad, and not for
 * anyone who has asked for less motion; the system's own pointer stays. */
const TRAIL = 0.22; // how much of the way to the pointer the ring goes a frame
const PULL = 0.3; // how far a magnetic thing leans, as a share of the pointer's distance from its centre
const PULL_MAX = 10; // px
const EASE_BACK = 0.16; // how much of the way to its lean a magnetic thing goes a frame
const PRESSABLE = "a[href], button, [role='tab'], label, summary";

type Mode = "rest" | "press" | "label";

export const Cursor = () => {
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<Mode>("rest");
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;
    const raf0 = requestAnimationFrame(() => setOn(true));
    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let raf = 0;
    let pulled: HTMLElement | null = null;
    // Each magnetic thing that's leaning: where it is, and where it's going.
    const leans = new Map<HTMLElement, { x: number; y: number; tx: number; ty: number }>();

    const frame = () => {
      rx += (x - rx) * TRAIL;
      ry += (y - ry) * TRAIL;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      for (const [el, l] of leans) {
        l.x += (l.tx - l.x) * EASE_BACK;
        l.y += (l.ty - l.y) * EASE_BACK;
        const settled = el !== pulled && Math.abs(l.x) + Math.abs(l.y) < 0.05;
        el.style.transform = settled ? "" : `translate(${l.x}px, ${l.y}px)`;
        if (settled) leans.delete(el);
      }
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 || leans.size ? requestAnimationFrame(frame) : 0;
    };
    const release = () => {
      const l = pulled && leans.get(pulled);
      if (l) l.tx = l.ty = 0;
      pulled = null;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
      const target = e.target instanceof Element ? e.target : null;
      const named = target?.closest<HTMLElement>("[data-cursor]");
      const word = named?.dataset.cursor ?? "";
      setLabel(word);
      setMode(word ? "label" : target?.closest(PRESSABLE) ? "press" : "rest");
      // Lean the magnetic thing under the pointer toward it, measured
      // without the lean it already has.
      const magnet = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet !== pulled) release();
      if (!magnet) return;
      pulled = magnet;
      const l = leans.get(magnet) ?? { x: 0, y: 0, tx: 0, ty: 0 };
      leans.set(magnet, l);
      const box = magnet.getBoundingClientRect();
      const lean = (d: number) => Math.max(-PULL_MAX, Math.min(PULL_MAX, d * PULL));
      l.tx = lean(x - (box.left + box.width / 2 - l.x));
      l.ty = lean(y - (box.top + box.height / 2 - l.y));
    };
    const leave = () => {
      release();
      if (!raf) raf = requestAnimationFrame(frame);
      setMode("rest");
      x = y = -100;
      rx = ry = -100;
      if (ring.current) ring.current.style.transform = "translate3d(-100px, -100px, 0)";
    };
    const press = () => setDown(true);
    const lift = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", lift, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf0);
      cancelAnimationFrame(raf);
      for (const el of leans.keys()) el.style.transform = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", lift);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (!on) return null;
  return (
    <div ref={ring} aria-hidden className="pointer-events-none fixed top-0 left-0 z-[60] will-change-transform" style={{ transform: "translate3d(-100px, -100px, 0)" }}>
      <div
        className={cn(
          "absolute top-0 left-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[10px] leading-none tracking-[0.12em] whitespace-nowrap uppercase transition-[width,height,background-color,border-color,color,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          mode === "rest" && "h-7 w-7 border-mint/60 bg-transparent text-transparent",
          mode === "press" && "h-11 w-11 border-mint/70 bg-mint/10 text-transparent",
          mode === "label" && "h-8 w-auto border-mint bg-mint px-3.5 text-night",
          down && "scale-90",
        )}
      >
        {mode === "label" ? label : null}
      </div>
    </div>
  );
};
