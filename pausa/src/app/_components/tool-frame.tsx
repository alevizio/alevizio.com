"use client";

import { useEffect, useRef } from "react";
import type { Tool } from "./media";

/* A tool shown whole, never cropped: a recording of it working, playing
 * only while it's on screen. With reduced motion it doesn't start by
 * itself; the poster frame stands in, with controls to play it. */
export const ToolFrame = ({ tool, className }: { tool: Tool; className?: string }) => {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.controls = true;
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-xl bg-panel ring-1 ring-rule">
        <video
          ref={video}
          src={tool.video}
          poster={tool.poster}
          width={1920}
          height={1200}
          muted
          loop
          playsInline
          preload="none"
          aria-label={tool.alt}
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-4 max-w-[40rem]">
        <span className="type-label block text-pen">{tool.name}</span>
        <span className="type-secondary mt-1.5 block text-body">{tool.caption}</span>
      </figcaption>
    </figure>
  );
};
