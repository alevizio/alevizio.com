"use client";

import { useEffect, useRef } from "react";
import { cn } from "./cn";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type InViewVideoProps = {
  src: string;
  poster: string;
  width: number;
  height: number;
  /** Accessible description of the silent clip. */
  label: string;
  className?: string;
};

/**
 * A silent, looping clip that only plays while on screen. `preload="none"`
 * keeps it to a poster until the IntersectionObserver wakes it up; under
 * prefers-reduced-motion it never plays and the poster stands in.
 */
export const InViewVideo = ({
  src,
  poster,
  width,
  height,
  label,
  className,
}: InViewVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      width={width}
      height={height}
      aria-label={label}
      className={cn("h-auto w-full", className)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};
