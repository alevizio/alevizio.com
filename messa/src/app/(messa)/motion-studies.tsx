"use client";

import { useEffect, useRef, useState } from "react";
import { Butterfly, ButterflyDefs } from "./butterfly";
import { cn } from "./cn";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/**
 * Motion & interaction, rebuilt natively — three live specimens instead of
 * silent clips, matching the rest of the case study's "rebuilt, not a
 * screenshot" stance:
 *   1. Hover-lift cards — the micro-interaction, live (pure CSS).
 *   2. The throughline — a self-drawing hand underline (SVG dash-offset).
 *   3. Ambient sky — drifting clouds + looping butterflies (CSS + native art).
 *
 * Every loop is in-view aware (IntersectionObserver, so it only animates on
 * screen, like the rest of the site) and respects prefers-reduced-motion,
 * resolving to a sensible static end-state when motion is off.
 */

/**
 * Returns a ref to attach to a stage and whether it's currently on screen.
 * Loops gate on this so they don't run off-screen. Observer is torn down on
 * unmount.
 */
const useInView = <T extends HTMLElement>(): [
  React.RefObject<T | null>,
  boolean,
] => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

type SpecimenStageProps = {
  label: string;
  caption: string;
  className?: string;
  children: React.ReactNode;
  /** Attached to the framed stage for the IntersectionObserver. */
  stageRef?: React.RefObject<HTMLDivElement | null>;
  /** Padded inner stage (specimens) vs. flush (the sky panel paints edge-to-edge). */
  flush?: boolean;
  /** Drop the framed box (border + cream fill) so the specimen sits bare. */
  noStroke?: boolean;
};

/** The shared framing every specimen sits in: mono label, stage, caption. */
const SpecimenStage = ({
  label,
  caption,
  className,
  children,
  stageRef,
  flush = false,
  noStroke = false,
}: SpecimenStageProps) => (
  <figure className={cn("flex flex-col", className)}>
    <figcaption className="font-mono text-xs uppercase tracking-widest text-[#5A6B8F]">
      {label}
    </figcaption>
    <div
      ref={stageRef}
      className={cn(
        "mt-3",
        noStroke
          ? ""
          : "overflow-hidden rounded-xl border border-[#E8D9C5] bg-[#FBF0E6]",
        flush || noStroke ? "" : "px-6 py-10 sm:px-8",
        noStroke && !flush ? "py-4" : "",
      )}
    >
      {children}
    </div>
    <p className="mt-3 text-sm leading-6 text-[#6E6B68]">{caption}</p>
  </figure>
);

/* ——— Specimen 1: hover-lift cards ——— */

type CandidateCard = {
  name: string;
  role: string;
  initials: string;
  /** Avatar background + ink tint. */
  avatarBg: string;
  avatarInk: string;
  verdict: "Strong fit" | "Maybe";
  match: number;
};

const CANDIDATE_CARDS: readonly CandidateCard[] = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    initials: "SC",
    avatarBg: "#E6ECF5",
    avatarInk: "#3F4D6B",
    verdict: "Strong fit",
    match: 92,
  },
  {
    name: "Marcus Hill",
    role: "Product Designer",
    initials: "MH",
    avatarBg: "#E3EFE5",
    avatarInk: "#3E6B4D",
    verdict: "Strong fit",
    match: 88,
  },
  {
    name: "Priya Nair",
    role: "Platform Engineer",
    initials: "PN",
    avatarBg: "#F3EADB",
    avatarInk: "#8A6A2E",
    verdict: "Maybe",
    match: 78,
  },
];

