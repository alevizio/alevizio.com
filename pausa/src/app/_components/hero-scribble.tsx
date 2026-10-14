"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";
import { HERO_SWIRL } from "./hero-swirl-path";

/* The scribble behind the hero is pausa.co's own, the hand-drawn shape with
 * its rough edges, not a redrawn line. It sweeps in once, the way a pen goes
 * round (globals.css, .scribble-sweep), then keeps the motion lab's "boiling
 * line": a turbulence seed stepping a few times a second, so the ink wobbles
 * as if redrawn, with a grain inside it like a dry pen on paper. */
export const HeroScribble = ({ className }: { className?: string }) => {
  const svg = useRef<SVGSVGElement>(null);

  // The boil is SMIL, which CSS can't stop: pause it for reduced motion.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (query.matches ? svg.current?.pauseAnimations() : svg.current?.unpauseAnimations());
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <div className="scribble-sweep">
        <svg ref={svg} viewBox="0 0 1278.71 1053.22" className="block h-auto w-full overflow-visible">
          <defs>
            <filter id="hero-boil" x="-4%" y="-4%" width="108%" height="108%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves={2} seed={1} result="warp">
                <animate attributeName="seed" values="1;2;3;4" dur="0.6s" repeatCount="indefinite" calcMode="discrete" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="warp" scale={10} xChannelSelector="R" yChannelSelector="G" result="ink" />
              {/* grain: fine noise thresholded into speckle, cut out of the ink */}
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} seed={7} result="grain" />
              <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 3.2 -0.75" result="speckle" />
              <feComposite in="ink" in2="speckle" operator="in" />
            </filter>
          </defs>
          <path d={HERO_SWIRL} className="fill-rule" fillOpacity={0.55} filter="url(#hero-boil)" />
        </svg>
      </div>
    </div>
  );
};
