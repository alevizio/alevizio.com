"use client";

import p1 from "@/assets/evaluation/page-1.jpg";
import p2 from "@/assets/evaluation/page-2.jpg";
import p3 from "@/assets/evaluation/page-3.jpg";
import p4 from "@/assets/evaluation/page-4.jpg";
import p5 from "@/assets/evaluation/page-5.jpg";
import p6 from "@/assets/evaluation/page-6.jpg";
import p7 from "@/assets/evaluation/page-7.jpg";
import p8 from "@/assets/evaluation/page-8.jpg";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { cn } from "../cn";
import { ARROW } from "../slider";

/* Evaluation 2.2, the eight pages Pachama gave buyers, as a little book:
 * four leaves that turn around the spine, the cover alone at the start and
 * the glossary alone at the end, the book sliding over so what's open sits
 * in the middle. It reads itself while it's in view (a leaf every few
 * seconds, then back to the cover), holds while it's pointed at, and the
 * arrows turn it by hand. With less motion it only turns by hand. */
const LEAVES: { front: StaticImageData; back: StaticImageData; alt: [string, string] }[] = [
  { front: p1, back: p2, alt: ["The cover: Pachama's latest criteria, how we find the highest quality forest carbon projects", "Project Evaluation Criteria 2.2: is the climate benefit additional, conservative and durable, and are there impacts beyond carbon"] },
  { front: p3, back: p4, alt: ["Is the climate benefit additional? Baseline emissions, project emissions and leakage", "Is the climate benefit based on conservative claims? The baseline, the project boundary and leakage"] },
  { front: p5, back: p6, alt: ["Is the climate benefit durable? Monitoring, fire and other risks, forest management and the buffer pool", "Financial and legal additionality, forest maturity and ongoing monitoring"] },
  { front: p7, back: p8, alt: ["What are the project's impacts beyond carbon? Free, prior and informed consent, and what's next", "A glossary, from additionality to verification"] },
];
const PAGES = LEAVES.length * 2;
const TURN_MS = 3200;
const FLIP_MS = 900;
// Leaves stack by where they lie: on the right the next to turn is on top,
// on the left the last turned; the one turning rides over both.
const Z_RIGHT = ["z-[4]", "z-[3]", "z-[2]", "z-[1]"];
const Z_LEFT = ["z-[10]", "z-[11]", "z-[12]", "z-[13]"];

export const EvaluationBook = ({ className }: { className?: string }) => {
  const root = useRef<HTMLDivElement>(null);
  const [turned, setTurned] = useState(0);
  const [moving, setMoving] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const last = LEAVES.length;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= 0.5), { threshold: [0, 0.5] });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const go = (next: number) => {
    if (next === turned || next < 0 || next > last) return;
    setMoving(next > turned ? turned : turned - 1);
    setTurned(next);
  };

  // Reading on its own: a leaf at a time, then a beat on the glossary and
  // back to the cover.
  useEffect(() => {
    if (!inView || held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(
      () => {
        setMoving(turned >= last ? null : turned);
        setTurned(turned >= last ? 0 : turned + 1);
      },
      turned === last ? TURN_MS * 1.5 : TURN_MS,
    );
    return () => window.clearTimeout(id);
  }, [inView, held, turned, last]);

  useEffect(() => {
    if (moving === null) return;
    const id = window.setTimeout(() => setMoving(null), FLIP_MS + 50);
    return () => window.clearTimeout(id);
  }, [moving]);

  // Closed on the cover, the book sits a page to the right; closed on the
  // glossary, a page to the left: what's showing stays centred.
  const shift = turned === 0 ? "-translate-x-1/4" : turned === last ? "translate-x-1/4" : "translate-x-0";

  return (
    <div ref={root} className={cn("grid justify-items-center gap-6", className)} onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
      <div className="w-full max-w-[56rem] [perspective:2400px]">
        <div className={cn("relative aspect-[1224/792] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none", shift)}>
          {LEAVES.map((leaf, i) => {
            const isTurned = i < turned;
            return (
              <div
                key={leaf.alt[0]}
                className={cn(
                  "absolute inset-y-0 left-1/2 w-1/2 origin-left transition-transform duration-[900ms] ease-[cubic-bezier(0.45,0,0.2,1)] [transform-style:preserve-3d] motion-reduce:transition-none",
                  isTurned ? "[transform:rotateY(-180deg)]" : "[transform:rotateY(0deg)]",
                  moving === i ? "z-50" : isTurned ? Z_LEFT[i] : Z_RIGHT[i],
                )}
              >
                <Face src={leaf.front} alt={i === turned ? leaf.alt[0] : ""} />
                <Face src={leaf.back} alt={i === turned - 1 ? leaf.alt[1] : ""} back />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Turn back a page" disabled={turned === 0} onClick={() => go(turned - 1)} className={ARROW}>
          <MdArrowBack aria-hidden className="size-5" />
        </button>
        <p aria-live="polite" className="min-w-[9rem] text-center font-mono text-[13px] text-(--tone-text)">
          {turned === 0 ? "Cover" : turned === last ? `Page ${PAGES} of ${PAGES}` : `Pages ${turned * 2} and ${turned * 2 + 1} of ${PAGES}`}
        </p>
        <button type="button" aria-label="Turn the page" disabled={turned === last} onClick={() => go(turned + 1)} className={ARROW}>
          <MdArrowForward aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
};

/** One side of a leaf: the page, with a little shading toward the spine. */
const Face = ({ src, alt, back = false }: { src: StaticImageData; alt: string; back?: boolean }) => (
  <div className={cn("absolute inset-0 overflow-hidden bg-white shadow-[0_18px_40px_rgb(20_26_23/0.18)] [backface-visibility:hidden]", back ? "rounded-l-[6px] [transform:rotateY(180deg)]" : "rounded-r-[6px]")}>
    <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 448px, 50vw" className="object-cover" />
    <span aria-hidden className={cn("absolute inset-y-0 w-10", back ? "right-0 bg-linear-to-l from-black/12 to-transparent" : "left-0 bg-linear-to-r from-black/12 to-transparent")} />
  </div>
);
