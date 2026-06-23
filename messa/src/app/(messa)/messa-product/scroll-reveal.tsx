"use client";

import {
  useRef,
  useState,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

// Reduced-motion preference, read via useSyncExternalStore so the value is
// available during render instead of being copied into state from an effect
// (which would trigger a cascading re-render). The server snapshot is `false`
// so SSR keeps emitting the hidden pre-reveal style — identical markup, no
// hydration mismatch. The subscription tracks live preference changes.
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeToReducedMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

const getReducedMotionSnapshot = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

const getReducedMotionServerSnapshot = () => false;

export const ScrollReveal = ({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  useEffect(() => {
    // Respect reduced motion preference: the derived flags below render the
    // content instantly with no transition, so no observer is needed.
    if (prefersReducedMotion) return;

    const el = ref.current;
    if (!el) return;

    // Hard fallback: content-visibility:auto on parent sections can prevent
    // IntersectionObserver from firing on mobile WebKit. Reveal after 2s max.
    const fallback = setTimeout(() => { setRevealed(true); }, 2000);

    // Relaxed rootMargin: was -120px (too strict on small screens). 0px
    // triggers as soon as any pixel enters the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback);
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [prefersReducedMotion, threshold]);

  // Reduced motion short-circuits both flags: content is shown immediately
  // and `isDone` strips the inline transition styles entirely.
  const isRevealed = revealed || prefersReducedMotion;
  const isDone = done || prefersReducedMotion;

  // Scroll reveal: no blur — just a gentle opacity fade with a subtle upward
  // drift and quiet scale. Blur is reserved for the first-paint hero reveal.
  // Easing: cubic-bezier(0.22, 1, 0.36, 1) (expo-out) decelerates into rest.
  const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  const duration = 800;

  return (
    <div
      ref={ref}
      className={className}
      style={isDone ? {} : {
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? "translateY(0) scale(1)" : "translateY(12px) scale(0.99)",
        transition: `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms`,
        willChange: "opacity, transform",
      }}
      onTransitionEnd={() => setDone(true)}
    >
      {children}
    </div>
  );
};