const HoverLiftCards = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {CANDIDATE_CARDS.map((card) => {
      const strong = card.verdict === "Strong fit";
      return (
        <div
          key={card.name}
          tabIndex={0}
          className="group rounded-xl border border-[#E8D9C5] bg-white p-4 shadow-sm outline-none transition duration-200 ease-out hover:-translate-y-1.5 hover:border-[#5A6B8F]/40 hover:shadow-lg focus-within:-translate-y-1.5 focus-within:border-[#5A6B8F]/40 focus-within:shadow-lg focus-visible:ring-2 focus-visible:ring-[#5A6B8F]"
        >
          <div className="flex items-start gap-3">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full font-mono text-sm font-medium"
              style={{ backgroundColor: card.avatarBg, color: card.avatarInk }}
            >
              {card.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#0A0A0B]">
                {card.name}
              </p>
              <p className="truncate text-xs leading-5 text-[#6E6B68]">
                {card.role}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors duration-200",
                strong
                  ? "bg-[#E3EFE5] text-[#3E6B4D] group-hover:bg-[#D6E9DA] group-focus-within:bg-[#D6E9DA]"
                  : "bg-[#F3EADB] text-[#8A6A2E] group-hover:bg-[#EFE2CC] group-focus-within:bg-[#EFE2CC]",
              )}
            >
              {card.verdict}
            </span>
            <span className="font-mono text-sm tabular-nums text-[#5A6B8F]">
              {card.match}%
            </span>
          </div>
        </div>
      );
    })}
  </div>
);

/* ——— Specimen 2: the throughline ——— */

type ThroughlineProps = {
  inView: boolean;
  reducedMotion: boolean;
};

const Throughline = ({ inView, reducedMotion }: ThroughlineProps) => {
  // Re-arm the draw each time it scrolls back into view (and on a gentle loop
  // via the CSS keyframe). A key bump restarts the animation from offset.
  const [armKey, setArmKey] = useState(0);
  useEffect(() => {
    if (inView && !reducedMotion) setArmKey((k) => k + 1);
  }, [inView, reducedMotion]);

  const animate = inView && !reducedMotion;

  return (
    <p className="story-serif text-2xl leading-snug tracking-tight text-[#0A0A0B]">
      We don&rsquo;t make the call &mdash; we help you{" "}
      <span className="relative inline-block whitespace-nowrap">
        see talent clearly
        <svg
          key={armKey}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1 left-0 h-3 w-full overflow-visible"
          viewBox="0 0 240 12"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M2 7.5C40 3.5 78 9 116 6S192 3 238 6.5"
            stroke="#5A6B8F"
            strokeWidth={2.5}
            strokeLinecap="round"
            // pathLength normalizes the dash math regardless of the real path
            // length, so 100 → fully hidden, 0 → fully drawn.
            pathLength={100}
            className={cn(
              "ms-underline",
              animate ? "ms-underline-run" : "ms-underline-static",
            )}
          />
        </svg>
      </span>
      .
    </p>
  );
};

/* ——— Specimen 3: ambient sky ——— */

type AmbientSkyProps = {
  run: boolean;
};

