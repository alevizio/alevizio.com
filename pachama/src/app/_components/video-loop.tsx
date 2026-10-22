"use client";

import { useEffect, useRef } from "react";

/** A silent loop that plays inline, and stays on its poster for anyone who
 *  has asked their system for less motion. */
export const VideoLoop = ({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster: string;
  /** What it shows, for screen readers. */
  label: string;
  className?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) video.pause();
      else video.play().catch(() => {});
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={className}
    />
  );
};
