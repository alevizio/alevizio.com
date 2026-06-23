"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * A count-up stat in the live site's style: when it scrolls into view, every
 * numeric token in the value animates up from zero to its target, preserving
 * the surrounding text — units, arrows, tildes, slashes. So "2.9MB → 45KB",
 * "26.57°" and "759" all animate naturally. Reduced motion shows the final
 * value at once. Fires once, when at least half the stat is on screen.
 */
const NUM = /^\d+(?:\.\d+)?$/;
const DURATION = 1100;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

type Token = { text: string; num: number | null; decimals: number };

const tokenize = (value: string): Token[] =>
  value
    .split(/(\d+(?:\.\d+)?)/)
    .filter((part) => part !== "")
    .map((part) => {
      if (!NUM.test(part)) return { text: part, num: null, decimals: 0 };
      const dot = part.indexOf(".");
      return {
        text: part,
        num: Number.parseFloat(part),
        decimals: dot === -1 ? 0 : part.length - dot - 1,
      };
    });

export const AnimatedStat = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  const tokens = tokenize(value);
  const hasNumbers = tokens.some((t) => t.num !== null);

  useEffect(() => {
    if (reducedMotion || !hasNumbers) {
      setProgress(1);
      return;
    }
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();
        let start = 0;
        const tick = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / DURATION, 1);
          setProgress(p);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, hasNumbers]);

  const eased = easeOut(progress);

  return (
    <span ref={ref} className={className}>
      {tokens.map((token, i) =>
        token.num === null ? (
          <span key={i}>{token.text}</span>
        ) : (
          <span key={i} className="tabular-nums">
            {(token.num * eased).toFixed(token.decimals)}
          </span>
        ),
      )}
    </span>
  );
};
