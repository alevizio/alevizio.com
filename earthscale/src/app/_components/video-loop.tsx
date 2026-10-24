"use client";

import { useEffect, useRef } from "react";

/** A silent loop that plays inline while it's on screen, pauses when it
 *  leaves (the page carries a lot of them), and stays on its poster for
 *  anyone who has asked their system for less motion. */
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
    let onScreen = false;
    const apply = () => {
      if (onScreen && !reduce.matches) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        apply();
      },
      { threshold: 0.2 },
    );
    observer.observe(video);
    reduce.addEventListener("change", apply);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", apply);
    };
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
