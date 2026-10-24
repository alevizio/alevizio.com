"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { MdSwapHoriz } from "react-icons/md";
import { cn } from "./cn";

/** The divider's sweep the first time it's in view: there and back, so it
 *  reads as something to drag. */
const SWEEP = [50, 22, 78, 50];
const SWEEP_MS = 2600;

/** One picture in two versions, split by a divider to drag (or move with
 *  the arrow keys): the first on the left, the second on the right. The
 *  split is a CSS variable the range input writes, so dragging doesn't
 *  re-render. */
export const Compare = ({
  before,
  after,
  beforeLabel,
  afterLabel,
  control,
  caption,
  sizes,
  className,
  imageClassName,
}: {
  before: { src: StaticImageData; alt: string };
  after: { src: StaticImageData; alt: string };
  beforeLabel: string;
  afterLabel: string;
  /** Names the divider for screen readers. */
  control: string;
  caption?: ReactNode;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) => {
  const frame = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const split = (value: number) => frame.current?.style.setProperty("--split", `${value}%`);

  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
    el.addEventListener("pointerdown", cancel);
    el.addEventListener("keydown", cancel);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        observer.disconnect();
        const start = performance.now();
        const legs = SWEEP.length - 1;
        const step = (now: number) => {
          if (cancelled) return;
          const t = Math.min(1, (now - start) / SWEEP_MS) * legs;
          const leg = Math.min(legs - 1, Math.floor(t));
          const k = t - leg;
          const eased = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
          const value = SWEEP[leg] + (SWEEP[leg + 1] - SWEEP[leg]) * eased;
          split(value);
          if (input.current) input.current.value = String(Math.round(value));
          if (t < legs) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      cancel();
      observer.disconnect();
      el.removeEventListener("pointerdown", cancel);
      el.removeEventListener("keydown", cancel);
    };
  }, []);

  const chip = "pointer-events-none absolute top-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] font-medium tracking-[0.08em] text-white uppercase";

  return (
    <figure data-reveal="frame" className={className}>
      <div
        ref={frame}
        className={cn(
          "relative overflow-hidden rounded-[10px] [--split:50%] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-current",
          imageClassName,
        )}
      >
        <Image src={before.src} alt={before.alt} sizes={sizes} placeholder="blur" className="block h-auto w-full" />
        <Image src={after.src} alt={after.alt} sizes={sizes} className="absolute inset-0 size-full [clip-path:inset(0_0_0_var(--split))]" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-(--split) w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.25)]">
          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-white text-black shadow-md">
            <MdSwapHoriz className="size-5" />
          </span>
        </span>
        <span className={cn(chip, "left-3")}>{beforeLabel}</span>
        <span className={cn(chip, "right-3")}>{afterLabel}</span>
        <input
          ref={input}
          type="range"
          min={0}
          max={100}
          defaultValue={50}
          aria-label={control}
          onInput={(e) => split(Number(e.currentTarget.value))}
          className="absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
        />
      </div>
      {caption ? <figcaption className="type-caption mt-3 text-(--tone-text)">{caption}</figcaption> : null}
    </figure>
  );
};
