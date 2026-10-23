import { useEffect, useRef, useState, type PointerEvent } from "react";
import { MARK_HEIGHT, MARK_STROKE, MARK_WIDTH, markFrame } from "./logo-mark";

const TURN = Math.PI * 2;
// On load the bar opens from edge-on (150° round, a sliver) through its
// zigzags into the AV; a hover or a tap gives it one full turn.
const INTRO_FROM = TURN * (150 / 360);
const INTRO_MS = 1800;
const SPIN_MS = 1400;
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The AV mark, drawn in 3D from logo-mark.ts. It rests as the AV; it turns in
 * once on load and once per hover or tap. Reduced motion keeps it still.
 */
export const LogoMark = ({ className }: { className?: string }) => {
  const fillRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const turning = useRef(false);
  const raf = useRef(0);
  const [first] = useState(() => markFrame(prefersReducedMotion() ? 0 : INTRO_FROM));

  const turn = (from: number, ms: number, ease: (t: number) => number) => {
    turning.current = true;
    const start = performance.now();
    const step = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      const frame = markFrame(t === 1 ? 0 : from * (1 - ease(t)));
      fillRef.current?.setAttribute("d", frame.fill);
      lineRef.current?.setAttribute("d", frame.lines);
      if (t < 1) raf.current = requestAnimationFrame(step);
      else turning.current = false;
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (!prefersReducedMotion()) turn(INTRO_FROM, INTRO_MS, easeOut);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const spin = (e: PointerEvent) => {
    if (turning.current || prefersReducedMotion()) return;
    if (e.type === "pointerenter" && e.pointerType !== "mouse") return;
    turn(-TURN, SPIN_MS, easeInOut);
  };

  return (
    <svg
      className={`overflow-visible ${className ?? ""}`}
      width={MARK_WIDTH}
      height={MARK_HEIGHT}
      viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`}
      role="img"
      aria-label="Alejandro Vizio"
      onPointerEnter={spin}
      onPointerDown={spin}
    >
      {/* The faces: unpainted, so the background shows through (the hidden
          lines are exact already), but filled for hit-testing, so hovering
          inside the mark still spins it. */}
      <path ref={fillRef} d={first.fill} fill="transparent" />
      <path
        ref={lineRef}
        d={first.lines}
        fill="none"
        stroke="#1E1E1E"
        strokeWidth={MARK_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
