"use client";

import { useEffect } from "react";
import { cn } from "./cn";
import { useInView } from "./use-in-view";

/* Pausa's hand, written rather than shown. When the line comes into view the
 * ink follows the pen glyph by glyph, at a writing pace, lifting between
 * words and running on line by line. It is measured from the laid-out text,
 * so the reveal follows the real glyphs at any width. The text shows whole
 * for reduced motion and before the script runs. */

const MS_PER_EM = 150; // pen speed: a glyph half an em wide takes 75 ms
const LIFT_MS = 110; // the pen lifting between words
const PAD_EM = 0.45; // room for Caveat's loops above, below and either side

type Line = { top: number; bottom: number; left: number };

// Everything above the current line is written; on it, ink up to x. Always
// six points, so the browser can interpolate from one keyframe to the next.
const reveal = (x: number, line: number, lines: Line[], width: number, pad: number) => {
  const top = lines[0].top - pad;
  const lineTop = line === 0 ? top : (lines[line - 1].bottom + lines[line].top) / 2;
  const lineBottom = line === lines.length - 1 ? lines[line].bottom + pad : (lines[line].bottom + lines[line + 1].top) / 2;
  const pts = [
    [-pad, top],
    [width + pad, top],
    [width + pad, lineTop],
    [x, lineTop],
    [x, lineBottom],
    [-pad, lineBottom],
  ];
  return { clipPath: `polygon(${pts.map(([px, py]) => `${px.toFixed(1)}px ${py.toFixed(1)}px`).join(", ")})` };
};

const write = (el: HTMLElement, delay: number) => {
  const text = el.firstChild;
  if (!(text instanceof Text)) return undefined;
  const box = el.getBoundingClientRect();
  const em = parseFloat(getComputedStyle(el).fontSize);
  const pad = em * PAD_EM;
  const range = document.createRange();
  range.selectNodeContents(el);
  const lines: Line[] = [...range.getClientRects()]
    .filter((r) => r.width > 0)
    .map((r) => ({ top: r.top - box.top, bottom: r.bottom - box.top, left: r.left - box.left }));
  if (!lines.length) return undefined;

  const lineOf = (r: DOMRect) => {
    const mid = (r.top + r.bottom) / 2 - box.top;
    const i = lines.findIndex((l) => mid >= l.top - 1 && mid <= l.bottom + 1);
    return i < 0 ? 0 : i;
  };

  const frames: { t: number; x: number; line: number }[] = [{ t: 0, x: lines[0].left - pad, line: 0 }];
  let t = 0;
  let line = 0;
  for (let i = 0; i < text.length; i++) {
    range.setStart(text, i);
    range.setEnd(text, i + 1);
    const r = range.getBoundingClientRect();
    if (/\s/.test(text.data[i]) || r.width === 0) {
      t += LIFT_MS;
      frames.push({ t, x: frames[frames.length - 1].x, line });
      continue;
    }
    const at = lineOf(r);
    if (at !== line) {
      // the pen goes back to the start of the next line
      line = at;
      t += 1;
      frames.push({ t, x: lines[line].left - pad, line });
    }
    t += Math.max(35, ((r.right - r.left) / em) * MS_PER_EM);
    frames.push({ t, x: r.right - box.left, line });
  }
  if (t === 0) return undefined;

  return el.animate(
    frames.map((f) => ({ offset: f.t / t, ...reveal(f.x, f.line, lines, box.width, pad) })),
    { duration: t, delay, easing: "linear", fill: "backwards" },
  );
};

/** A line in the hand that writes itself out once it is on screen. */
export const Written = ({ children, delay = 0, className }: { children: string; delay?: number; className?: string }) => {
  const [ref, inView] = useInView<HTMLSpanElement>(0.9);

  // Before it is reached the ink is hidden; with reduced motion it never is.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!inView) {
      el.dataset.written = "waiting";
      return;
    }
    const animation = write(el, delay);
    delete el.dataset.written;
    return () => animation?.cancel();
  }, [inView, delay, ref]);

  return (
    <span ref={ref} className={cn("inline-block max-w-full", className)}>
      {children}
    </span>
  );
};
