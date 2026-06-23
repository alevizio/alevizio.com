"use client";

import { useEffect, useState } from "react";
import { cn } from "./cn";
import { PAPER_TEXTURE_URL } from "./world";

/**
 * Full-page paper-texture overlay — the simplified port of
 * messa-landing's `paper-texture-overlay.tsx` (the production pattern
 * after the WebGL shader was frozen to a static raster): one committed
 * 61 KB asset, rendered as a fixed multiply layer above the content,
 * alpha-gated so it FADES in once the bitmap has decoded and never
 * pops. The live-shader/calibrator half of the original is left
 * behind; this page only ever needs the snapshot mode.
 */
export const PaperTexture = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = PAPER_TEXTURE_URL;
    const reveal = () => {
      if (!cancelled) setReady(true);
    };
    // decode() resolves when the bitmap is paint-ready, so the reveal
    // frame never janks; on failure reveal anyway — a missing image
    // renders as nothing.
    img.decode().then(reveal, reveal);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-50 bg-[url(/work/messa/world/paper-texture.webp)] bg-cover bg-center mix-blend-multiply transition-opacity duration-[800ms] ease-out select-none",
        ready ? "opacity-[0.26]" : "opacity-0",
      )}
    />
  );
};