const AmbientSky = ({ run }: AmbientSkyProps) => (
  <div className="relative h-56 w-full bg-[linear-gradient(180deg,#D4E3F0_0%,#E2E9F0_100%)] sm:h-64">
    {/* Drifting clouds — two sprites on different speeds/offsets. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/cloud01.png"
      alt=""
      aria-hidden="true"
      className="ms-cloud ms-cloud-a pointer-events-none absolute top-6 left-0 w-28 select-none opacity-90 sm:w-36"
      data-run={run ? "" : undefined}
    />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/images/cloud02.png"
      alt=""
      aria-hidden="true"
      className="ms-cloud ms-cloud-b pointer-events-none absolute top-16 left-0 w-24 select-none opacity-80 sm:w-28"
      data-run={run ? "" : undefined}
    />

    {/* Butterflies — slate, looping at different sizes/positions/delays. */}
    {run ? (
      <>
        <Butterfly
          className="absolute bottom-[18%] left-[16%] z-10"
          size={30}
          path="a"
          fly={19}
          color="#5A6B8F"
          ink="#3F4D6B"
        />
        <Butterfly
          className="absolute top-[22%] right-[20%] z-10"
          size={22}
          path="b"
          fly={24}
          flap={1.2}
          delay={0.8}
          flip
          tilt={16}
          color="#5A6B8F"
          ink="#3F4D6B"
        />
        <Butterfly
          className="absolute bottom-[30%] left-[52%] z-10"
          size={18}
          path="b"
          fly={27}
          flap={1.1}
          delay={1.6}
          color="#5A6B8F"
          ink="#3F4D6B"
        />
      </>
    ) : (
      // Static end-state: a single butterfly resting, no loop.
      <Butterfly
        className="ms-bf-static absolute bottom-[24%] left-[30%] z-10"
        size={28}
        color="#5A6B8F"
        ink="#3F4D6B"
      />
    )}

    {/* A faint painted-hill silhouette grounding the bottom edge. */}
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-12 bg-[#5A6B8F]/15 [clip-path:ellipse(80%_100%_at_50%_100%)]"
    />
  </div>
);

/* ——— The set ——— */

export const MotionStudies = ({ className }: { className?: string }) => {
  const reducedMotion = usePrefersReducedMotion();
  const [throughlineRef, throughlineInView] = useInView<HTMLDivElement>();
  const [skyRef, skyInView] = useInView<HTMLDivElement>();
  const skyRun = skyInView && !reducedMotion;

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <ButterflyDefs />
      <style>{`
        /* Self-drawing underline. pathLength=100, so offset 100 → hidden. */
        .ms-underline {
          stroke-dasharray: 100;
        }
        .ms-underline-static {
          stroke-dashoffset: 0;
        }
        .ms-underline-run {
          stroke-dashoffset: 100;
          animation: ms-draw-underline 5s ease-in-out 0.2s infinite;
        }
        @keyframes ms-draw-underline {
          0%   { stroke-dashoffset: 100; }
          24%  { stroke-dashoffset: 0; }
          88%  { stroke-dashoffset: 0; }
          /* hold drawn, then a quick reset off-screen-left before redraw */
          100% { stroke-dashoffset: 100; }
        }

        /* Drifting clouds — paused until data-run is present. */
        .ms-cloud {
          animation-play-state: paused;
          animation-fill-mode: both;
          will-change: transform;
        }
        .ms-cloud[data-run] {
          animation-play-state: running;
        }
        .ms-cloud-a {
          animation: ms-drift-a 26s linear infinite;
        }
        .ms-cloud-b {
          animation: ms-drift-b 34s linear infinite;
          animation-delay: -8s;
        }
        @keyframes ms-drift-a {
          from { transform: translateX(-30%); }
          to   { transform: translateX(420%); }
        }
        @keyframes ms-drift-b {
          from { transform: translateX(-40%); }
          to   { transform: translateX(520%); }
        }

        /* Reduced-motion / static fallback: freeze the resting butterfly. */
        .ms-bf-static .messa-bf-stage,
        .ms-bf-static .messa-bf-rotate,
        .ms-bf-static .messa-bf-fig,
        .ms-bf-static .messa-bf-wing {
          animation: none !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .ms-underline-run {
            stroke-dashoffset: 0;
            animation: none;
          }
          .ms-cloud,
          .ms-cloud[data-run] {
            animation: none;
            animation-play-state: paused;
          }
        }
      `}</style>

      {/* Full-width: the hover reel. */}
      <SpecimenStage
        label="Hover"
        caption="Cards lift on hover — the same micro-interaction across the site."
        noStroke
      >
        <HoverLiftCards />
      </SpecimenStage>

      {/* 2-col row: throughline + ambient sky, stacking on mobile. */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <SpecimenStage
          label="The throughline"
          caption="The underline draws itself beneath the two words that matter."
          stageRef={throughlineRef}
          noStroke
        >
          <Throughline
            inView={throughlineInView}
            reducedMotion={reducedMotion}
          />
        </SpecimenStage>

        <SpecimenStage
          label="Ambient"
          caption="Clouds drift and butterflies loop — the ambient motion of the world."
          stageRef={skyRef}
          flush
        >
          <AmbientSky run={skyRun} />
        </SpecimenStage>
      </div>
    </div>
  );
};
